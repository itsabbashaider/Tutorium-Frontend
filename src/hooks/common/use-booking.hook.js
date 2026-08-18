"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import bookingService from "@/services/common/booking.service";
import {
  invalidateBookingQueries,
} from "@/utils";

const STUDENT_BOOKINGS_KEY = [
  "student-bookings",
];

const TUTOR_BOOKINGS_KEY = [
  "tutor-bookings",
];

const BOOKING_KEY = ["booking"];

export const useStudentBookings = (
  params = {},
  options = {}
) => {
  return useQuery({
    queryKey: [
      ...STUDENT_BOOKINGS_KEY,
      params,
    ],

    queryFn: () =>
      bookingService.getStudentBookings(
        params
      ),

    enabled:
      options.enabled ?? true,

    ...options,
  });
};

export const useTutorBookings = (
  params = {},
  options = {}
) => {
  return useQuery({
    queryKey: [
      ...TUTOR_BOOKINGS_KEY,
      params,
    ],

    queryFn: () =>
      bookingService.getTutorBookings(
        params
      ),

    enabled:
      options.enabled ?? true,

    ...options,
  });
};

export const useBooking = (
  booking_id,
  options = {}
) => {
  return useQuery({
    queryKey: [
      ...BOOKING_KEY,
      booking_id,
    ],

    queryFn: () =>
      bookingService.getBookingById(
        booking_id
      ),

    enabled:
      Boolean(booking_id) &&
      (options.enabled ?? true),

    ...options,
  });
};

export const useCreateBooking = (
  options = {}
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      bookingService.createBooking(
        payload
      ),

    onSuccess: (
      data,
      variables,
      context
    ) => {
      invalidateBookingQueries(
        queryClient
      );

      options.onSuccess?.(
        data,
        variables,
        context
      );
    },

    onError: (
      error,
      variables,
      context
    ) => {
      options.onError?.(
        error,
        variables,
        context
      );
    },

    ...options,
  });
};

export const useAcceptBooking = (
  options = {}
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (booking_id) =>
      bookingService.acceptBooking(
        booking_id
      ),

    onSuccess: (
      data,
      booking_id,
      context
    ) => {
      invalidateBookingQueries(
        queryClient,
        booking_id
      );

      options.onSuccess?.(
        data,
        booking_id,
        context
      );
    },

    onError: (
      error,
      booking_id,
      context
    ) => {
      options.onError?.(
        error,
        booking_id,
        context
      );
    },

    ...options,
  });
};

export const useRejectBooking = (
  options = {}
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      booking_id,
      payload,
    }) =>
      bookingService.rejectBooking(
        booking_id,
        payload
      ),

    onSuccess: (
      data,
      variables,
      context
    ) => {
      invalidateBookingQueries(
        queryClient,
        variables.booking_id
      );

      options.onSuccess?.(
        data,
        variables,
        context
      );
    },

    onError: (
      error,
      variables,
      context
    ) => {
      options.onError?.(
        error,
        variables,
        context
      );
    },

    ...options,
  });
};

export const useCancelBooking = (
  options = {}
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (booking_id) =>
      bookingService.cancelBooking(
        booking_id
      ),

    onSuccess: (
      data,
      booking_id,
      context
    ) => {
      invalidateBookingQueries(
        queryClient,
        booking_id
      );

      options.onSuccess?.(
        data,
        booking_id,
        context
      );
    },

    onError: (
      error,
      booking_id,
      context
    ) => {
      options.onError?.(
        error,
        booking_id,
        context
      );
    },

    ...options,
  });
};

export const useCompleteBooking = (
  options = {}
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (booking_id) =>
      bookingService.completeBooking(
        booking_id
      ),

    onSuccess: (
      data,
      booking_id,
      context
    ) => {
      invalidateBookingQueries(
        queryClient,
        booking_id
      );

      options.onSuccess?.(
        data,
        booking_id,
        context
      );
    },

    onError: (
      error,
      booking_id,
      context
    ) => {
      options.onError?.(
        error,
        booking_id,
        context
      );
    },

    ...options,
  });
};
