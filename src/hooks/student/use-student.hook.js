"use client";

import {
  useMutation,
  useQuery,
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
  return useMutation({
    mutationFn: (data) =>
      studentService.updateProfile(
        data
      ),

    ...options,
  });
};