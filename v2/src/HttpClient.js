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
		abortSignal,
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
		this.abortSignal = abortSignal;
	}

	cancellable = abortSignal =>
		new HttpClient({
			token: this.token,
			apiUrl: this.apiUrl,
			onPromiseResolved: this.onPromiseResolved,
			skipResponseErrorHandling: this.skipResponseErrorHandling,
			getToken: this.getToken,

			abortSignal,
		});

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

		//eslint-disable-next-line
		const tokenPromise = () =>
			authenticated ? this.getToken() : Promise.resolve(null);

		const query = () =>
			tokenPromise().then(token =>
				fetch(url, {
					signal: this.abortSignal,
					method: 'get',
					headers: defaultHeaders(token),
				})
			);

		const promise = query()
			.then(this.handleUnauthorized)
			.then(this.skipResponseErrorHandling ? identity : handleErrorResponses)
			.then(response => this.onPromiseResolved(response, query))
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

	del = path => {
		const query = () =>
			this.getToken().then(token =>
				fetch(this.apiUrl + path, {
					signal: this.abortSignal,
					method: 'delete',
					headers: defaultHeaders(token),
				})
			);

		return query()
			.then(this.handleUnauthorized)
			.then(this.skipResponseErrorHandling ? identity : handleErrorResponses)
			.then(response => this.onPromiseResolved(response, query))
			.then(extractBody)
			.then(parseJSON);
	};

	post = (path, data = {}) => {
		const query = () =>
			this.getToken().then(token =>
				fetch(this.apiUrl + path, {
					signal: this.abortSignal,
					method: 'post',
					body: JSON.stringify(data),
					headers: defaultHeaders(token),
				})
			);

		return query()
			.then(this.handleUnauthorized)
			.then(this.skipResponseErrorHandling ? identity : handleErrorResponses)
			.then(response => this.onPromiseResolved(response, query))
			.then(extractBody)
			.then(parseJSON);
	};

	put = (path, data = {}) => {
		const query = () =>
			this.getToken().then(token =>
				fetch(this.apiUrl + path, {
					signal: this.abortSignal,
					method: 'put',
					body: JSON.stringify(data),
					headers: defaultHeaders(token),
				})
			);

		return query()
			.then(this.handleUnauthorized)
			.then(this.skipResponseErrorHandling ? identity : handleErrorResponses)
			.then(response => this.onPromiseResolved(response, query))
			.then(extractBody)
			.then(parseJSON);
	};
}
