//help-supportApi.js


import { get, put, post, del } from "./api_helper";
import { processFormData } from "../utils/processFromData";

let adminToken = localStorage.getItem("adminToken");
let headers = {
  // 'Content-Type': 'application/json',
  Authorization: adminToken,
};

export const addHelpSupport = async (data) => {
  try {
    const formData = processFormData(data);
    const response = await post(`helpsupport/add`, formData, { headers });
    return response;
  } catch (error) {
    return error;
  }
};

export const updateHelpSupport = async (data, helpsupportId) => {
  try {
    // const formData = processFormData(data);
    const response = await put(`helpsupport/update/${helpsupportId}`, data, {
      headers,
    });
    return response;
  } catch (error) {
    return;
  }
};

// GET /helpsupport/list/forAdmin — supports search, page, limit, from, to, status
export const getAllHelpSupport = async ({ search = "", page = 1, limit = 10, from = "", to = "", status = "" }) => {
  page = page + 1;
  try {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    if (status) params.append("status", status);

    const response = await get(`helpsupport/list/forAdmin?${params}`, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error fetching help-support data:", error);
    return { helpsupport: [], totalPages: 0, currentPage: 0, totalHelpSupport: 0 };
  }
};

export const deleteHelpSupport = async (id) => {
  try {
    const response = await del(`helpsupport/delete/${id}`, { headers });
    return response;
  } catch (error) {
    console.error("Error delete help-support :", error);
    return error;
  }
};
