import Constants from 'expo-constants';
import { encode as base64Encode } from 'base-64';
import pkgConfig from '../../package.json';

type OmiseAuthHeaders = { Authorization: string; 'User-Agent': string; 'Content-Type': string; 'Omise-Version'?: string };
type OmiseTokenInputParams = { card: { city: string; expiration_month: number; expiration_year: number; name: string; number: string; postal_code: string; security_code: string; }; };

const API_BASE_URL = 'https://api.omise.co/';
const VAULT_BASE_URL = 'https://vault.omise.co/';
let _publicKey: string;
let _secretKey: string;
let _apiVersion: string;

export default class OmiseClient {

    constructor() {
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

    getHeaders(key: string): OmiseAuthHeaders {
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

    async addCardToCustomer({ customerId, card }: { customerId: string, card: string }): Promise<any> {
        try {
            console.log(`Adding card to customer ${customerId}:`, card);
            const url = `${API_BASE_URL}customers/${customerId}`;
            const headers = this.getHeaders(_secretKey);
            const body = JSON.stringify({
                card,
            });
            console.log('body', body);
            const response = await fetch(url, {
                method: 'PATCH',
                cache: 'no-cache',
                headers,
                body,
            });

            if (response.ok && response.status === 200) {
                return response.json();
            } else {
                console.log("Bad response:", response);
                return response.json();
            }
        } catch (error) {
            console.log('Error adding card to customer');
            return error;
        }
    }

    async createCustomer(data: object): Promise<any> {
        try {
            const url = `${API_BASE_URL}customers`;
            const headers = this.getHeaders(_secretKey);
            const body = JSON.stringify(data);
            console.log('body', body);
            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers,
                body,
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

    async getCustomers(id?: string): Promise<any> {
        console.log('Getting customer...');

        if (id === null) { return new Error('Customer id is required'); }

        try {
            const url = `${API_BASE_URL}customers`;
            const headers = this.getHeaders(_secretKey);

            console.debug('Will fetch from customer url: ' + url);

            const response = await fetch(url, {
                method: 'GET',
                cache: 'no-cache',
                headers,
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

    async getCustomerCards(customerId: string): Promise<any> {
        console.log('Getting customer cards...');

        if (customerId === '' || customerId === null) { return new Error('Customer id is required'); }

        try {
            const url = `${API_BASE_URL}customers/${customerId}/cards`;
            console.debug('Will fetch from customer\'s cards url: ' + url);
            const headers = this.getHeaders(_secretKey);
            const response = await fetch(url, {
                method: 'GET',
                cache: 'no-cache',
                headers,
            });

            if (response.ok && response.status === 200) {
                console.log('Successfully recieved customer\'s cards!');
                const { data }: any = await response.json();
                return data;
            } else {
                console.log('Bad response:', response);
                return response.json();
            }

        } catch (error) {
            console.log('Error getting customer\'s cards');
            return error;
        }
    }

    async createToken(data: OmiseTokenInputParams): Promise<any> {
        try {
            const url = `${VAULT_BASE_URL}tokens`;
            const headers = this.getHeaders(_publicKey)
            const body = JSON.stringify(data);
            console.log('body', body);
            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers,
                body,
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
}
