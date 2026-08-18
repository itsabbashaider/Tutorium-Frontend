import api from "../auth/api.service";

const bookingService = {
  createBooking: (data) =>
    api.post("/bookings", data),

  getStudentBookings: (params = {}) =>
    api.get("/bookings/student", {
      params,
    }),

  getTutorBookings: (params = {}) =>
    api.get("/bookings/tutor", {
      params,
    }),

  getBookingById: (booking_id) =>
    api.get(`/bookings/${booking_id}`),

  acceptBooking: (booking_id) =>
    api.patch(`/bookings/${booking_id}/accept`),

  rejectBooking: (booking_id, data) =>
    api.patch(
      `/bookings/${booking_id}/reject`,
      data
    ),

  cancelBooking: (booking_id) =>
    api.patch(`/bookings/${booking_id}/cancel`),

  completeBooking: (booking_id) =>
    api.patch(`/bookings/${booking_id}/complete`),
};

export default bookingService;