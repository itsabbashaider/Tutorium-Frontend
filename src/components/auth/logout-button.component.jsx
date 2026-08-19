"use client";

import { useAuth } from "@/hooks";

const LogoutButton = ({ className = "" }) => {
  const { logoutMutation } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error(
        "Logout failed:",
        error?.response?.data || error?.message
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className={className}
    >
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;