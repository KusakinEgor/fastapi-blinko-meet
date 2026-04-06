export async function refreshAccessToken() {
	const refreshToken = localStorage.getItem("refresh_token");

	const res = await fetch("http://localhost:8000/refresh", {
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
