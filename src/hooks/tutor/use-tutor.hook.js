"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import tutorService from "@/services/tutor/tutor.service";

export const useTutors = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TUTOR.LIST, params],

    queryFn: () => tutorService.getAll(params),

    enabled: options.enabled ?? true,

    ...options,
  });
};

export const useTutor = (tutor_profile_id, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.TUTOR.DETAIL(tutor_profile_id),

    queryFn: () => tutorService.getById(tutor_profile_id),

    enabled: Boolean(tutor_profile_id) && (options.enabled ?? true),

    ...options,
  });
};

export const useTutorPublicAvailability = (tutor_profile_id, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.AVAILABILITY.PUBLIC(tutor_profile_id),

    queryFn: () => tutorService.getAvailability(tutor_profile_id),

    enabled: Boolean(tutor_profile_id) && (options.enabled ?? true),

    ...options,
  });
};
