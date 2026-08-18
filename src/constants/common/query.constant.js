export const QUERY_KEYS = {
  AUTH: {
    CURRENT_USER: ["me"],
  },

  USER: {
    PROFILE: ["user", "profile"],
  },

  STUDENT: {
    PROFILE: ["student", "profile"],
  },

  TUTOR: {
    PROFILE: ["tutor", "profile"],

    LIST: ["tutors"],

    DETAIL: (tutor_id) => [
      "tutor",
      tutor_id,
    ],
  },

  SUBJECT: {
    LIST: ["subjects"],

    SEARCH: (search) => [
      "subjects",
      "search",
      search,
    ],
  },

  AVAILABILITY: {
    PRIVATE: ["tutor-availability"],

    PUBLIC: (tutor_id) => [
      "tutor-public-availability",
      tutor_id,
    ],

    DETAIL: (availability_id) => [
      "availability",
      availability_id,
    ],
  },

  BOOKING: {
    STUDENT_LIST: ["student-bookings"],

    TUTOR_LIST: ["tutor-bookings"],

    DETAIL: (booking_id) => [
      "booking",
      booking_id,
    ],
  },

  REVIEW: {
    MY_LIST: ["my-reviews"],

    TUTOR_LIST: (tutor_id) => [
      "tutor-reviews",
      tutor_id,
    ],

    DETAIL: (review_id) => [
      "review",
      review_id,
    ],
  },

  DASHBOARD: {
    TUTOR: ["tutor-dashboard"],
    STUDENT: ["student-dashboard"],
  },
};