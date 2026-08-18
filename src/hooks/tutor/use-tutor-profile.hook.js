"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import tutorService from "@/services/tutor/tutor.service";

export const useTutorProfile = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.TUTOR.PROFILE,

    queryFn: () => tutorService.getProfile(),

    enabled: options.enabled ?? true,

    ...options,
  });
};

export const useUpdateTutorProfile = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => tutorService.updateProfile(payload),

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TUTOR.PROFILE,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TUTOR.LIST,
      });

      queryClient.invalidateQueries({
        queryKey: ["tutor"],
      });

      options.onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      options.onError?.(error, variables, context);
    },

    ...options,
  });
};
