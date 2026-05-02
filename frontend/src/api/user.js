const API_URL = "http://localhost:8000";

export const updateProfile = async (profileData) => {
	const token = localStorage.getItem("access_token");
	const response = await fetch(`${API_URL}/user/profile`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`,
		},
		body: JSON.stringify(profileData),
	});
	
	return response.json()
};

export const uploadAvatar = async (file) => {
	const token = localStorage.getItem("access_token");
	const formData = new FormData();
	formData.append("file", file);

	const response = await fetch(`${API_URL}/media/upload-avatar`, {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${token}`,
		},
		body: formData,
	});

	return response.json();
};

export const getProfile = async (userId = null) => {
	const token = localStorage.getItem("access_token");
	const url = userId ? `${API_URL}/user/profile?user_id=${userId}` : `${API_URL}/user/profile`;

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		}
	});

	if (!response.ok) {
		throw new Error("Failed to fetch profile");
	}

	return response.json();
};

export const getAvatarUrl = (path) => {
	if (!path) return null;
	if (path.startsWith("http")) return path;
	return `${API_URL}${path}`;
};

export const getUserHistory = async () => {
	const token = localStorage.getItem("access_token");

	const response = await fetch(`${API_URL}/user/history`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		}
	});

	if (!response.ok) {
		throw new Error("Failed to fetch history");
	}

	return response.json();
};

export const searchUser = async (query) => {
	const response = await fetch(`${API_URL}/user/search?query=${encodeURIComponent(query)}`, {
		headers: {
			"Authorization": `Bearer ${localStorage.getItem('access_token')}`
		}
	});
	if (!response.ok) throw new Error("Search failed");
	return await response.json();
};

export const likeProfile = async (userId) => {
	const response = await fetch(`${API_URL}/user/profile/${userId}/like`, {
		method: "POST",
		headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}`}
	});

	if (!response.ok) throw new Error("Like failed");
	return await response.json();
};

export const inviteToCall = (username) => {
	const inviteUrl = `${window.location.origin}/join?ref=${username}`;
	return navigator.clipboard.writeText(inviteUrl);
};

export const deleteAccount = async () => {
	const token = localStorage.getItem("access_token");
	const response = await fetch(`${API_URL}/user/account`, {
		method: "DELETE",
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.detail || "Failed to delete account");
	}

	return true;
};
