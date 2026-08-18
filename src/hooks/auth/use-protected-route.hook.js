"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { USER_ROLES } from "@/constants";
import { useAuth } from "@/hooks/auth/use-auth.hook";

export const useProtectedRoute = ({
  roles = [],
  redirectTo = "/login",
} = {}) => {
  console.count("useProtectedRoute");
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading, isAuthenticated, logout } = useAuth();

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  useEffect(() => {
    if (loading || isPublicRoute) {
      return;
    }

    if (!isAuthenticated || !user) {
      if (pathname !== redirectTo) {
        router.replace(redirectTo);
      }
      return;
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
      let fallbackPath = "/";

      if (user.role === USER_ROLES.STUDENT) {
        fallbackPath = "/student/dashboard";
      } else if (user.role === USER_ROLES.TUTOR) {
        fallbackPath = "/tutor/dashboard";
      }

      if (pathname !== fallbackPath) {
        router.replace(fallbackPath);
      }
    }
  }, [
    loading,
    isAuthenticated,
    user,
    roles,
    router,
    pathname,
    redirectTo,
    isPublicRoute,
  ]);

  return {
    user,
    loading,
    isAuthenticated,
    logout,
  };
};
