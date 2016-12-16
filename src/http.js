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

const get = (apiUrl, token, onPromiseResolved) => (
	(path) => {
		const url = apiUrl + path;

		if (promiseCache.get(url)) {
			return promiseCache.get(url);
		}

		const promise = fetch(url, {
			method: 'get',
			headers: defaultHeaders(token),
		})
			.then(onPromiseResolved)
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
	}
);

const del = (apiUrl, token, onPromiseResolved) => (
	path => (fetch(apiUrl + path, {
		method: 'delete',
		headers: defaultHeaders(token),
	})
		.then(onPromiseResolved)
		.then(extractBody)
		.then(parseJSON)
	)
);

const post = (apiUrl, token, onPromiseResolved) => (
	(path, data = {}) => (
		fetch(apiUrl + path, {
			method: 'post',
			body: JSON.stringify(data),
			headers: defaultHeaders(token),
		})
			.then(onPromiseResolved)
			.then(extractBody)
			.then(parseJSON)
	)
);

const put = (apiUrl, token, onPromiseResolved) => (
	(path, data = {}) => (
		fetch(apiUrl + path, {
			method: 'put',
			body: JSON.stringify(data),
			headers: defaultHeaders(token),
		})
			.then(onPromiseResolved)
			.then(extractBody)
			.then(parseJSON)
	)
);

export default (apiUrl, token = null, onPromiseResolved) => ({
	getUnauthenticated: get(apiUrl, () => null, () => {}),
	get: get(apiUrl, token, onPromiseResolved),
	del: del(apiUrl, token, onPromiseResolved),
	post: post(apiUrl, token, onPromiseResolved),
	put: put(apiUrl, token, onPromiseResolved),
});
