import createHttp from './createHttp';
import createClient from './createClient';
import HttpClient from './HttpClient';
import RestApiClient from './RestApiClient';

export { HttpClient, RestApiClient, createHttp, createClient };

export default (
	apiUrl,
	token,
	onPromiseResolved = promise => promise,
	skipResponseErrorHandling = false
) =>
	createClient(
		createHttp(apiUrl, token, onPromiseResolved, skipResponseErrorHandling)
	);
