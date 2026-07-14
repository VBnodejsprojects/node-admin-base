import { post, get, put } from "./api_helper";
import { processFormData } from "../utils/processFromData";

let adminToken = localStorage.getItem("adminToken");
let headers = {
    "Content-Type": "application/json",
    Authorization: adminToken,
};

// POST /wallet/transaction/add — body: { modelId, modelType, amount, transactionType, description }
export const addWalletTransaction = async (data) => {
    try {
        const response = await post(`wallet/transaction/add`, data, { headers });
        return response;
    } catch (error) {
        return error;
    }
};

// POST /wallet/transaction/list/forAdmin — reads from req.body: { id, role, page, limit, from, to }
// `id`   = wallet owner id (a User or Vendor _id)
// `role` = "user" | "vendor"
export const getAllWalletTransactions = async ({ id, role, page = 1, limit = 10, from = "", to = "", transactionType = "", status = "" }) => {
    page = page + 1;
    try {
        const body = { id, role, page, limit };
        if (from) body.from = from;
        if (to) body.to = to;
        if (transactionType) body.transactionType = transactionType;
        if (status) body.status = status;

        const response = await post(`wallet/transaction/list/forAdmin`, body, { headers });
        return response;
    } catch (error) {
        console.error("Error fetching wallet transaction data:", error);
        return { type: "error", data: [], pagination: { total: 0 } };
    }
};

// GET /wallet/transaction/withdrawals — pending withdrawal requests (admin)
export const getWithdrawalRequests = async ({ search = "", page = 1, limit = 10, status = "pending", modelType = "", modelId = "" }) => {
    page = page + 1;
    try {
        const params = new URLSearchParams({
            search,
            page: page.toString(),
            limit: limit.toString(),
            status,
        });
        if (modelType) params.append("modelType", modelType);
        if (modelId) params.append("modelId", modelId);
        const response = await get(`wallet/transaction/withdrawals?${params}`, { headers });
        return response;
    } catch (error) {
        console.error("Error fetching withdrawal requests:", error);
        return { type: "error", data: [], pagination: { total: 0 } };
    }
};

// PUT /wallet/transaction/withdrawal/:id/decision — approve | reject
// data may include a transactionImage File, so it is sent as multipart/form-data.
// (Authorization is attached by the axios interceptor; do NOT set Content-Type so the
//  browser can add the multipart boundary itself.)
export const processWithdrawalDecision = async (id, data) => {
    try {
        const formData = processFormData(data);
        const response = await put(`wallet/transaction/withdrawal/${id}/decision`, formData);
        return response;
    } catch (error) {
        return error;
    }
};
