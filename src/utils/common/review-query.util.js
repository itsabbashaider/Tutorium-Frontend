const invalidateReviewQueries = (
  queryClient,
  tutor_profile_id = null
) => {
  queryClient.invalidateQueries({
    queryKey: ["my-reviews"],
  });

  queryClient.invalidateQueries({
    queryKey: ["tutor-dashboard"],
  });

  queryClient.invalidateQueries({
    queryKey: ["student-bookings"],
  });

  queryClient.invalidateQueries({
    queryKey: ["tutor-bookings"],
  });

  queryClient.invalidateQueries({
    queryKey: ["tutors"],
  });

  if (tutor_profile_id) {
    queryClient.invalidateQueries({
      queryKey: [
        "tutor",
        tutor_profile_id,
      ],
    });

    queryClient.invalidateQueries({
      queryKey: [
        "tutor-reviews",
        tutor_profile_id,
      ],
    });
  }
};

export default invalidateReviewQueries;