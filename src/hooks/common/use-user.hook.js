"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import userService from "@/services/common/user.service";

export const useProfile = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER.PROFILE,

    queryFn: () =>
      userService.getProfile(),

    enabled: options.enabled ?? true,

    ...options,
  });
};

export const useUpdateProfile = (
  options = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      userService.updateProfile(data),

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER.PROFILE,
      });

      options.onSuccess?.(
        data,
        variables,
        context
      );
    },

    onError: (error, variables, context) => {
      options.onError?.(
        error,
        variables,
        context
      );
    },

    ...options,
  });
};

export const useDeleteAccount = (
  options = {}
) => {
  return useMutation({
    mutationFn: () =>
      userService.deleteAccount(),

    ...options,
  });
};