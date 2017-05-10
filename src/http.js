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

class Http {
	token = null;
	apiUrl = '';
	onPromiseResolved = result => result;

	get = (path) => {
		const url = this.apiUrl + path;

		if (promiseCache.get(url)) {
			return promiseCache.get(url);
		}

		const promise = fetch(url, {
			method: 'get',
			headers: defaultHeaders(this.token),
		})
			.then(this.onPromiseResolved)
			.then(
				(response) => {
					promiseCache.bust(url);
					return response;
				},
			)
			.then(extractBody)
			.then(parseJSON);

		promiseCache.set(url, promise);

		return promise;
	};

	del = (path) => (
		fetch(this.apiUrl + path, {
				method: 'delete',
				headers: defaultHeaders(this.token),
			})
				.then(this.onPromiseResolved)
				.then(extractBody)
				.then(parseJSON)
	);

	post = (path, data = {}) => (
		fetch(this.apiUrl + path, {
			method: 'post',
			body: JSON.stringify(data),
			headers: defaultHeaders(this.token),
		})
			.then(this.onPromiseResolved)
			.then(extractBody)
			.then(parseJSON)
	);

	put = (path, data = {}) => (
		fetch(this.apiUrl + path, {
			method: 'put',
			body: JSON.stringify(data),
			headers: defaultHeaders(this.token),
		})
			.then(this.onPromiseResolved)
			.then(extractBody)
			.then(parseJSON)
	);
};

export default (apiUrl, token = null, onPromiseResolved) => {
	const http = new Http();
	http.apiUrl = apiUrl;
	http.token = token;
	http.onPromiseResolved = onPromiseResolved;
	return {
		getUnauthenticated: (path) => http.get(path),
		get: (path) => http.get(path),
		del: (path) => http.del(path),
		post: (path, data) => http.post(path),
		put:(path, data) => http.put(path),
	};
};

export const httpClass = Http;
