const BASE_URL = "http://localhost:8000";

export const roomsApi = {
	createRoom: async (name, password = "") => {
		const token = localStorage.getItem("access_token");

		const response = await fetch(`${BASE_URL}/rooms/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
			body: JSON.stringify({ name, password }),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.detail || "Failed to create room");
		}

		return response.json();
	}
};
