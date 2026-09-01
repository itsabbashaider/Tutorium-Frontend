export const normalizeTutor = (tutor) => {
  const tutorUser = tutor?.user ?? {};

  return {
    ...tutor,

    full_name:
      tutorUser.full_name ||
      tutor.full_name ||
      "Tutor",

    city:
      tutorUser.city ||
      tutor.city ||
      null,

    hourly_rate:
      tutor.hourly_rate ??
      tutor.hourlyRate,

    avg_rating:
      tutor.avg_rating ??
      tutor.average_rating,

    teaching_mode:
      tutor.teaching_mode ??
      tutor.teachingMode,
  };
};