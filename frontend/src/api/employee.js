import { apiRequest } from "./user.js";

export const fetchEmployeeStats = async () => {
	return await apiRequest("/employee/dashboard-stats", {
		method: "GET"
	});
};
