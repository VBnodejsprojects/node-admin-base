import { get, post, put } from "./api_helper";

const headers = {
  "Content-Type": "application/json",
};

export const getAllAddress = async ({
  search = "",
  page = 1,
  limit = 10,
  userId = "",
  deleted = false,
}) => {
  page = page + 1;
  try {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
      userId,
    });
    params.append("deleted", deleted ? "true" : "false");

    const response = await get(`address/list/forAdmin?${params}`, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error fetching banner data:", error);
    return { addresses: [], totalPages: 0, currentPage: 0, totalAddresses: 0 };
  }
};

// PUT /address/restore/:id — admin restores a soft-deleted address (isDeleted → false)
export const restoreAddress = async (id) => {
  try {
    const adminToken = localStorage.getItem("adminToken");
    const addressHeaders = {
      Authorization: adminToken,
      "Content-Type": "application/json",
    };
    return await put(`address/restore/${id}`, {}, { headers: addressHeaders });
  } catch (error) {
    console.error("Error restoring address:", error);
    return error;
  }
};

export const addAddress = async (data) => {
  try {
    const adminToken = localStorage.getItem("adminToken");
    const addressHeaders = {
      Authorization: adminToken,
      "Content-Type": "application/json",
    };
    return await post("address/add/byAdmin", data, { headers: addressHeaders });
  } catch (error) {
    console.error("Error adding address:", error);
    return error;
  }
};
