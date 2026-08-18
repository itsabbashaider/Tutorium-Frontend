import { QUERY_KEYS } from "@/constants";

const invalidateBookingQueries = (
  queryClient,
  bookingId = null
) => {
  queryClient.invalidateQueries({
    queryKey:
      QUERY_KEYS.BOOKING.STUDENT_LIST,
  });

  queryClient.invalidateQueries({
    queryKey:
      QUERY_KEYS.BOOKING.TUTOR_LIST,
  });

  if (bookingId) {
    queryClient.invalidateQueries({
      queryKey:
        QUERY_KEYS.BOOKING.DETAIL(
          bookingId
        ),
    });
  }
};

export default invalidateBookingQueries;