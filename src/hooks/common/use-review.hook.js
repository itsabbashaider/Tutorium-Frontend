"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  QUERY_KEYS,
} from "@/constants";

import reviewService from "@/services/common/review.service";

export const useMyReviews = (
  options = {}
) => {
  const {
    page = 1,
    limit = 10,
    ...queryOptions
  } = options;

  return useQuery({
    queryKey: [
      ...QUERY_KEYS.REVIEW.MY_LIST,
      page,
      limit,
    ],

    queryFn: () =>
      reviewService.getMyReviews({
        page,
        limit,
      }),

    ...queryOptions,
  });
};

export const useTutorReviews = (
  tutorProfileId,
  options = {}
) => {
  const {
    page = 1,
    limit = 10,
    ...queryOptions
  } = options;

  return useQuery({
    queryKey: [
      ...QUERY_KEYS.REVIEW.TUTOR_LIST(
        tutorProfileId
      ),
      page,
      limit,
    ],

    queryFn: () =>
      reviewService.getTutorReviews(
        tutorProfileId,
        {
          page,
          limit,
        }
      ),

    enabled:
      Boolean(tutorProfileId) &&
      (queryOptions.enabled ?? true),

    ...queryOptions,
  });
};

export const useCreateReview = (
  options = {}
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      reviewService.create(data),

    onSuccess: (
      data,
      variables,
      context
    ) => {
      queryClient.invalidateQueries({
        queryKey: ["my-reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tutor-reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tutor"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tutors"],
      });

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