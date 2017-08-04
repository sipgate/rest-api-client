import promiseCache from './promiseCache';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const defaultHeaders = (token) => {
	const authorization = token
		? `Bearer ${token}`
		: null;
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

const parseJSON = (text) => {
	try {
		return JSON.parse(text);
	} catch (e) {
		return text;
	}
};

const identity = result => result;

export default class HttpClient {
	constructor({ token = null, apiUrl = '', onPromiseResolved = identity, onUnauthorized = () => {}, getToken } = {}) {
		this.token = token;
		this.apiUrl = apiUrl;
		this.onPromiseResolved = onPromiseResolved;
		this.onUnauthorized = onUnauthorized;
		this.getToken = () => {
			if (getToken instanceof Function) {
				return getToken();
			}

			return this.token;
		};
	}

	getUnauthenticated = path => this.get(path, false);

	handleUnauthorized = (response) => {
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

		const promise = fetch(url, {
			method: 'get',
			headers: defaultHeaders(authenticated ? this.getToken() : null),
		})
			.then(this.handleUnauthorized)
			.then(this.onPromiseResolved)
			.then(
				(response) => {
					promiseCache.bust(url);
					return response;
				},
			)
			.then(extractBody)
			.then(parseJSON)
			.catch((reason) => {
				promiseCache.bust(url);
				return Promise.reject(reason);
			});

		promiseCache.set(url, promise);

		return promise;
	};

	del = path => (
		fetch(this.apiUrl + path, {
			method: 'delete',
			headers: defaultHeaders(this.getToken()),
		})
			.then(this.handleUnauthorized)
			.then(this.onPromiseResolved)
			.then(extractBody)
			.then(parseJSON)
	);

	post = (path, data = {}) => (
		fetch(this.apiUrl + path, {
			method: 'post',
			body: JSON.stringify(data),
			headers: defaultHeaders(this.getToken()),
		})
			.then(this.handleUnauthorized)
			.then(this.onPromiseResolved)
			.then(extractBody)
			.then(parseJSON)
	);

	put = (path, data = {}) => (
		fetch(this.apiUrl + path, {
			method: 'put',
			body: JSON.stringify(data),
			headers: defaultHeaders(this.getToken()),
		})
			.then(this.handleUnauthorized)
			.then(this.onPromiseResolved)
			.then(extractBody)
			.then(parseJSON)
	);
}
