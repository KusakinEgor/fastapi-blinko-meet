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

export const getProfile = async () => {
	const token = localStorage.getItem("access_token");

	const response = await fetch(`${API_URL}/user/profile`, {
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
}
