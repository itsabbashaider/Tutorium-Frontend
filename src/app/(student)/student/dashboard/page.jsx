"use client";

import Link from "next/link";
import { useEffect } from "react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
  Loading,
} from "@/components/common";

import {
  useProfile,
  useStudentDashboard,
  useStudentProfile,
} from "@/hooks";

const StudentDashboard = () => {
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
  } = useProfile();

  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useStudentDashboard();

  const {
    data: studentProfile,
    isLoading: isStudentProfileLoading,
    isError: isStudentProfileError,
    error: studentProfileError,
    refetch: refetchStudentProfile,
  } = useStudentProfile();

  useEffect(() => {
    refetchUser();
    refetchDashboard();
    refetchStudentProfile();
  }, [
    refetchUser,
    refetchDashboard,
    refetchStudentProfile,
  ]);

  const isLoading =
    isUserLoading ||
    isDashboardLoading ||
    isStudentProfileLoading;

  if (isLoading) {
    return <Loading />;
  }

  if (isUserError) {
    return (
      <ErrorState
        title="Unable to load profile"
        message={
          userError?.response?.data?.message ||
          userError?.message ||
          "Unable to load your profile."
        }
      />
    );
  }

  if (isDashboardError) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        message={
          dashboardError?.response?.data?.message ||
          dashboardError?.message ||
          "Unable to load your dashboard."
        }
      />
    );
  }

  if (isStudentProfileError) {
    return (
      <ErrorState
        title="Unable to load student profile"
        message={
          studentProfileError?.response?.data?.message ||
          studentProfileError?.message ||
          "Unable to load your student profile."
        }
      />
    );
  }

  const bookingStats =
    dashboard?.booking_stats || {};

  const reviewStats =
    dashboard?.review_stats || {};

  const totalBookings =
    bookingStats.total_bookings ?? 0;

  const pendingBookings =
    bookingStats.pending_bookings ?? 0;

  const acceptedBookings =
    bookingStats.accepted_bookings ?? 0;

  const completedBookings =
    bookingStats.completed_bookings ?? 0;

  const rejectedBookings =
    bookingStats.rejected_bookings ?? 0;

  const cancelledBookings =
    bookingStats.cancelled_bookings ?? 0;

  const completionRate =
    bookingStats.completion_rate ?? 0;

  const bookingOverview = [
    { label: "Total", value: totalBookings },
    { label: "Pending", value: pendingBookings },
    { label: "Accepted", value: acceptedBookings },
    { label: "Completed", value: completedBookings },
    { label: "Rejected", value: rejectedBookings },
    { label: "Cancelled", value: cancelledBookings },
  ];

  const profileUser =
    studentProfile?.user || {};

  const displayName =
    profileUser.full_name ||
    user?.full_name ||
    "there";

  const initial =
    displayName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <section className="flex flex-col gap-5 border-b border-[#e5e7eb] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f0f3ff] text-lg font-semibold text-[#3949ab]">
            {initial}
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
            Welcome back
          </h1>
        </div>
      </section>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Bookings</CardTitle>

            <Link href="/student/bookings">
              <Button
                type="button"
                variant="outline"
                size="sm"
              >
                View all
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border border-[#e5e7eb] bg-[#fafbfc] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-black">
                  Completion rate
                </p>

                <p className="mt-0.5 text-xs text-[#8a8e95]">
                  Completed out of finalized bookings
                </p>
              </div>

              <p className="text-lg font-semibold text-black">
                {completionRate.toFixed(0)}%
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eef0f2]">
              <div
                className="h-full rounded-full bg-black transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, completionRate)
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {bookingOverview.map(
              ({ label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border border-[#e5e7eb] bg-[#fafbfc] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                    {label}
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
                    {value}
                  </p>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Profile</CardTitle>

            <Link href="/student/settings">
              <Button
                type="button"
                variant="outline"
                size="sm"
              >
                Edit
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Full name
              </p>

              <p className="mt-1 text-sm font-medium text-black">
                {profileUser.full_name ||
                  user?.full_name ||
                  "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                City
              </p>

              <p className="mt-1 text-sm font-medium text-black">
                {profileUser.city ||
                  user?.city ||
                  "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Academic level
              </p>

              <p className="mt-1 text-sm font-medium text-black">
                {studentProfile?.academic_level ||
                  "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Reviews posted
              </p>

              <p className="mt-1 text-sm font-medium text-black">
                {reviewStats.total_reviews ?? 0}
              </p>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb] pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
              Learning goals
            </p>

            <p className="mt-2 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-[#33373d]">
              {studentProfile?.learning_goals ||
                "No learning goals added."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;