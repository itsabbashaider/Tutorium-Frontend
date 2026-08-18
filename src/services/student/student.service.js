import api from "../auth/api.service";

const studentService = {
  getProfile() {
    return api.get("/students/profile");
  },

  updateProfile(payload) {
    return api.put("/students/profile", payload);
  },
};

export default studentService;