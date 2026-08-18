"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  QUERY_KEYS,
} from "@/constants";

import tutorAvailabilityService from "@/services/common/availability.service";

export const useTutorAvailability = (
  options = {}
) => {
  return useQuery({
    queryKey:
      QUERY_KEYS.AVAILABILITY.PRIVATE,

    queryFn: () =>
      tutorAvailabilityService.getAll(),

    enabled:
      options.enabled ?? true,

    ...options,
  });
};

const invalidateAvailabilityViews = (
  queryClient
) => {
  queryClient.invalidateQueries({
    queryKey:
      QUERY_KEYS.AVAILABILITY.PRIVATE,
  });

  queryClient.invalidateQueries({
    queryKey:
      QUERY_KEYS.TUTOR.PROFILE,
  });

  queryClient.invalidateQueries({
    queryKey:
      QUERY_KEYS.TUTOR.LIST,
  });

  /*
   * Public availability queries are keyed:
   * ["tutor-public-availability", tutorId]
   */
  queryClient.invalidateQueries({
    queryKey: [
      "tutor-public-availability",
    ],
  });

  /*
   * Tutor detail responses may contain
   * availability/profile-related information.
   */
  queryClient.invalidateQueries({
    queryKey: ["tutor"],
  });
};

export const useCreateTutorAvailability = (
  options = {}
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      tutorAvailabilityService.create(
        data
      ),

    onSuccess: (
      data,
      variables,
      context
    ) => {
      invalidateAvailabilityViews(
        queryClient
      );

      options.onSuccess?.(
        data,
        variables,
        context
      );
    },

    ...options,
  });
};

export const useUpdateTutorAvailability = (
  options = {}
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      availability_slot_id,
      data,
    }) =>
      tutorAvailabilityService.update(
        availability_slot_id,
        data
      ),

    onSuccess: (
      data,
      variables,
      context
    ) => {
      invalidateAvailabilityViews(
        queryClient
      );

      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.AVAILABILITY.DETAIL(
            variables.availability_slot_id
          ),
      });

      options.onSuccess?.(
        data,
        variables,
        context
      );
    },

    ...options,
  });
};

export const useDeleteTutorAvailability = (
  options = {}
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      availability_slot_id
    ) =>
      tutorAvailabilityService.remove(
        availability_slot_id
      ),

    onSuccess: (
      data,
      variables,
      context
    ) => {
      invalidateAvailabilityViews(
        queryClient
      );

      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.AVAILABILITY.DETAIL(
            variables
          ),
      });

      options.onSuccess?.(
        data,
        variables,
        context
      );
    },

    ...options,
  });
};