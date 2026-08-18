"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useRef, useState } from "react";

import authService from "@/services/auth/auth.service";

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [signedOutPath, setSignedOutPath] =
    useState(null);

  const authAbortControllerRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Route State
  |--------------------------------------------------------------------------
  */

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  /*
  |--------------------------------------------------------------------------
  | Prevent /me refetch after unauthorized response
  |--------------------------------------------------------------------------
  */

  const isSignedOut =
    signedOutPath === pathname;

  /*
  |--------------------------------------------------------------------------
  | Current User
  |--------------------------------------------------------------------------
  */

  const meQuery = useQuery({
    queryKey: ["me"],

    queryFn: async () => {
      try {
        return await authService.getMe();
      } catch (error) {
        if (error?.response?.status === 401) {
          setSignedOutPath(pathname);
          return null;
        }

        throw error;
      }
    },

    enabled:
      !isPublicRoute &&
      !isSignedOut,

    retry: false,

    staleTime: Infinity,
    gcTime: Infinity,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

    throwOnError: false,
  });

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  const loginMutation = useMutation({
    mutationFn: async (payload) => {
      const controller =
        new AbortController();

      authAbortControllerRef.current =
        controller;

      try {
        return await authService.login(
          payload,
          {
            signal: controller.signal,
          }
        );
      } finally {
        if (
          authAbortControllerRef.current ===
          controller
        ) {
          authAbortControllerRef.current =
            null;
        }
      }
    },

    onSuccess: async () => {
      setSignedOutPath(null);

      const me =
        await queryClient.fetchQuery({
          queryKey: ["me"],

          queryFn: async () => {
            try {
              return await authService.getMe();
            } catch (error) {
              if (
                error?.response?.status === 401
              ) {
                return null;
              }

              throw error;
            }
          },

          staleTime: Infinity,
        });

      const redirect =
        searchParams.get("redirect");

      if (
        redirect &&
        redirect.startsWith("/") &&
        !redirect.startsWith("//")
      ) {
        router.replace(redirect);
        return;
      }

      if (me?.role === "STUDENT") {
        router.replace(
          "/student/dashboard"
        );
        return;
      }

      if (me?.role === "TUTOR") {
        router.replace(
          "/tutor/dashboard"
        );
      }
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Signup
  |--------------------------------------------------------------------------
  */

  const signupMutation = useMutation({
    mutationFn: async (payload) => {
      const controller =
        new AbortController();

      authAbortControllerRef.current =
        controller;

      try {
        return await authService.signup(
          payload,
          {
            signal: controller.signal,
          }
        );
      } finally {
        if (
          authAbortControllerRef.current ===
          controller
        ) {
          authAbortControllerRef.current =
            null;
        }
      }
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Cancel Login / Signup Request
  |--------------------------------------------------------------------------
  */

  const cancelAuthRequest = () => {
    if (authAbortControllerRef.current) {
      authAbortControllerRef.current.abort();

      authAbortControllerRef.current =
        null;
    }

    loginMutation.reset();
    signupMutation.reset();
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const logoutMutation = useMutation({
    mutationFn: authService.logout,

    onSuccess: async () => {
      setSignedOutPath(pathname);

      await queryClient.cancelQueries();

      queryClient.removeQueries({
        predicate: (query) => {
          const key = query.queryKey;

          return (
            Array.isArray(key) &&
            (
              key[0] === "tutor-dashboard" ||
              key[0] === "student-dashboard" ||
              key[0] === "student-bookings" ||
              key[0] === "tutor-bookings" ||
              key[0] === "booking" ||
              key[0] === "my-reviews" ||
              key[0] === "tutor-reviews" ||
              key[0] === "review" ||
              key[0] === "tutor-availability" ||
              key[0] === "subjects" ||
              key[0] === "tutors" ||
              key[0] === "tutor" ||
              key[0] === "student" ||
              key[0] === "user"
            )
          );
        },
      });

      queryClient.removeQueries({
        queryKey: ["me"],
      });

      queryClient.clear();

      router.replace("/login");
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Forgot Password
  |--------------------------------------------------------------------------
  */

  const forgotPasswordMutation =
    useMutation({
      mutationFn:
        authService.forgotPassword,
    });

  /*
  |--------------------------------------------------------------------------
  | Reset Password
  |--------------------------------------------------------------------------
  */

  const resetPasswordMutation =
    useMutation({
      mutationFn:
        authService.resetPassword,
    });

  /*
  |--------------------------------------------------------------------------
  | Refresh Token
  |--------------------------------------------------------------------------
  */

  const refreshTokenMutation =
    useMutation({
      mutationFn:
        authService.refreshToken,
    });

  /*
  |--------------------------------------------------------------------------
  | Return
  |--------------------------------------------------------------------------
  */

  return {
    user: meQuery.data ?? null,

    isAuthenticated:
      !!meQuery.data,

    loading:
      meQuery.isPending,

    meQuery,

    loginMutation,
    signupMutation,
    logoutMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    refreshTokenMutation,

    cancelAuthRequest,

    logout: () =>
      logoutMutation.mutateAsync(),
  };
};