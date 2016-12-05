import promiseCache from './promiseCache';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const defaultHeaders = (getJWTToken) => {
	const hasJWTToken = typeof getJWTToken === 'function' && getJWTToken();
	const authorization = hasJWTToken
		? `Bearer ${getJWTToken()}`
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

const throwError = (response) => {
	const error = new Error(response.statusText);
	error.response = response;
	error.status = response.status;
	throw error;
};


const extractBody = res => res.text();

const parseJSON = (text) => {
	try {
		return JSON.parse(text);
	} catch (e) {
		return text;
	}
};

const checkLocationHeader = (apiUrl, onAuthenticationExpired, getJWTToken) => (
	(response) => {
		if (response.status === 403 && response.headers.get('location')) {
			fetch(`${apiUrl}/app/links`, {
				method: 'get',
				headers: defaultHeaders(getJWTToken),
			})
				.then(extractBody)
				.then(parseJSON)
				.then((json) => {
					onAuthenticationExpired(
						json.legacyTokenAuthenticateUrl,
						response.headers.get('location')
					);
				});
		}

		return response;
	}
);

const checkStatus = onAuthenticationExpired => (
	(response) => {
		if (response.status >= 200 && response.status < 300) {
			return response;
		} else if (response.status === 401) {
			onAuthenticationExpired();
		}

		throwError(response);

		return null;
	}
);

const get = (apiUrl, getJWTToken, onAuthenticationExpired) => (
	(path) => {
		const url = apiUrl + path;

		if (promiseCache.get(url)) {
			return promiseCache.get(url);
		}

		const promise = fetch(url, {
			method: 'get',
			headers: defaultHeaders(getJWTToken),
		})
			.then(
				(response) => {
					promiseCache.bust(url);
					return response;
				},
			)
			.then(checkLocationHeader(apiUrl, onAuthenticationExpired, getJWTToken))
			.then(checkStatus(onAuthenticationExpired))
			.then(extractBody)
			.then(parseJSON);

		promiseCache.set(url, promise);

		return promise;
	}
);

const del = (apiUrl, getJWTToken, onAuthenticationExpired) => (
	path => (fetch(apiUrl + path, {
		method: 'delete',
		headers: defaultHeaders(getJWTToken),
	})
		.then(checkLocationHeader(apiUrl, onAuthenticationExpired))
		.then(checkStatus(onAuthenticationExpired))
		.then(extractBody)
		.then(parseJSON)
	)
);

const post = (apiUrl, getJWTToken, onAuthenticationExpired) => (
	(path, data = {}) => (
		fetch(apiUrl + path, {
			method: 'post',
			body: JSON.stringify(data),
			headers: defaultHeaders(getJWTToken),
		})
			.then(checkLocationHeader(apiUrl, onAuthenticationExpired))
			.then(checkStatus(onAuthenticationExpired))
			.then(extractBody)
			.then(parseJSON)
	)
);

const put = (apiUrl, getJWTToken, onAuthenticationExpired) => (
	(path, data = {}) => (
		fetch(apiUrl + path, {
			method: 'put',
			body: JSON.stringify(data),
			headers: defaultHeaders(getJWTToken),
		})
			.then(checkLocationHeader(apiUrl, onAuthenticationExpired))
			.then(checkStatus(onAuthenticationExpired))
			.then(extractBody)
			.then(parseJSON)
	)
);

export default (apiUrl, getJWTToken, onAuthenticationExpired) => ({
	get: get(apiUrl, getJWTToken, onAuthenticationExpired),
	// This is a temporarily work around for fetching data without a Token
	getUnauthenticated: get(apiUrl, () => null, () => {}),
	del: del(apiUrl, getJWTToken, onAuthenticationExpired),
	post: post(apiUrl, getJWTToken, onAuthenticationExpired),
	put: put(apiUrl, getJWTToken, onAuthenticationExpired),
});
