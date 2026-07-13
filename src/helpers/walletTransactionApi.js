import { post, get, put } from "./api_helper";

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
export const getAllWalletTransactions = async ({ id, role, page = 1, limit = 10, from = "", to = "" }) => {
    page = page + 1;
    try {
        const body = { id, role, page, limit };
        if (from) body.from = from;
        if (to) body.to = to;

        const response = await post(`wallet/transaction/list/forAdmin`, body, { headers });
        return response;
    } catch (error) {
        console.error("Error fetching wallet transaction data:", error);
        return { type: "error", data: [], pagination: { total: 0 } };
    }
};

// GET /wallet/transaction/withdrawals — pending withdrawal requests (admin)
export const getWithdrawalRequests = async ({ search = "", page = 1, limit = 10, status = "pending" }) => {
    page = page + 1;
    try {
        const params = new URLSearchParams({
            search,
            page: page.toString(),
            limit: limit.toString(),
            status,
        });
        const response = await get(`wallet/transaction/withdrawals?${params}`, { headers });
        return response;
    } catch (error) {
        console.error("Error fetching withdrawal requests:", error);
        return { type: "error", data: [], pagination: { total: 0 } };
    }
};

// PUT /wallet/transaction/withdrawal/:id/decision — approve | reject
export const processWithdrawalDecision = async (id, data) => {
    try {
        const response = await put(`wallet/transaction/withdrawal/${id}/decision`, data, { headers });
        return response;
    } catch (error) {
        return error;
    }
};
