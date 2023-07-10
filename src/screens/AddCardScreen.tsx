import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Keyboard,
    TouchableWithoutFeedback,
    SafeAreaView,
    LayoutChangeEvent,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const FormView = ({ navigation }) => {
    // States
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCVV] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [currentScrollViewContentOffset, setCurrentScrollViewContentOffset] = useState(0);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);

    // Refs
    const scrollViewRef = useRef<ScrollView>(null);
    const cardNumberRef = useRef<TextInput>(null);
    const cardNameRef = useRef<TextInput>(null);
    const expiryDateRef = useRef<TextInput>(null);
    const cvvRef = useRef<TextInput>(null);

    // Form validation
    useEffect(() => {
        validateForm();
    }, [cardNumber, cardName, expiryDate, cvv]);

    // Handle keyboard events
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });

        const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });

        const keyboardWillChangeFrame = Keyboard.addListener('keyboardWillChangeFrame', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });

        const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (e) => {
            setKeyboardHeight(0);
        });

        return () => {
            [
                keyboardDidShowListener,
                keyboardWillShowListener,
                keyboardWillChangeFrame,
                keyboardWillHideListener,
                keyboardDidHideListener,
            ].forEach(listener => listener.remove());
        };
    }, []);

    const validateForm = () => {
        const cardNum = cardNumber.replace(/\s/g, '');
        const isCardNumberValid = cardNum.length === 16 && !isNaN(Number(cardNum));
        const isCardNameValid = cardName.trim().length > 0;
        const isExpiryDateValid = expiryDate.length === 5 && /^\d{2}\/\d{2}$/.test(expiryDate);
        const isCVVValid = cvv.length === 3 && /^\d{3}$/.test(cvv);
        console.log('isCardNumberValid', isCardNumberValid);
        console.log('isCardNameValid', isCardNameValid);
        console.log('isExpiryDateValid', isExpiryDateValid);
        console.log('isCVVValid', isCVVValid);
        // Enable the "Add Card" button if all fields are valid
        setIsFormValid(isCardNumberValid && isCardNameValid && isExpiryDateValid && isCVVValid);
    };

    const handleAddCard = () => {
        if (isFormValid) {
            // TODO: add the card to omise, go back to cards screen
            alert('Card added!');
            navigation.navigate('Home');
        }
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const handleCardNumberChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');

        // Insert spaces after every fourth digit
        let formattedValue = '';
        for (let i = 0; i < numericValue.length; i += 4) {
            formattedValue += numericValue.slice(i, i + 4) + ' ';
        }

        formattedValue = formattedValue.trim();

        setCardNumber(formattedValue);
    };

    const handleExpiryDateChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');

        // Format the input as MM/YY
        let formattedValue = '';
        if (numericValue.length > 0) {
            formattedValue = numericValue.slice(0, 2);
            if (numericValue.length > 2) {
                formattedValue += '/' + numericValue.slice(2, 4);
            }
        }

        setExpiryDate(formattedValue);
    };


    const handleScroll = (event: any) => {
        setCurrentScrollViewContentOffset(event.nativeEvent.contentOffset.y);
    };


    const handleLayout = (event: LayoutChangeEvent) => {
        setScrollViewHeight(event.nativeEvent.layout.height);
    };

    const onFieldFocus = (field: React.RefObject<TextInput>) => {
        field.current?.measure((fx, fy, width, height, px, fieldOffsetTop) => {
            const scrollToOffset = fieldOffsetTop - (scrollViewHeight / 2);
            scrollViewRef.current?.scrollTo({ y: scrollToOffset, animated: true });
        });
    };

    const focusNextField = (nextField: React.RefObject<TextInput>) => {
        nextField.current?.focus();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <SafeAreaView style={[styles.container]}>
                <KeyboardAvoidingView style={{ flex: 1, minHeight: '100%', backgroundColor: 'transparent', }} behavior="padding" keyboardVerticalOffset={100}>
                    <ScrollView
                        ref={scrollViewRef}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        style={[styles.container, { backgroundColor: 'transparent', }]}
                        onLayout={handleLayout}
                    >
                        <View style={styles.formItem}>
                            <Text style={[styles.label, { fontWeight: 'bold' }]}>ATM/Debit/Credit Card Number</Text>
                            <TextInput
                                style={[styles.input, { /* TODO: Color fields border to indicate valid input */ }]}
                                maxLength={19}
                                placeholder="0000 0000 0000 0000"
                                value={cardNumber}
                                ref={cardNumberRef}
                                onChangeText={handleCardNumberChange}
                                returnKeyType="next"
                                onFocus={() => onFieldFocus(cardNumberRef)}
                                keyboardType="numeric"
                                onSubmitEditing={() => focusNextField(cardNameRef)}
                            />
                            <View style={styles.rightAccessoryContainer}>
                                <Image
                                    source={require('../../assets/images/visa_color.png')}
                                    style={styles.icon}
                                />
                                <Image
                                    source={require('../../assets/images/mastercard_color.png')}
                                    style={styles.icon}
                                />
                                <Image
                                    source={require('../../assets/images/jcb_color.png')}
                                    style={styles.icon}
                                />
                            </View>
                            {/* TODO: Embed into input: <Image source={require('../../assets/images/visa_color.png')} style={styles.icon} />
                            <Image source={require('../../assets/images/mastercard_color.png')} style={styles.icon} />
                            <Image source={require('../../assets/images/jcb_color.png')} style={styles.icon} /> */}
                        </View>
                        <View style={styles.formItem}>
                            <Text style={[styles.label, { fontWeight: 'bold' }]}>Name of Card</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ty Lee"
                                value={cardName}
                                onChangeText={setCardName}
                                ref={cardNameRef}
                                onFocus={() => onFieldFocus(cardNameRef)}
                                returnKeyType="next"
                                onSubmitEditing={() => focusNextField(expiryDateRef)}
                            />
                        </View>
                        <View style={[styles.formRow, {}]}>
                            <View style={[styles.formItem, { flex: 1, marginRight: 10 }]}>
                                <Text style={[styles.label, { fontWeight: 'bold' }]}>Expiry Date</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="MM/YY"
                                    value={expiryDate}
                                    onChangeText={handleExpiryDateChange}
                                    ref={expiryDateRef}
                                    onFocus={() => onFieldFocus(expiryDateRef)}
                                    returnKeyType="next"
                                    keyboardType="numeric"
                                    onSubmitEditing={() => focusNextField(cvvRef)}
                                />
                            </View>
                            <View style={[styles.formItem, { flex: 1, }]}>
                                <Text style={[styles.label, { fontWeight: 'bold' }]}>CVV</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="CVV"
                                    value={cvv}
                                    onChangeText={setCVV}
                                    ref={cvvRef}
                                    onFocus={() => onFieldFocus(cvvRef)}
                                    returnKeyType="done"
                                    keyboardType="numeric"
                                    maxLength={3}
                                    onSubmitEditing={dismissKeyboard}
                                />
                            </View>
                        </View>
                        <View style={styles.securePaymentsView}>
                            <Image source={require('../../assets/images/secure_payment.png')} style={styles.securePaymentsImage} />
                        </View>
                    </ScrollView>
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: isFormValid ? 'turquoise' : 'gray', bottom: (keyboardHeight <= 0) ? 20 : keyboardHeight + 8 }]}
                        onPress={handleAddCard}
                        disabled={!isFormValid}
                    >
                        <Text style={styles.buttonText}>Add Card</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        fontSize: 16,
        backgroundColor: '#fff',
        marginTop: StatusBar.currentHeight || 0,
    },
    formItem: {
        marginBottom: 20,
    },
    formRow: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 18,
        fontWeight: '500',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 16,
        textAlign: 'left',
        height: 64,
    },
    verificationIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    securePaymentsView: {
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignSelf: 'center',
        maxHeight: 64,
        paddingBottom: 80,
    },
    icon: {
        width: 35,
        height: 25,
        resizeMode: 'contain',
    },
    securePaymentsImage: {
        width: 220,
        resizeMode: 'contain',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        left: 'auto',
        right: 'auto',
        alignSelf: 'center',
        width: '90%',
        backgroundColor: 'turquoise',
        paddingVertical: 10,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        transition: 'all ease 500ms linear',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    rightAccessoryContainer: {
        position: 'absolute',
        right: 8,
        top: 25 + 16 + 2,
        flexDirection: 'row',
    },
});

export default FormView;
