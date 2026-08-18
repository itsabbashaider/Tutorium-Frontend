import { AUTH_ENDPOINTS } from "@/constants";

import api from "@/services/auth/api.service";

const authService = {
  login(credentials, config = {}) {
    return api.post(
      AUTH_ENDPOINTS.LOGIN,
      credentials,
      config
    );
  },

  signup(payload, config = {}) {
    return api.post(
      AUTH_ENDPOINTS.SIGNUP,
      payload,
      config
    );
  },

  logout() {
    return api.post(
      AUTH_ENDPOINTS.LOGOUT
    );
  },

  getMe() {
    console.count("GET /me");

    return api.get(
      AUTH_ENDPOINTS.ME
    );
  },

  refreshToken(payload) {
    return api.post(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      payload
    );
  },

  forgotPassword(payload) {
    return api.post(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      payload
    );
  },

  resetPassword(payload) {
    return api.post(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      payload
    );
  },
};

export default authService;