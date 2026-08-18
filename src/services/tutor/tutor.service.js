import api from "../auth/api.service";

const tutorService = {
  getAll(params) {
    return api.get("/tutors", {
      params,
    });
  },

  getById(tutor_profile_id) {
    return api.get(
      `/tutors/${tutor_profile_id}`
    );
  },

  getAvailability(tutor_profile_id) {
    return api.get(
      `/tutors/${tutor_profile_id}/availability`
    );
  },

  getProfile() {
    return api.get("/tutor/profile");
  },

  updateProfile(data) {
    return api.patch(
      "/tutor/profile",
      data
    );
  },
};

export default tutorService;