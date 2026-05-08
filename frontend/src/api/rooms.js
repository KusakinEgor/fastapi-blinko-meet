import { apiRequest } from "./user.js";

export const roomsApi = {
	createRoom: async (name, password = "") => {
		return await apiRequest("/rooms/create", {
			method: "POST",
			body: JSON.stringify({ name, password }),
		});
	}
};
