import promiseCache from './promiseCache';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const defaultHeaders = token => {
	const authorization = token ? `Bearer ${token}` : null;
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'X-Sipgate-Client': 'app.sipgate.com',
	};

	if (authorization) {
		headers.Authorization = authorization;
	}

	return headers;
};

const extractBody = res => res.text();

const parseJSON = text => {
	try {
		return JSON.parse(text);
	} catch (e) {
		return text;
	}
};

const identity = result => result;

const throwResponseError = response =>
	response
		.text()
		.then(body => JSON.parse(body))
		.catch(() => Promise.resolve())
		.then(body => {
			const error = new Error();
			error.payload = {
				status: response.status,
				statusText: response.statusText,
				body,
			};
			throw error;
		});

const isSuccessStatusCode = statusCode => statusCode >= 200 && statusCode < 300;

const handleErrorResponses = response => {
	if (!isSuccessStatusCode(response.status)) {
		return throwResponseError(response);
	}
	return response;
};

export default class HttpClient {
	constructor({
		token = null,
		apiUrl = '',
		onPromiseResolved = identity,
		onUnauthorized = () => {},
		getToken,
		skipResponseErrorHandling = false,
	} = {}) {
		this.token = token;
		this.apiUrl = apiUrl;
		this.onPromiseResolved = onPromiseResolved;
		this.onUnauthorized = onUnauthorized;
		this.skipResponseErrorHandling = skipResponseErrorHandling;
		this.getToken = () => {
			if (getToken instanceof Function) {
				return Promise.resolve(getToken());
			}

			return Promise.resolve(this.token);
		};
	}

	getUnauthenticated = path => this.get(path, false);

	handleUnauthorized = response => {
		if (response.status === 401) {
			this.onUnauthorized();
		}
		return response;
	};

	get = (path, authenticated = true) => {
		const url = this.apiUrl + path;

		if (promiseCache.get(url)) {
			return promiseCache.get(url);
		}

		const tokenPromise = authenticated
			? this.getToken()
			: Promise.resolve(null);

		const promise = tokenPromise
			.then(token =>
				fetch(url, {
					method: 'get',
					headers: defaultHeaders(token),
				})
			)
			.then(this.handleUnauthorized)
			.then(this.skipResponseErrorHandling ? identity : handleErrorResponses)
			.then(this.onPromiseResolved)
			.then(response => {
				promiseCache.bust(url);
				return response;
			})
			.then(extractBody)
			.then(parseJSON)
			.catch(reason => {
				promiseCache.bust(url);
				return Promise.reject(reason);
			});

		promiseCache.set(url, promise);

		return promise;
	};

	del = path =>
		this.getToken()
			.then(token =>
				fetch(this.apiUrl + path, {
					method: 'delete',
					headers: defaultHeaders(token),
				})
			)
			.then(this.handleUnauthorized)
			.then(this.skipResponseErrorHandling ? identity : handleErrorResponses)
			.then(this.onPromiseResolved)
			.then(extractBody)
			.then(parseJSON);

	post = (path, data = {}) =>
		this.getToken()
			.then(token =>
				fetch(this.apiUrl + path, {
					method: 'post',
					body: JSON.stringify(data),
					headers: defaultHeaders(token),
				})
			)
			.then(this.handleUnauthorized)
			.then(this.skipResponseErrorHandling ? identity : handleErrorResponses)
			.then(this.onPromiseResolved)
			.then(extractBody)
			.then(parseJSON);

	put = (path, data = {}) =>
		this.getToken()
			.then(token =>
				fetch(this.apiUrl + path, {
					method: 'put',
					body: JSON.stringify(data),
					headers: defaultHeaders(token),
				})
			)
			.then(this.handleUnauthorized)
			.then(this.skipResponseErrorHandling ? identity : handleErrorResponses)
			.then(this.onPromiseResolved)
			.then(extractBody)
			.then(parseJSON);
}
