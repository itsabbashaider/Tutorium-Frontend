"use client";

import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  CircleCheckBig,
  XCircle,
  Ban,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  Loading,
} from "@/components/common";

import {
  useProfile,
  useTutorDashboard,
  useTutorProfile,
  useTutorSubjects,
} from "@/hooks";

import {
  formatBookingCurrency,
  formatRating,
} from "@/utils";

import {
  TEACHING_MODE_LABELS,
} from "@/constants";

const TutorDashboard = () => {
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useProfile();

  const {
    data: tutor,
    isLoading: isTutorLoading,
    isError: isTutorError,
    error: tutorError,
  } = useTutorProfile();

  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    error: dashboardError,
  } = useTutorDashboard();

  const {
    data: subjects = [],
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
    error: subjectsError,
  } = useTutorSubjects();

  const isLoading =
    isUserLoading ||
    isTutorLoading ||
    isDashboardLoading ||
    isSubjectsLoading;

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

  if (isTutorError) {
    return (
      <ErrorState
        title="Unable to load tutor profile"
        message={
          tutorError?.response?.data?.message ||
          tutorError?.message ||
          "Unable to load your tutor profile."
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
          "Unable to load your dashboard statistics."
        }
      />
    );
  }

  if (isSubjectsError) {
    return (
      <ErrorState
        title="Unable to load subjects"
        message={
          subjectsError?.response?.data?.message ||
          subjectsError?.message ||
          "Unable to load your subjects."
        }
      />
    );
  }

  if (!user || !tutor || !dashboard) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-[#626770]">
            Dashboard data is unavailable.
          </p>
        </CardContent>
      </Card>
    );
  }

  const tutorStats =
    dashboard?.tutor_stats || {};

  const bookingStats =
    dashboard?.booking_stats || {};

  const availabilityStats =
    dashboard?.availability_stats || {};

  const {
    professional_bio,
    hourly_rate,
    teaching_mode,
    is_available,
  } = tutor;

  const {
    average_rating,
    completed_sessions,
    total_reviews,
    total_earnings,
  } = tutorStats;

  const {
    total_bookings,
    pending_bookings,
    accepted_bookings,
    rejected_bookings,
    completed_bookings,
    cancelled_bookings,
  } = bookingStats;

  const activeSlots =
    availabilityStats.active_slots ?? 0;

  const bookingOverview = [
    {
      label: "Pending",
      value: pending_bookings ?? 0,
      icon: Clock,
      accent: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "Accepted",
      value: accepted_bookings ?? 0,
      icon: CheckCircle2,
      accent: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Completed",
      value: completed_bookings ?? 0,
      icon: CircleCheckBig,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Rejected",
      value: rejected_bookings ?? 0,
      icon: XCircle,
      accent: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
    },
    {
      label: "Cancelled",
      value: cancelled_bookings ?? 0,
      icon: Ban,
      accent: "text-[#8a8e95]",
      bg: "bg-[#f4f5f6]",
      border: "border-[#e5e7eb]",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-5 border-b border-[#e5e7eb] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
            Welcome back
          </h1>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Average rating
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
                {average_rating !== undefined &&
                average_rating !== null
                  ? formatRating(
                      average_rating
                    )
                  : "—"}

                <span className="text-sm font-normal text-[#8a8e95]">
                  / 5
                </span>
              </p>

              <p className="mt-1 text-xs text-[#6b7280]">
                {total_reviews ?? 0}{" "}
                {total_reviews === 1
                  ? "review"
                  : "reviews"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Completed sessions
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
                {completed_sessions ?? 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Total earnings
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
                {formatBookingCurrency(
                  total_earnings ?? 0
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Total bookings
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
                {total_bookings ?? 0}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Booking overview */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>
                Booking overview
              </CardTitle>

              <CardDescription>
                Current and historical booking activity.
              </CardDescription>
            </div>

            <Link href="/tutor/bookings">
              <Button
                type="button"
                variant="outline"
              >
                View bookings
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {bookingOverview.map(
              ({ label, value, icon: Icon, accent, bg, border }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between rounded-xl border ${border} ${bg} p-4 transition-shadow hover:shadow-sm`}
                >
                  <div>
                    <p className="text-sm font-medium text-[#626770]">
                      {label}
                    </p>

                    <p className="mt-1 text-2xl font-semibold tabular-nums text-black">
                      {value}
                    </p>
                  </div>

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 ${accent}`}
                  >
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={2.25}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile snapshot */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>
                Profile
              </CardTitle>

              <CardDescription>
                Your current tutor profile information.
              </CardDescription>
            </div>

            <Link href="/tutor/settings">
              <Button
                type="button"
                variant="outline"
              >
                Edit profile
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
                {user.full_name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                City
              </p>

              <p className="mt-1 text-sm font-medium text-black">
                {user.city || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Hourly rate
              </p>

              <p className="mt-1 text-sm font-medium text-black">
                {hourly_rate !== undefined &&
                hourly_rate !== null
                  ? `${formatBookingCurrency(
                      hourly_rate
                    )}/hr`
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Teaching mode
              </p>

              <p className="mt-1 text-sm font-medium text-black">
                {TEACHING_MODE_LABELS[
                  teaching_mode
                ] ?? "—"}
              </p>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb] pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
              Professional bio
            </p>

            <p className="mt-2 max-w-4xl whitespace-pre-wrap text-sm leading-6 text-[#33373d]">
              {professional_bio ||
                "No professional bio added."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Subjects + Availability */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Subjects */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>
                  Subjects
                </CardTitle>

                <CardDescription>
                  Subjects you currently teach.
                </CardDescription>
              </div>

              <Link href="/tutor/subjects">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                >
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            {subjects.length === 0 ? (
              <EmptyState
                title="No subjects yet"
                message="Add subjects to make your profile more discoverable."
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {subjects.map(
                  (subject) => (
                    <Badge
                      key={
                        subject.subject_id
                      }
                      variant="secondary"
                    >
                      {subject.subject_name}
                    </Badge>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>
                  Availability
                </CardTitle>

                <CardDescription>
                  Your recurring lesson schedule.
                </CardDescription>
              </div>

              <Link href="/tutor/availability">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                >
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                  Status
                </p>

                <div className="mt-2">
                  <Badge
                    variant={
                      is_available
                        ? "success"
                        : "secondary"
                    }
                  >
                    {is_available
                      ? "Available"
                      : "Unavailable"}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                  Active slots
                </p>

                <p className="mt-2 text-2xl font-semibold text-black">
                  {activeSlots}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default TutorDashboard;