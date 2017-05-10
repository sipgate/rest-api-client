import createHttp, { httpClass } from './http';
import createClient from './client';

export default (apiUrl, token, onPromiseResolved = promise => promise) =>
	createClient(createHttp(apiUrl, token, onPromiseResolved));

const httpClient = new httpClass();
const client = new Client(httpClient);

export {
	createHttp,
	createClient,
};
