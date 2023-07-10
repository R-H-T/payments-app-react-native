import Constants from 'expo-constants';

class OmiseClient {

    constructor(options?: any) {
        // const publicKey = Constants.manifest.extra.OMISE_PUBLIC_KEY;
        // const secretKey = Constants.manifest.extra.OMISE_SECRET_KEY;
        // const apiVersion = Constants.manifest.extra.OMISE_API_VERSION;
        // Omise.config(publicKey, secretKey, apiVersion);
    }

    async getCapabilities(): Promise<void> {
        // TODO: Complete this function
        let result: any = null;
        try {
            //result = await Omise.getCapabilities();
            console.log('Successfully got capabilities:', result);
        } catch (error) {
            console.error(error);
        }
    }

    async createToken({
        name,
        city,
        postal_code,
        number,
        expiration_month,
        expiration_year,
        security_code,
    }: {
        name: string;
        city: string;
        postal_code: string;
        number: string;
        expiration_month: number;
        expiration_year: number;
        security_code: string;
    }): Promise<any> {
        let result: any = null;
        try {
            // result = await Omise.createToken({
            //     card: {
            //         name,
            //         city,
            //         postal_code,
            //         number,
            //         expiration_month,
            //         expiration_year,
            //         security_code,
            //     },
            // });
            // console.log('Successfully created token', result);
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    // TODO: Include functions to create/read/delete cards
    // FIXME: Make the customized omise-react-native library work. The original library didn't hit an issue loading the data. Find out why this one doesn't work.
}

export default OmiseClient;
