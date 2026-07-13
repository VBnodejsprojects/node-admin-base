import { get } from "./api_helper";

const headers = {
    "Content-Type": "application/json",
};

// GET /filter/user/list — returns [{ _id, name, mobileNo }]
export const getAllUsersListForFilter = async () => {
    try {
        const response = await get(`filter/user/list`, { headers });
        return response;
    } catch (error) {
        console.error("Error fetching Users data:", error);
        return { users: [] };
    }
};

// GET /filter/vendor/list — returns [{ _id, name, mobileNo }]
export const getAllVendorsListForFilter = async () => {
    try {
        const response = await get(`filter/vendor/list`, { headers });
        return response;
    } catch (error) {
        console.error("Error fetching vendors data:", error);
        return { vendors: [] };
    }
};
