import api from "../auth/api.service";

const userService = {
  getProfile() {
    return api.get("/users/profile");
  },

  updateProfile(data) {
    return api.patch("/users/profile", data);
  },

  updateAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);

    return api.patch("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteAccount() {
    return api.delete("/users/profile");
  },
};

export default userService;