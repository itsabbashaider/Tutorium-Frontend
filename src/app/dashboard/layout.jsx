// app/dashboard/layout.jsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingRoleModal from "@/components/common/role-selection.component";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    fetch(`${apiUrl}/auth/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        const user = data.data;
        // If the user has no role assigned yet, pop the modal!
        if (!user.role) {
          setShowRoleModal(true);
        }
      })
      .catch(() => {
        router.push("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {children}

      {/* Automatically pops up for new Google users */}
      <OnboardingRoleModal
        isOpen={showRoleModal}
        onComplete={() => {
          setShowRoleModal(false);
          window.location.reload(); // Refresh to load dashboard data with the new role
        }}
      />
    </div>
  );
}