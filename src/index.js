import createHttp from './http';
import createClient from './client';

export default (apiUrl, token, onPromiseResolved = (promise) => promise) =>
	createClient(createHttp(apiUrl, token, onPromiseResolved));

export {
	createHttp,
	createClient
}
