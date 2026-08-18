"use client";

import Link from "next/link";

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
  useTutorAvailability,
} from "@/hooks";

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

  const {
    data: availability = [],
    isLoading: isAvailabilityLoading,
    isError: isAvailabilityError,
    error: availabilityError,
  } = useTutorAvailability();

  const isLoading =
    isUserLoading ||
    isTutorLoading ||
    isDashboardLoading ||
    isSubjectsLoading ||
    isAvailabilityLoading;

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

  if (isAvailabilityError) {
    return (
      <ErrorState
        title="Unable to load availability"
        message={
          availabilityError?.response?.data?.message ||
          availabilityError?.message ||
          "Unable to load your availability."
        }
      />
    );
  }

  const tutorStats =
    dashboard?.tutor_stats || {};

  const bookingStats =
    dashboard?.booking_stats || {};

  const {
    professional_bio,
    hourly_rate,
    teaching_mode,
    is_available,
  } = tutor || {};

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

  const bookingOverview = [
    {
      label: "Pending",
      value: pending_bookings ?? 0,
      variant: "warning",
    },
    {
      label: "Accepted",
      value: accepted_bookings ?? 0,
      variant: "info",
    },
    {
      label: "Completed",
      value: completed_bookings ?? 0,
      variant: "success",
    },
    {
      label: "Rejected",
      value: rejected_bookings ?? 0,
      variant: "danger",
    },
    {
      label: "Cancelled",
      value: cancelled_bookings ?? 0,
      variant: "secondary",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
            Welcome back
            {user?.full_name
              ? `, ${user.full_name}`
              : ""}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#626770]">
            A quick overview of your tutoring activity,
            profile, and bookings.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/tutor/bookings">
            <Button>
              Manage bookings
            </Button>
          </Link>

          <Link href="/tutor/settings/profile">
            <Button variant="outline">
              Edit profile
            </Button>
          </Link>
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

              <p className="mt-2 text-2xl font-semibold text-black">
                {average_rating !== undefined &&
                average_rating !== null
                  ? Number(
                      average_rating
                    ).toFixed(1)
                  : "—"}/5
              </p>

              <p className="mt-1 text-xs text-[#6b7280]">
                {total_reviews ?? 0} reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Completed sessions
              </p>

              <p className="mt-2 text-2xl font-semibold text-black">
                {completed_sessions ?? 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Total earnings
              </p>

              <p className="mt-2 text-2xl font-semibold text-black">
                Rs.{" "}
                {Number(
                  total_earnings ?? 0
                ).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Total bookings
              </p>

              <p className="mt-2 text-2xl font-semibold text-black">
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
              <Button variant="outline">
                View bookings
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {bookingOverview.map(
            ({ label, value, variant }) => (
              <div
                key={label}
                className="rounded-lg border border-[#e5e7eb] bg-[#fafbfc] p-4"
              > {label}
                <p className="mt-3 text-2xl font-semibold text-black">
                  {value}
                </p>
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
                Information about the tutor.
              </CardDescription>
            </div>

            <Link href="/tutor/settings/profile">
              <Button variant="outline">
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
                {user?.full_name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                City
              </p>

              <p className="mt-1 text-sm font-medium text-black">
                {user?.city || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Hourly rate
              </p>

              <p className="mt-1 text-sm font-medium text-black">
                {hourly_rate !== undefined &&
                hourly_rate !== null
                  ? `Rs. ${Number(
                      hourly_rate
                    ).toLocaleString()}/hr`
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Teaching mode
              </p>

              <p className="mt-1 text-sm font-medium text-black">
                {teaching_mode || "—"}
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
                <Button variant="outline">
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
                <Button variant="outline">
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                  {availability.length}
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
