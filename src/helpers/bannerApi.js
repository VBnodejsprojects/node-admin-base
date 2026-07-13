import { get, put, post, del } from "./api_helper";
import { processFormData } from "../utils/processFromData";

let adminToken = localStorage.getItem("adminToken");
let headers = {
  // 'Content-Type': 'application/json',
  Authorization: adminToken,
};

export const addBanner = async (data) => {
  try {
    const formData = processFormData(data);
    const response = await post(`banner/add`, formData, { headers });
    return response;
  } catch (error) {
    return error;
  }
};

export const updateBanner = async (data, bannerId) => {
  try {
    const formData = processFormData(data);
    const response = await put(`banner/update/${bannerId}`, formData, {
      headers,
    });
    return response;
  } catch (error) {
    return;
  }
};

// GET /banner/list/forAdmin — supports search, page, limit, from, to, role
export const getAllBanner = async ({ search = "", page = 1, limit = 10, role = "" }) => {
  page = page + 1;
  try {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (role) {
      params.append("role", role);
    }

    const response = await get(`banner/list/forAdmin?${params}`, { headers });
    return response;
  } catch (error) {
    console.error("Error fetching banner data:", error);
    return { banners: [], totalPages: 0, currentPage: 0, totalBanners: 0 };
  }
};

export const deleteBanner = async (id) => {
  try {
    const response = await del(`banner/delete/${id}`, { headers });
    return response;
  } catch (error) {
    console.error("Error delete banner :", error);
    return error;
  }
};
