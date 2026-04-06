import { refreshAccessToken } from "./auth";

export async function fetchWithAuth(url, options = {}) {
	let token = localStorage.getItem("access_token");

	let res = await fetch(url, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${token}`
		}
	});

	if (res.status === 401) {
		token = await refreshAccessToken();

		if (!token) return res;

		res = await fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${token}`
			}
		});
	}

	return res;
}
