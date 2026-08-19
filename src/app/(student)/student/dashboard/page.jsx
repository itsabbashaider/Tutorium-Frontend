"use client";

import  LogoutButton  from "@/components/auth/logout-button.component";
import { useAuth } from "@/hooks";

export default function StudentDashboardPage() {
const { user, loading } = useAuth();

if (loading) {
return (
<main className="flex min-h-screen items-center justify-center bg-[#f8f7f7]">
<p className="text-sm text-[#5c5f60]">
Loading dashboard...
</p>
</main>
);
}

return (
<main className="min-h-screen bg-[#f8f7f7] px-4 py-10 sm:px-6 lg:px-8">
<div className="mx-auto max-w-7xl">
<header className="flex items-center justify-between border-b border-gray-200 pb-6">
<div>
<p className="text-sm font-semibold text-[#003fa4]">
Tutorium
</p>

        <h1 className="mt-1 text-3xl font-bold text-black">
          Student Dashboard
        </h1>

        <p className="mt-2 text-sm text-[#5c5f60]">
          Welcome back{user?.full_name ? `, ${user.full_name}` : ""}.
        </p>
      </div>

      <LogoutButton className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60" />
    </header>

    <section className="mt-8 grid gap-5 md:grid-cols-3">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-black">
          Find a Tutor
        </h2>

        <p className="mt-2 text-sm text-[#5c5f60]">
          Search tutors by subject, name, or city.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-black">
          My Bookings
        </h2>

        <p className="mt-2 text-sm text-[#5c5f60]">
          View and manage your lesson bookings.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-black">
          My Profile
        </h2>

        <p className="mt-2 text-sm text-[#5c5f60]">
          Manage your student profile information.
        </p>
      </div>
    </section>
  </div>
</main>

);
}