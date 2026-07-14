import axios from "axios";
// import accessToken from "./jwt-token-access/accessToken";

//pass new generated access token here
// const token = accessToken;
// const token = localStorage.getItem("adminToken");

// apply base url for axios
// const API_URL = "http://localhost:7010/api/";

const API_URL = "https://3s58vpvv-7010.inc1.devtunnels.ms/api/"; // for image upload



const axiosApi = axios.create({
  baseURL: API_URL,
});

// axiosApi.defaults.headers.common["Authorization"] = token;


// Automatically attach token to every request
axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("adminToken");
    }
    return Promise.reject(error.response?.data || error);
  }
);

export async function get(url, config = {}) {
  return await axiosApi
    .get(url, { ...config })
    .then((response) => response.data);
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, data, { ...config })
    .then((response) => response.data)
    .catch((response) => response);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, data, { ...config })
    .then((response) => response.data)
    .catch((response) => response);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data);
}

export async function getFullResponse(url, config = {}) {
  return await axiosApi.get(url, { ...config });
}
