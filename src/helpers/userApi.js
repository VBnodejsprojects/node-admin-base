import { get, post, put } from "./api_helper";
import { processFormData } from "../utils/processFromData";

const adminToken = localStorage.getItem("adminToken");

const headers = {
  Authorization: adminToken,
};

export const addUser = async (data) => {
  try {
    return await post("user/add/byAdmin", data, { headers });
  } catch (error) {
    console.error("Error adding user:", error);
    return error;
  }
};

export const updateUser = async (data, userId) => {
  try {
    const formData = processFormData(data);
    return await put(`user/profile/${userId}`, formData, { headers });
  } catch (error) {
    console.error("Error updating user:", error);
    return error; `
    `
  }
};

export const getUserProfile = async (userId) => {
  try {
    if (userId) {
      return await get(`user/profile/${userId}`, { headers });
    }
    return await get("user/profile", { headers });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return error;
  }
};

// GET /user/list/forAdmin — supports search, page, limit, from, to, status, deleted
export const getAllUser = async ({ search = "", page = 1, limit = 10, status = "", deleted = false, appVersion = "" }) => {
  page = page + 1;

  try {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append("status", status);
    params.append("deleted", deleted ? "true" : "false");
    if (appVersion) params.append("appVersion", appVersion);

    return await get(`user/list/forAdmin?${params}`, { headers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [], totalPages: 0, currentPage: 0, totalUsers: 0 };
  }
};

