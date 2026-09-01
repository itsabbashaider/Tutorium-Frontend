"use client";

import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  Loading,
} from "@/components/common";

import {
  useAuth,
  useTutor,
  useTutorPublicAvailability,
} from "@/hooks";

import CreateBookingModal from "@/components/student/create-booking-modal.component";

import { DAYS_OF_WEEK } from "@/constants";

import {
  formatTime,
} from "@/utils";

const TutorPublicAvailabilityPage = () => {
  const params = useParams();
  const router = useRouter();

  const tutorId = params?.tutor_id;

  const [isBookingModalOpen, setIsBookingModalOpen] =
    useState(false);

  const {
    user,
    isLoading: isAuthLoading,
  } = useAuth();

  const userRole = String(
    user?.role || ""
  )
    .trim()
    .toUpperCase();

  const isStudent =
    userRole === "STUDENT";

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
    isAuthLoading ||
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

  const slots = Array.isArray(
    availability
  )
    ? availability
    : [];

  const groupedAvailability = DAYS_OF_WEEK.map(
    (day) => ({
      ...day,

      slots: slots
        .filter(
          (slot) =>
            Number(slot.day_of_week) ===
            day.value
        )
        .sort((a, b) =>
          String(
            a.start_time || ""
          ).localeCompare(
            String(
              b.start_time || ""
            )
          )
        ),
    })
  ).filter(
    (day) => day.slots.length > 0
  );

  const canBook =
    isStudent &&
    tutor.is_bookable === true;

  const handleBookingSuccess = (
    booking
  ) => {
    setIsBookingModalOpen(false);

    if (booking?.booking_id) {
      router.push(
        `/student/bookings/${booking.booking_id}`
      );
      return;
    }

    router.push(
      "/student/bookings"
    );
  };

  return (
    <>
      <div className="mx-auto w-full max-w-6xl">
        {/* Back */}
        <div className="mb-8">
          <Link href={`/tutor/${tutorId}`}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="group gap-2 px-2.5"
            >
              <span
                aria-hidden="true"
                className="text-base leading-none transition-transform duration-150 group-hover:-translate-x-0.5"
              >
                ←
              </span>

              <span>
                Back to profile
              </span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <section className="mb-6 flex flex-col gap-4 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
              Availability
            </h1>
          </div>

          {tutor.is_available && (
            <span className="w-fit rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-3 py-1.5 text-xs font-medium text-[#5c5f60]">
              Available
            </span>
          )}
        </section>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>
              Weekly schedule
            </CardTitle>
          </CardHeader>

          <CardContent>
            {groupedAvailability.length === 0 ? (
              <EmptyState
                title="No availability listed"
                message="This tutor currently has no public availability."
              />
            ) : (
              <div className="divide-y divide-[#e5e7eb]">
                {groupedAvailability.map(
                  (day) => (
                    <div
                      key={day.value}
                      className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-start"
                    >
                      <div className="w-32 shrink-0">
                        <p className="text-sm font-semibold text-black">
                          {day.label}
                        </p>
                      </div>

                      <div className="flex flex-1 flex-wrap gap-2">
                        {day.slots.map(
                          (slot) => (
                            <div
                              key={
                                slot.availability_slot_id ||
                                `${day.value}-${slot.start_time}-${slot.end_time}`
                              }
                              className="rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-4 py-3"
                            >
                              <p className="text-sm font-medium text-black">
                                {formatTime(
                                  slot.start_time
                                )}
                              </p>

                              <p className="mt-1 text-xs text-[#626770]">
                                until{" "}
                                {formatTime(
                                  slot.end_time
                                )}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking */}
        {isStudent && (
          <div className="mt-6 flex flex-col gap-4 border-t border-[#e5e7eb] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-black">
                Book a lesson
              </p>

              <p className="mt-1 text-sm text-[#626770]">
                Select an available time during booking.
              </p>
            </div>

            <Button
              type="button"
              className="h-11 w-full sm:w-auto"
              disabled={!canBook}
              onClick={() =>
                setIsBookingModalOpen(
                  true
                )
              }
            >
              {!tutor.is_available
                ? "Currently unavailable"
                : slots.length === 0
                  ? "No availability"
                  : "Request a lesson"}
            </Button>
          </div>
        )}
      </div>

      {/* Create booking modal */}
      {isStudent && (
        <CreateBookingModal
          isOpen={isBookingModalOpen}
          tutor={tutor}
          availability={slots}
          onClose={() =>
            setIsBookingModalOpen(
              false
            )
          }
          onSuccess={
            handleBookingSuccess
          }
        />
      )}
    </>
  );
};

export default TutorPublicAvailabilityPage;