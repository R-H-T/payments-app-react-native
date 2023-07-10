import Constants from 'expo-constants';
import { encode as base64Encode } from 'base-64';
import pkgConfig from '../../package.json';

const API_BASE_URL = 'https://api.omise.co/';
const VAULT_BASE_URL = 'https://vault.omise.co/';
let _publicKey: string;
let _secretKey: string;
let _apiVersion: string;

export default class OmiseClient {

    constructor() {
        this.config = this.config.bind(this);
        this.getHeaders = this.getHeaders.bind(this);
        this.getCustomers = this.getCustomers.bind(this);
        this.createCustomer = this.createCustomer.bind(this);
        this.createToken = this.createToken.bind(this);
        this.config();
    }

    config() {
        const {
            OMISE_PUBLIC_KEY = '',
            OMISE_SECRET_KEY = '',
            OMISE_API_VERSION = '',
        } = Constants.expoConfig?.extra as { [key: string]: string };

        if (
            OMISE_PUBLIC_KEY === undefined ||
            OMISE_SECRET_KEY === undefined ||
            OMISE_API_VERSION === undefined) {
            throw new Error('Configure the Omise API keys and API version constants in your `app.json` file. (OMISE_PUBLIC_KEY, OMISE_SECRET_KEY, OMISE_API_VERSION)');
        }

        _publicKey = OMISE_PUBLIC_KEY;
        _secretKey = OMISE_SECRET_KEY;
        _apiVersion = OMISE_API_VERSION;
    }

    getHeaders(key) {
        let headers = {
            'Authorization': 'Basic ' + base64Encode(key + ":"),
            'User-Agent': pkgConfig.name + "/" + pkgConfig.version,
            'Content-Type': 'application/json',
        };

        const version = _apiVersion;

        if (version && version !== "") {
            headers['Omise-Version'] = version;
        }

        return headers;
    }

    async getCapabilities() {
        console.log('Getting capabilities...');

        // try {
        //     const result = await Omise.getCapabilities();
        //     console.log('Successfully got capabilities:', result);
        // } catch (error) {
        //     console.log('Error getting capabilities');
        //     console.error(error);
        // }
    }

    async createCustomer(data) {
        const customerEndpoint = `${API_BASE_URL}customers`
        const headers = this.getHeaders(_secretKey)
        try {
            const response = await fetch(customerEndpoint, {
                method: 'POST',
                cache: 'no-cache',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (response.ok && response.status === 200) {
                return response.json();
            } else {
                console.log("Bad response:", response);
                return response.json();
            }
        } catch (error) {
            console.log('Error creating customer');
            return error;
        }
    }

    async getCustomers(id?: string) {
        console.log('Getting customer...');
        if (id === null) { return new Error('Customer id is required'); }
        try {
            const customerEndpoint = `${API_BASE_URL}customers`;
            console.debug('Will fetch from customer endpoint: ' + customerEndpoint);
            const headers = this.getHeaders(_secretKey);
            const response = await fetch(customerEndpoint, {
                method: 'GET',
                cache: 'no-cache',
                headers: headers,
            });
            console.debug(response);
            if (response.ok && response.status === 200) {
                return response.json();
            } else {
                console.log('Bad response:', response);
                return response.json();
            }
        } catch (error) {
            console.log('Error getting customers');
            return error;
        }
    }

    async createToken(data) {
        // let result = null;
        // try {
        //     result = await Omise.createToken({
        //         card: {
        //             name,
        //             city,
        //             postal_code,
        //             number,
        //             expiration_month,
        //             expiration_year,
        //             security_code,
        //         }
        //     })
        //     console.log('Successfully created token', result);
        //     return result;
        // } catch (error) {
        //     console.error(error);
        // }
        try {
            const tokenEndpoint = VAULT_BASE_URL + "tokens";
            const headers = this.getHeaders(_publicKey)
            const response = await fetch(tokenEndpoint, {
                method: 'POST',
                cache: 'no-cache',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (response.ok && response.status === 200) {
                return response.json();
            } else {
                console.log('Bad response', response);
                return response.json();
            }
        } catch (error) {
            console.log('failed to create token');
            return error;
        }
    }

    // TODO: Include functions to create/read/delete cards
    // FIXME: Make the customized omise-react-native library work. The original library didn't hit an issue loading the data. Find out why this one doesn't work.
}
