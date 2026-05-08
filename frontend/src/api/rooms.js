import { apiRequest } from "./user.js";

export const roomsApi = {
	createRoom: async (name, password = "") => {
		return await apiRequest("/rooms/create", {
			method: "POST",
			body: JSON.stringify({ name, password }),
		});
	},

	leaveRoom: async (slug) => {
		return await apiRequest(`/rooms/${slug}/leave`, {
			method: "POST"
		});
	},

	generateSummary: async (summaryData) => {
		return await apiRequest("/ai/summary/generate", {
			method: "POST",
			body: JSON.stringify(summaryData),
		});
	}
};
