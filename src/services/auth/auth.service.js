import api from "@/services/auth/api.service";

const authService = {
  login(credentials, config = {}) {
    return api.post(
      "/auth/login",
      credentials,
      config
    );
  },

  signup(payload, config = {}) {
    return api.post(
      "/auth/signup",
      payload,
      config
    );
  },

  logout() {
    return api.post(
      "/auth/logout"
    );
  },

  getMe() {
    console.count("GET /me");

    return api.get(
      "/auth/me"
    );
  },

  refreshToken(payload) {
    return api.post(
      "/auth/refresh-token",
      payload
    );
  },

  forgotPassword(payload) {
    return api.post(
      "/auth/forgot-password",
      payload
    );
  },

  resetPassword(payload) {
    return api.post(
      "/auth/reset-password",
      payload
    );
  },

  setupSecurityQA(payload, config = {}) {
    return api.put("/auth/security-qa", payload, config);
  },
  getSecurityQuestion(payload, config = {}) {
    return api.post("/auth/security-question", payload, config);
  },
  verifySecurityAnswer(payload, config = {}) {
    return api.post("/auth/verify-security-answer", payload, config);
  },
  resetPasswordWithQA(payload, config = {}) {
    return api.post("/auth/reset-password-qa", payload, config);
  },
  changePassword(payload, config = {}) {
    return api.post("/auth/change-password", payload, config);
  },
  
};

export default authService;