import api from "../auth/api.service";

const tutorSubjectService = {
  getAll() {
    return api.get("/tutor/subjects");
  },

  add(payload) {
    return api.post(
      "/tutor/subjects",
      payload
    );
  },

  remove(subject_id) {
    return api.delete(
      `/tutor/subjects/${subject_id}`
    );
  },
};

export default tutorSubjectService;