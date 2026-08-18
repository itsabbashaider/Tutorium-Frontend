import api from "../auth/api.service";

const tutorAvailabilityService = {
  getAll() {
    return api.get("/tutor/availability");
  },

  create(data) {
    return api.post(
      "/tutor/availability",
      data
    );
  },

  update(
    availability_slot_id,
    data
  ) {
    return api.patch(
      `/tutor/availability/${availability_slot_id}`,
      data
    );
  },

  remove(availability_slot_id) {
    return api.delete(
      `/tutor/availability/${availability_slot_id}`
    );
  },
};

export default tutorAvailabilityService;