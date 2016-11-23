import jwtDecode from 'jwt-decode';
import httpWrapper from './http';
import clientWrapper from './client';

export default (
	apiUrl,
	saveJWTToken,
	getJWTToken,
	onAuthenticationExpired,
	onLogout = () => {},
) => {
	const getUserId = () => {
		const decoded = jwtDecode(getJWTToken());
		return decoded.sub;
	};

	const http = httpWrapper(apiUrl, getJWTToken, onAuthenticationExpired);

	return clientWrapper(http, saveJWTToken, getUserId, onLogout);
};
