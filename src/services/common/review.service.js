import api from "../auth/api.service";

const reviewService = {
  getMyReviews(params = {}) {
    return api.get("/reviews/my", {
      params,
    });
  },

  getTutorReviews(tutorProfileId, params = {}) {
    return api.get(`/reviews/tutor/${tutorProfileId}`, {
      params,
    });
  },

  getById(reviewId) {
    return api.get(`/reviews/${reviewId}`);
  },

  create(data) {
    return api.post("/reviews", data);
  },
};

export default reviewService;