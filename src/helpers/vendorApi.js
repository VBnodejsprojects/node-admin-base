import { get, post, put, del } from "./api_helper";

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

export const updateVendorRequest = async (data, vendorId) => {
  try {
    return await post(`admin/vendor/${vendorId}`, data, { headers });
  } catch (error) {
    console.error("Error updating vendor request:", error);
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

export const getVendorDetails = async (id) => {
  try {
    return await post(`vendor/forAdmin/vendor/details`, { vendorId: id }, { headers });
  } catch (error) {
    console.error("Error fetching vendor details:", error);
    return error;
  }
};

export const updateGoogleRating = async (data) => {
  try {
    return await put(`vendor/update/rating`, data, { headers });
  } catch (error) {
    console.error("Error updating vendor rating:", error);
    return error;
  }
};

export const deleteVendor = async (id) => {
  try {
    return await del(`vendor/byAdmin/${id}`, { headers });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return error;
  }
};

export const getAllPendingRequests = async () => {
  try {
    return await get(`vendor/pending/list/forAdmin`, { headers });
  } catch (error) {
    console.error("Error fetching pending vendor requests:", error);
    return error;
  }
};

export const deleteVendorRequest = async ({ id, type }) => {
  try {
    const params = new URLSearchParams({
      id: id.toString(),
      type: type.toString(),
    });

    return await del(`vendor/delete/request?${params}`, { headers });
  } catch (error) {
    console.error("Failed to delete vendor request: ", error);
    return error;
  }
};