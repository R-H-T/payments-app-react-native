import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AppContext from './AppContext';
import OmiseClient from '../utils/omise-client';

class CustomError extends Error {
    title?: string;
    errorType?: string | number;
}

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingCards, setFetchingCards] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const [omiseClient] = useState(() => new OmiseClient());
  const [customer, setCustomer] = useState<string | null>(null);
  const [cards, setCards] = useState<any[]>([]);

  const addError = (error: Error) => {
    setErrors((prevErrors) => [...prevErrors, error]);
  };

  const removeError = (error: Error) => {
    setErrors((prevErrors) => {
      const index = prevErrors.indexOf(error);
      if (index !== -1) {
        const newErrors = [...prevErrors];
        newErrors.splice(index, 1);
        return newErrors;
      }
      return prevErrors;
    });
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const showAlert = ({
    title,
    message,
    onPress = () => {},
    cancelable = false,
  }: {
    title: string;
    message: string;
    onPress?: () => void;
    cancelable?: boolean;
  }) => {
    Alert.alert(title, message, [{ text: 'OK', onPress }], { cancelable });
  };

  const createCustomerWithCard = async ({
    tokenId,
    cardName,
    brand,
    number,
    details = null,
    email = null,
  }: {
    tokenId: string;
    cardName: string;
    brand: string;
    number: string;
    details: string;
    email?: string;
  }): Promise<any> => {
    console.debug(
      'Creating customer with the following details:',
      tokenId,
      cardName,
      brand,
      number
    );

    try {
      const customer = await omiseClient.createCustomer({
        name: cardName,
        details: details ? details : `Details for ${cardName}.`,
        email,
        card: tokenId,
      });

      console.debug('Customer created:', customer);

      setCustomer(customer.id);
    } catch (error) {
      const newError = new Error(
        `Failed to create customer ${cardName} token_id: ${tokenId} (${error.message})`
      );
      console.debug(error);
      return newError;
    }
  };

  const submitCard = async (cardData: any) => {
    const {
      city = 'Bangkok',
      expMonth: expiration_month = 2,
      expYear: expiration_year = 2024,
      name = 'Somchai Prasert',
      number = '4242424242424242',
      zip: postal_code = 10320,
      cvv: security_code = 123,
    } = cardData;

    console.log(
      'Submitting card...\n',
      city,
      expiration_month,
      expiration_year,
      name,
      number,
      postal_code,
      security_code
    );

    try {
      const results = await omiseClient.createToken({
        card: {
          city,
          expiration_month,
          expiration_year,
          name,
          number,
          postal_code,
          security_code,
        },
      });

      console.debug('Fetched results: ', results);

      const {
        object,
        id: tokenId,
        card: { name: cardName, brand, last_digits: lastDigits },
      } = results;

      const hasCard = Object.keys(results).includes('card');

      if (object === 'token' && hasCard) {
        if (customer) {
            await omiseClient.addCardToCustomer({ customerId: customer, card: tokenId });
        } else {
            await createCustomerWithCard({
            tokenId,
            cardName,
            brand,
            number: `XXXX-XXXX-XXXX-${lastDigits}`,
            details: 'Customer 1',
            });
        }
        await fetchCards(true);
      } else {
        const error = new CustomError(
          'Could not add new card.\n(Invalid response from server)'
        );
        error.errorType = 1;
        error.title = 'Card could not be added';
        return error;
      }
    } catch (error) {
      setErrors((prevErrors) =>
        errors ? [...prevErrors, error] : [error]
      );

      if (error.errorType === 1) {
        showAlert({ title: error.title, message: error.message });
      }

      return error;
    }
  };

  const fetchCards = async (force=false) => {
    console.log('Fetching cards for customer', customer);

    if (fetchingCards && !force) return;
    
    setFetchingCards(true);

    try {
      const customerCards = await omiseClient.getCustomerCards(customer);
      
      console.debug('Customer cards fetched:', customerCards);
      
      setCards(customerCards);
      setFetchingCards(false);

    } catch (error) {
      const newError = new Error(
        `Failed to fetch customer ${customer}: (${error.message})`
      );
      console.debug(error);
      setFetchingCards(false);
      return newError;
    }
  };

  useEffect(() => {
    // on mount

    return () => {
      // on unmount
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        cards,
        errors,
        loading,
        fetchingCards,
        fetchCards,
        submitCard,
        showAlert,
        addError,
        removeError,
        clearErrors,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
