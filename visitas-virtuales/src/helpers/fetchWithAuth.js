import { getLocalStorageAccessToken } from './authLocalStorage.js';

/** Wrapper para fetch que incluye el token de acceso en el header Authorization y maneja logout si la respuesta es 401/403 */
export async function fetchWithAuth(url, options = {}, logoutCallback) {
	const token = getLocalStorageAccessToken();

	// Si no hay token, logout inmediato
	if (!token) {
		localStorage.clear();
		if (typeof logoutCallback === 'function') logoutCallback();
	}

	options.headers = {
		...options.headers,
		Authorization: `Bearer ${token}`,
	};

	const res = await fetch(url, options);
	if (res.status === 401 || res.status === 403) {
		localStorage.clear();
		if (typeof logoutCallback === 'function') logoutCallback();
	}
	return res;
}

export default fetchWithAuth;
