"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Star, Monitor, MapPin, Globe } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  Loading,
  UserAvatar,
} from "@/components/common";

import { useAuth, useTutor, useTutorPublicAvailability } from "@/hooks";

import CreateBookingModal from "@/components/student/create-booking-modal.component";
import { DAYS_OF_WEEK } from "@/constants";
import { formatTime } from "@/utils";

const getDayName = (day) => {
  return (
    DAYS_OF_WEEK.find((item) => item.value === Number(day))?.label ||
    "Unknown day"
  );
};

const getTeachingMode = (mode) => {
  const normalized = mode?.toLowerCase() || "";
  if (normalized.includes("online")) return "online";
  if (normalized.includes("person") || normalized.includes("physical")) {
    return "in-person";
  }
  return "other";
};

const TutorPublicDashboardPage = () => {
  const params = useParams();
  const router = useRouter();

  const tutorId = params?.tutor_id;

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { user } = useAuth();
  const studentId =
    user?.student_profile_id || user?.student_id || user?.user_id || user?.id;

  const userRole = String(user?.role || "")
    .trim()
    .toUpperCase();

  const isStudent = userRole === "STUDENT";

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
  } = useTutorPublicAvailability(tutorId);

  if (isTutorLoading || isAvailabilityLoading) {
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
    is_online,
    avg_rating,
    total_completed_sessions,
    subjects = [],
  } = tutor;

  const tutorName = full_name || tutor.user?.full_name || "Tutor";
  const avatarUrl = tutor.avatar_url || tutor.user?.avatar_url || null;
  const tutorIsOnline = is_online === true;

  const slots = Array.isArray(availability) ? availability : [];
  const previewSlots = slots.slice(0, 4);

  const formattedRate =
    hourly_rate !== undefined && hourly_rate !== null
      ? `PKR ${Number(hourly_rate).toLocaleString()}`
      : "—";

  const formattedRating =
    avg_rating !== undefined && avg_rating !== null && avg_rating > 0
      ? Number(avg_rating).toFixed(1)
      : null;

  const canBook = isStudent && tutor.is_bookable === true;
  const teachingMode = getTeachingMode(teaching_mode);

  const handleBookingSuccess = (booking) => {
    setIsBookingModalOpen(false);

    if (booking?.booking_id) {
      router.push(`/student/${studentId}/bookings/${booking.booking_id}`);
      return;
    }

    router.push(`/student/${studentId}/bookings`);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Profile header */}
        <Card className="overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                {/* Identity */}
                <div className="flex items-start gap-5">
                  <div className="relative">
                    <UserAvatar
                      avatarUrl={avatarUrl}
                      name={tutorName}
                      fallbackChar="T"
                      size="xl"
                      className="h-20 w-20 rounded-xl text-2xl border-2 border-white shadow-sm"
                    />

                    {/* Green Online Presence Dot */}
                    {tutorIsOnline && (
                      <span
                        className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white"
                        title="Online now"
                        aria-label="Online now"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-3xl font-semibold tracking-tight text-black">
                      {tutorName}
                    </h1>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#626770]">
                      {city && (
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-[#8a8e95]" />
                          {city}
                        </span>
                      )}

                      {teaching_mode && (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-0.5 font-medium text-gray-700">
                          <span className="text-[#8a8e95] font-normal">Mode:</span>
                          {teachingMode === "online" && (
                            <Monitor className="h-3.5 w-3.5 text-gray-500" />
                          )}
                          {teachingMode === "in-person" && (
                            <MapPin className="h-3.5 w-3.5 text-gray-500" />
                          )}
                          {teachingMode === "other" && (
                            <Globe className="h-3.5 w-3.5 text-gray-500" />
                          )}
                          {teaching_mode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:flex-row">
                  {isStudent && (
                    <Button
                      type="button"
                      className="h-11 w-full sm:w-auto"
                      disabled={!canBook}
                      onClick={() => setIsBookingModalOpen(true)}
                    >
                      {canBook ? "Request a lesson" : "Currently unavailable"}
                    </Button>
                  )}
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
                    Availability
                  </p>

                  <p className="mt-1.5 flex items-center gap-2 text-lg font-semibold text-black">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        is_available ? "bg-[#2fa860]" : "bg-[#c9cdd3]"
                      }`}
                    />

                    {is_available ? "Available" : "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                    Completed sessions
                  </p>

                  <p className="mt-1.5 text-lg font-semibold text-black">
                    {total_completed_sessions ?? "—"}
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
              <p className="text-sm text-[#626770]">No subjects listed.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <span
                    key={
                      subject.subject_id || subject.id || subject.subject_name
                    }
                    className="rounded-full bg-[#f0f1f3] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#4c4546]"
                  >
                    {subject.subject_name}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Availability</CardTitle>

              <Link href={`/tutor/${tutorId}/availability`}>
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
                      {getDayName(slot.day_of_week)}
                    </p>

                    <p className="mt-2 text-sm text-[#626770]">
                      {formatTime(slot.start_time)} –{" "}
                      {formatTime(slot.end_time)}
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
              <CardTitle>Student reviews</CardTitle>

              <Link href={`/tutor/${tutorId}/review`}>
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
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 fill-black" />

                <p className="text-3xl font-semibold text-black">
                  {formattedRating || "—"}
                </p>
              </div>

              <div className="h-10 w-px bg-[#e5e7eb]" />

              <p className="text-sm font-medium text-black">
                {total_completed_sessions ?? 0} completed sessions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create booking modal */}
      {isStudent && (
        <CreateBookingModal
          isOpen={isBookingModalOpen}
          tutor={tutor}
          availability={slots}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
};

export default TutorPublicDashboardPage;