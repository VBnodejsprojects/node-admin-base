import { get, post, put, del } from "./api_helper";

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

export const updateStatus = async (
  id,
  status,
  model
) => {
  try {
    let body = {
      id: id,
      status: status,
      model: model,
    };

    let response = await put("status/update", body, { headers });
    return response;
  } catch (error) {
    console.error("Error updating status:", error);
    return false;
  }
};