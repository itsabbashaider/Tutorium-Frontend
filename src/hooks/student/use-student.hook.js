"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";

import studentService from "@/services/student/student.service";

export const useStudentProfile = (
  options = {}
) => {
  return useQuery({
    queryKey:
      QUERY_KEYS.STUDENT.PROFILE,

    queryFn: () =>
      studentService.getProfile(),

    enabled:
      options.enabled ?? true,

    ...options,
  });
};

export const useUpdateStudentProfile = (
  options = {}
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      studentService.updateProfile(data),

    onSuccess: (
      data,
      variables,
      context
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.STUDENT.PROFILE,
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

export const useStudentPublicProfile = (
  student_profile_id,
  options = {}
) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.STUDENT.PROFILE,
      student_profile_id,
    ],

    queryFn: () =>
      studentService.getPublicProfile(
        student_profile_id
      ),

    enabled:
      Boolean(student_profile_id) &&
      (options.enabled ?? true),

    ...options,
  });
};