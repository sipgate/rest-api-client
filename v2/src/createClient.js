import RestApiClient from './RestApiClient';

export default http => {
	const client = new RestApiClient(http);

	return Object.getOwnPropertyNames(RestApiClient.prototype)
		.concat(Object.keys(client))
		.filter(name => name !== 'constructor')
		.filter(name => name in client)
		.filter(name => client[name] instanceof Function)
		.reduce(
			(acc, name) => ({
				...acc,
				[name]: (...args) => client[name](...args),
			}),
			{}
		);
};
