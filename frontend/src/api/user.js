import { refreshAccessToken } from "./auth.js";

const API_URL = "http://localhost:8000";

export async function apiRequest(endpoint, options = {}) {
	const token = localStorage.getItem("access_token");

	const headers = {
		"Authorization": `Bearer ${token}`,
		...options.headers,
	};

	if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
		headers["Content-Type"] = "application/json";
	}

	const config = {
		...options,
		headers
	};

	let response = await fetch(`${API_URL}${endpoint}`, config);

	if (response.status === 401) {
		try {
			const newToken = await refreshAccessToken();
			if (newToken) {
				config.headers["Authorization"] = `Bearer ${newToken}`;
				response = await fetch(`${API_URL}${endpoint}`, config);
			}
		} catch (err) {
			console.error("Refresh token failed, redirecting to login...");
			localStorage.clear();
			window.location.href = "/login";
			throw err;
		}
	}

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const error = new Error(errorData.detail || "API Error");
		error.status = response.status;
		throw error;
	}

	if (response.status === 204) return true;

	return response.json();
}


export const getProfile = async (userId = null) => {
	return await apiRequest(userId ? `/user/profile?user_id=${userId}` : "/user/profile");
};

export const updateProfile = async (profileData) => {
	return await apiRequest("/user/profile", {
		method: "PUT",
		body: JSON.stringify(profileData),
	});
};

export const uploadAvatar = async (file) => {
	const formData = new FormData();
	formData.append("file", file);
	return await apiRequest("/media/upload-avatar", {
		method: "POST",
		body: formData,
	});
};

export const deleteAccount = async () => {
	return await apiRequest("/user/account", { method: "DELETE" });
};

export const getUserHistory = async () => {
	return await apiRequest("/user/history");
};

export const searchUser = async (query) => {
	return await apiRequest(`/user/search?query=${encodeURIComponent(query)}`);
};

export const likeProfile = async (userId) => {
	return await apiRequest(`/user/profile/${userId}/like`, { method: "POST" });
};

export const inviteToCall = (username) => {
	const inviteUrl = `${window.location.origin}/join?ref=${username}`;
	return navigator.clipboard.writeText(inviteUrl);
};

export const getMeetingSummary = async (roomId) => {
	return await apiRequest(`/ai/summary/${roomId}`);
};

export const getAvatarUrl = (path) => {
	if (!path) return null;
	if (path.startsWith("http")) return path;
	return `${API_URL}${path}`;
};
