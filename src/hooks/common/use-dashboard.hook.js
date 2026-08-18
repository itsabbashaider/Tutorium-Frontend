"use client";

import { useQuery } from "@tanstack/react-query";

import dashboardService from "@/services/common/dashboard.service";

export const useTutorDashboard = (
  options = {}
) => {
  return useQuery({
    queryKey: ["tutor-dashboard"],

    queryFn: () =>
      dashboardService.getTutorDashboard(),

    enabled: options.enabled ?? true,

    ...options,
  });
};

export const useStudentDashboard = (
  options = {}
) => {
  return useQuery({
    queryKey: ["student-dashboard"],

    queryFn: () =>
      dashboardService.getStudentDashboard(),

    enabled: options.enabled ?? true,

    ...options,
  });
};