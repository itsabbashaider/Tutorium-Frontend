import api from "../auth/api.service";

const studentService = {
  getProfile() {
    return api.get("/student");
  },

  getPublicProfile(student_profile_id) {
    return api.get(
      `/student/${student_profile_id}`
    );
  },

  updateProfile(payload) {
    return api.patch(
      "/student",
      payload
    );
  },
};

export default studentService;