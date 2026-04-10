const API_URL = "http://localhost:8000";

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
