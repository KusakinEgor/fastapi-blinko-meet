const API_URL = import.meta.env.VITE_API_URL;

export const sendMessage = async (content) => {
	const token = localStorage.getItem("access_token");

	const response = await fetch(`${API_URL}/messages/send`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		},
		body: JSON.stringify({ content }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.detail || "Failed to send message");
	}

	return await response.json();
};

export const fetchMessageHistory = async () => {
	const token = localStorage.getItem("access_token");

	const response = await fetch(`${API_URL}/messages/history`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.detail || "Failed to fetch chat history");
	}

	return await response.json();
};
