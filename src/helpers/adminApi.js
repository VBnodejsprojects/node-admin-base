import { post, put } from "./api_helper";

const token = localStorage.getItem("adminToken")
const headers = {
  "Content-Type": "application/json",
  Authorization: token,
};

export const adminLogin = async (username, password) => {
  let body = {
    name: username,
    password: password,
  };

  let response = await post("admin/login", body, { headers });
  return response;
};

// PUT /admin/change-password — body: { currentPassword, newPassword, confirmPassword }
export const changeAdminPassword = async (data) => {
  try {
    const response = await put("admin/change-password", data, { headers });
    return response;
  } catch (error) {
    return error;
  }
};
