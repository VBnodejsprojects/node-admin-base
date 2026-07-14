import { get, put, post, del } from "./api_helper";

let adminToken = localStorage.getItem("adminToken");
let headers = {
    "Content-Type": "application/json",
    Authorization: adminToken,
};

export const addCoupon = async (data) => {
    try {
        const response = await post("coupon/add", data, { headers });
        return response;
    } catch (error) {
        console.error("Add coupon error:", error);
        return error;
    }
};

export const updateCoupon = async (data) => {
    try {
        const response = await put(`coupon/update/${data.couponId}`, data, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Update coupon error:", error);
        return error;
    }
};

// GET /coupon/list/forAdmin — supports search, page, limit, from, to, deleted, couponType, modelType
export const getAllCoupons = async ({ search = "", page = 1, limit = 10, deleted = false, couponType = "", modelType = "" }) => {
    page = page + 1;
    try {
        const params = new URLSearchParams({
            search,
            page: page.toString(),
            limit: limit.toString(),
        });
        params.append("deleted", deleted ? "true" : "false");
        if (couponType) params.append("couponType", couponType);
        if (modelType) params.append("modelType", modelType);

        const response = await get(`coupon/list/forAdmin?${params}`, { headers });

        console.log("Fetched coupons:", response);
        return response;
    } catch (error) {
        console.error("Error fetching coupon data:", error);
        return { coupons: [], totalPages: 0, currentPage: 0, total: 0 };
    }
};

export const deleteCoupon = async (id) => {
    try {
        const response = await del(`coupon/delete/${id}`, { headers });
        return response;
    } catch (error) {
        console.error("Error deleting coupon:", error);
        return error;
    }
};
