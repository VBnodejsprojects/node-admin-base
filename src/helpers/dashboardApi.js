import { get } from "./api_helper";
let adminToken = localStorage.getItem("adminToken");
let headers = {
  //   "Content-Type": "application/json",
  Authorization: adminToken,
};

export const dashboardInfo = async () => {
  let response = await get("homePage/dashboard/stats", { headers });
  return response;
};
