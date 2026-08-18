"use client";

import { useQuery } from "@tanstack/react-query";

import subjectService from "@/services/common/subject.service";

export const useSubjects = (options = {}) => {
  return useQuery({
    queryKey: ["subjects"],

    queryFn: () => subjectService.getAll(),

    enabled: options.enabled ?? true,

    ...options,
  });
};

export const useSearchSubjects = (search, options = {}) => {
  const normalizedSearch = search?.trim() || "";

  return useQuery({
    queryKey: ["subjects", "search", normalizedSearch],

    queryFn: () => subjectService.search(normalizedSearch),

    enabled: Boolean(normalizedSearch) && (options.enabled ?? true),

    ...options,
  });
};
