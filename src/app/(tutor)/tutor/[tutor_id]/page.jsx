"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

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
  useTutor,
  useTutorPublicAvailability,
} from "@/hooks";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const formatTime = (time) => {
  if (!time) return "—";

  const normalized = String(time).slice(0, 5);
  const [hours, minutes] = normalized.split(":");

  if (
    hours === undefined ||
    minutes === undefined
  ) {
    return normalized;
  }

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatTeachingMode = (mode) => {
  if (!mode) return "Not specified";

  return String(mode)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

const getDayName = (day) => {
  return (
    DAYS.find(
      (item) => item.value === Number(day)
    )?.label || "Unknown day"
  );
};

const TutorPublicDashboardPage = () => {
  const params = useParams();

  const tutorId = params?.tutor_id;

  const {
    data: tutor,
    isLoading: isTutorLoading,
    isError: isTutorError,
    error: tutorError,
  } = useTutor(tutorId);

  const {
    data: availability = [],
    isLoading: isAvailabilityLoading,
    isError: isAvailabilityError,
    error: availabilityError,
  } = useTutorPublicAvailability(
    tutorId
  );

  if (
    isTutorLoading ||
    isAvailabilityLoading
  ) {
    return <Loading />;
  }

  if (isTutorError) {
    return (
      <ErrorState
        title="Unable to load tutor"
        message={
          tutorError?.response?.data?.message ||
          tutorError?.message ||
          "Unable to load this tutor."
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
          "Unable to load this tutor's availability."
        }
      />
    );
  }

  if (!tutor) {
    return (
      <EmptyState
        title="Tutor not found"
        message="This tutor profile is no longer available."
      />
    );
  }

  const {
    tutor_profile_id,
    full_name,
    city,
    professional_bio,
    hourly_rate,
    teaching_mode,
    is_available,
    avg_rating,
    total_completed_sessions,
    subjects = [],
  } = tutor;

  const slots = Array.isArray(
    availability
  )
    ? availability
    : [];

  const previewSlots = slots.slice(0, 4);

  const userInitial =
    full_name?.charAt(0)?.toUpperCase() ||
    "T";

  const formattedRate =
    hourly_rate !== undefined &&
    hourly_rate !== null
      ? `PKR ${Number(
          hourly_rate
        ).toLocaleString()}`
      : "—";

  const formattedRating =
    avg_rating !== undefined &&
    avg_rating !== null
      ? Number(avg_rating).toFixed(1)
      : "—";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Profile header */}
      <Card className="overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Identity */}
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-2xl font-semibold text-[#3949ab]">
                  {userInitial}
                </div>

                <div className="min-w-0">
                  <h1 className="text-3xl font-semibold tracking-tight text-black">
                    {full_name || "Tutor"}
                  </h1>

                  {city && (
                    <p className="mt-1 text-sm text-[#626770]">
                      {city}
                    </p>
                  )}

                  <p className="mt-3 text-xs font-medium text-[#8a8e95]">
                    {formatTeachingMode(
                      teaching_mode
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href={`/student/bookings/create?tutor_id=${tutor_profile_id}`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    className="w-full sm:w-auto"
                    disabled={!is_available}
                  >
                    {is_available
                      ? "Request a lesson"
                      : "Currently unavailable"}
                  </Button>
                </Link>

                <Link
                  href={`/tutor/${tutorId}/availability`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full transition-colors hover:border-black hover:bg-black hover:text-white sm:w-auto"
                  >
                    View availability
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bio */}
            {professional_bio && (
              <div className="border-t border-[#e5e7eb] pt-6">
                <p className="max-w-4xl whitespace-pre-wrap text-sm leading-7 text-[#33373d]">
                  {professional_bio}
                </p>
              </div>
            )}

            {/* Key facts */}
            <div className="grid gap-5 border-t border-[#e5e7eb] pt-6 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                  Rating
                </p>

                <p className="mt-1.5 text-lg font-semibold text-black">
                  {formattedRating}
                  <span className="ml-1 text-sm font-normal text-[#8a8e95]">
                    / 5
                  </span>
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                  Completed sessions
                </p>

                <p className="mt-1.5 text-lg font-semibold text-black">
                  {total_completed_sessions ??
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                  Hourly rate
                </p>

                <p className="mt-1.5 text-lg font-semibold text-black">
                  {formattedRate}
                  <span className="ml-1 text-sm font-normal text-[#8a8e95]">
                    / hr
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>

        <CardContent>
          {subjects.length === 0 ? (
            <p className="text-sm text-[#626770]">
              No subjects listed.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <span
                  key={
                    subject.subject_id ||
                    subject.id ||
                    subject.subject_name
                  }
                  className="rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-3 py-1.5 text-sm font-medium text-[#33373d]"
                >
                  {subject.subject_name}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-7 text-[#33373d]">
            {professional_bio ||
              "No professional bio has been added."}
          </p>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>
              Availability
            </CardTitle>

            <Link
              href={`/tutor/${tutorId}/availability`}
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                Full schedule
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          {slots.length === 0 ? (
            <p className="text-sm text-[#626770]">
              No availability is currently listed.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {previewSlots.map((slot) => (
                <div
                  key={
                    slot.availability_slot_id ||
                    `${slot.day_of_week}-${slot.start_time}-${slot.end_time}`
                  }
                  className="rounded-lg border border-[#e5e7eb] bg-[#fafbfc] p-4"
                >
                  <p className="text-sm font-semibold text-black">
                    {getDayName(
                      slot.day_of_week
                    )}
                  </p>

                  <p className="mt-2 text-sm text-[#626770]">
                    {formatTime(
                      slot.start_time
                    )}{" "}
                    –{" "}
                    {formatTime(
                      slot.end_time
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}

          {slots.length > 4 && (
            <Link
              href={`/tutor/${tutorId}/availability`}
              className="mt-4 inline-flex text-sm font-medium text-[#3949ab] hover:underline"
            >
              View all availability
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>
              Student reviews
            </CardTitle>

            <Link
              href={`/tutor/${tutorId}/reviews`}
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                View all reviews
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-5">
            <div>
              <p className="text-3xl font-semibold text-black">
                {formattedRating}
              </p>

              <p className="mt-1 text-sm text-[#626770]">
                out of 5
              </p>
            </div>

            <div className="h-10 w-px bg-[#e5e7eb]" />

            <div>
              <p className="text-sm font-medium text-black">
                {total_completed_sessions ??
                  0}{" "}
                completed sessions
              </p>

              <p className="mt-1 text-sm text-[#626770]">
                Read student feedback from completed lessons.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorPublicDashboardPage;