import axios from "axios";

import { API, HTTP_STATUS } from "@/constants";

import token from "@/utils/common/token.util";

const axiosInstance = axios.create({
  baseURL: API.BASE_URL,
  timeout: API.TIMEOUT,
  headers: API.HEADERS,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = token.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

console.log("API Base URL:", API.BASE_URL);

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    if (status === HTTP_STATUS.UNAUTHORIZED) {
      if (requestUrl.includes("/auth/me")) {
        error.isAuthError = true;
      } else {
        console.error("401 Unauthorized:", requestUrl, error.response?.data);
      }

      if (
        requestUrl.includes("/auth/me") ||
        requestUrl.includes("/auth/refresh-token")
      ) {
        token.clear();
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
