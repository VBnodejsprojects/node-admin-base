import { get, post } from "./api_helper";

let adminToken = localStorage.getItem("adminToken");
let headers = {
    "Content-Type": "application/json",
    Authorization: adminToken,
};

// POST /notification/push  — body: { title, message, type, userId?, data? }
// type — 1:AllUser, 2:SingleUser, 3:AllVendor, 4:SingleVendor
export const sendNotification = async (data) => {
    try {
        const response = await post(`notification/push`, data, { headers });
        return response;
    } catch (error) {
        return error;
    }
};

// GET /notification/list/forAdmin — supports search, page, limit, from, to
export const getAllNotifications = async ({ search = "", page = 1, limit = 10, from = "", to = "", modelName = "", model = "" }) => {
    page = page + 1;
    try {
        const params = new URLSearchParams({
            search,
            page: page.toString(),
            limit: limit.toString(),
        });
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (modelName) params.append("modelName", modelName);
        if (model) params.append("model", model);

        const response = await get(`notification/list/forAdmin?${params}`, { headers });
        return response;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return { notifications: [], totalPages: 0, currentPage: 0, total: 0 };
    }
};
