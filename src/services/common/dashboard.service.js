import api from "../auth/api.service";

const dashboardService = {
  getTutorDashboard() {
    return api.get("/dashboard/tutor/me");
  },

  getStudentDashboard() {
    return api.get("/dashboard/student/me");
  },
};

export default dashboardService;