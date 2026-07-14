import { get, post, put } from "./api_helper";

const adminToken = localStorage.getItem("adminToken");

const headers = {
  "Content-Type": "application/json",
  Authorization: adminToken,
};

export const addVendor = async (data) => {
  try {
    return await post("vendor/add/byAdmin", data, { headers });
  } catch (error) {
    console.error("Error adding vendor:", error);
    return error;
  }
};

export const updateVendor = async (data, vendorId) => {
  try {
    return await put(`vendor/profile/${vendorId}`, data, { headers });
  } catch (error) {
    console.error("Error updating vendor:", error);
    return error;
  }
};

export const getAllVendor = async ({ search = "", page = 1, limit = 10, status, accountStatus, deleted = false, appVersion = "" }) => {
  page = page + 1;
  try {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append("status", status);
    }
    if (accountStatus) {
      params.append("accountStatus", accountStatus);
    }
    params.append("deleted", deleted ? "true" : "false");
    if (appVersion) params.append("appVersion", appVersion);

    const response = await get(`vendor/list/forAdmin?${params}`, { headers });
    return response;
  } catch (error) {
    console.error("Error fetching vendor data:", error);
    return { type: "error", vendors: [], total: 0 };
  }
};
