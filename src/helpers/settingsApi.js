import { get, put, del } from "./api_helper";

let headers = {
  "Content-Type": "application/json",
};

export const getSettingContent = async () => {
  try {
    let response = await get("settings", { headers });
    return response;
  } catch (err) {
    console.error("Error fetching settings:", err);
  }
};

export const updateSettingContent = async (settings) => {
  try {
    let response = await put("settings/update", settings, { headers });
    return response;
  } catch (err) {
    console.error("Error fetching settings:", err);
  }
};
