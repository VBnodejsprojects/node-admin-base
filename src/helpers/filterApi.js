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

// GET /filter/user/appVersions — returns { versions: [ "1.0.0", ... ] }
export const getUserAppVersions = async () => {
    try {
        const response = await get(`filter/user/appVersions`, { headers });
        return response;
    } catch (error) {
        console.error("Error fetching user app versions:", error);
        return { versions: [] };
    }
};

// GET /filter/vendor/appVersions — returns { versions: [ "1.0.0", ... ] }
export const getVendorAppVersions = async () => {
    try {
        const response = await get(`filter/vendor/appVersions`, { headers });
        return response;
    } catch (error) {
        console.error("Error fetching vendor app versions:", error);
        return { versions: [] };
    }
};
