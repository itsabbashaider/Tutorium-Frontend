export const getLoginRedirectUrl = (pathname) => {
  if (
    !pathname ||
    !pathname.startsWith("/") ||
    pathname.startsWith("//")
  ) {
    return "/login";
  }

  return `/login?redirect=${encodeURIComponent(pathname)}`;
};

export const getSafeRedirect = (redirect) => {
  if (
    !redirect ||
    !redirect.startsWith("/") ||
    redirect.startsWith("//")
  ) {
    return null;
  }

  return redirect;
};

export const getDashboardRoute = (user) => {
  if (!user) return "/login";

  if (user.role === "STUDENT") {
    const studentId = user.student_profile_id || user.student_id || user.id;
    return "/student/${studentId}/dashboard";
  }

  if (user.role === "TUTOR") {
    return "/tutor/dashboard";
  }

  return "/dashboard";
};