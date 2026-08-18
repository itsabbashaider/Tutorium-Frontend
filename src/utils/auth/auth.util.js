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