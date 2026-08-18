import api from "../auth/api.service";

const userService = {
  getProfile() {
    return api.get("/users/profile");
  },

  updateProfile(data) {
    return api.patch("/users/profile", data);
  },

  deleteAccount() {
    return api.delete("/users/profile");
  },
};

export default userService;