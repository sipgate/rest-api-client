import HttpClient from './HttpClient';

export default (apiUrl, token = null, onPromiseResolved) => {
	const http = new HttpClient();
	http.apiUrl = apiUrl;
	http.token = token;
	http.onPromiseResolved = onPromiseResolved;
	return {
		getUnauthenticated: path => http.get(path),
		get: path => http.get(path),
		del: path => http.del(path),
		post: (path, data) => http.post(path, data),
		put: (path, data) => http.put(path, data),
	};
};
