const API_BASE_URL = "http://localhost:8000";

export async function loginEmployee(username, password) {
	const res = await fetch(`${API_BASE_URL}/employee/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email: username, password })
	});

	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.detail || "Error auth");
	}

	const data = await res.json();

	localStorage.setItem("access_token", data.access_token);
	localStorage.setItem("refresh_token", data.refresh_token);

	return data;
}

export async function refreshAccessToken() {
	const refreshToken = localStorage.getItem("refresh_token");

	const res = await fetch(`${API_BASE_URL}/refresh`, {
		method: "POST",
		headers: {
			"x-refresh-token": refreshToken
		}
	});

	if (!res.ok) {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		window.location.reload();
		return null;
	}

	const data = await res.json();

	localStorage.setItem("access_token", data.access_token);
	localStorage.setItem("refresh_token", data.refresh_token);

	return data.access_token;
}
