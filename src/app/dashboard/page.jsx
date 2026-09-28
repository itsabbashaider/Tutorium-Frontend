"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { getDashboardRoute } from "@/utils/auth/auth.util";
import { Loading } from "@/components/common";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const destination = getDashboardRoute(user);
    router.replace(destination);
  }, [user, isAuthenticated, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f9f9ff]">
      <Loading />
    </div>
  );
}