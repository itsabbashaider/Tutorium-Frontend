"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  QUERY_KEYS,
} from "@/constants";

import tutorSubjectService from "@/services/tutor/tutor-subject.service";

const TUTOR_SUBJECTS_KEY = [
  "tutor-subjects",
];

export const useTutorSubjects = (
  options = {}
) => {
  return useQuery({
    queryKey: TUTOR_SUBJECTS_KEY,

    queryFn: () =>
      tutorSubjectService.getAll(),

    enabled:
      options.enabled ?? true,

    ...options,
  });
};

const invalidateTutorSubjectViews = (
  queryClient
) => {
  queryClient.invalidateQueries({
    queryKey: TUTOR_SUBJECTS_KEY,
  });

  queryClient.invalidateQueries({
    queryKey:
      QUERY_KEYS.TUTOR.PROFILE,
  });

  queryClient.invalidateQueries({
    queryKey:
      QUERY_KEYS.TUTOR.LIST,
  });

  queryClient.invalidateQueries({
    queryKey: ["tutor"],
  });
};

export const useAddTutorSubjects = (
  options = {}
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      tutorSubjectService.add(
        payload
      ),

    onSuccess: (
      data,
      variables,
      context
    ) => {
      invalidateTutorSubjectViews(
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

export const useRemoveTutorSubject = (
  options = {}
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (subjectId) =>
      tutorSubjectService.remove(
        subjectId
      ),

    onSuccess: (
      data,
      variables,
      context
    ) => {
      invalidateTutorSubjectViews(
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