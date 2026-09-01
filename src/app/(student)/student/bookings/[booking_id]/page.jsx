"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  MessageSquare,
  Video,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
  Loading,
} from "@/components/common";

import StudentReviewModal from "@/components/student/review-modal.component";

import {
  useBooking,
  useCancelBooking,
} from "@/hooks";

import {
  formatBookingCurrency,
  formatBookingDate,
  formatBookingDateTime,
  formatBookingTime,
  getInitial,
} from "@/utils";

import {
  DAYS_OF_WEEK_BY_NUMBER,
} from "@/constants";

import {
  BOOKING_STATUS_VARIANTS,
  BOOKING_STATUS,
} from "@/constants"

const StudentBookingDetailsPage = () => {
  const params = useParams();

  const bookingId = params?.booking_id;

  const [reviewModalOpen, setReviewModalOpen] =
    useState(false);

  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useBooking(bookingId);

  const cancelMutation =
    useCancelBooking();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load booking"
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load this booking."
        }
      />
    );
  }

  if (!booking) {
    return (
      <ErrorState
        title="Booking not found"
        message="The requested booking could not be found."
      />
    );
  }

  const tutor =
    booking.tutor?.user ?? null;

  const subject =
    booking.subject ?? null;

  const availability =
    booking.availability ?? null;

  const status =
    booking.status || "UNKNOWN";

  const isCompleted =
    status === "COMPLETED";

  const availableActions =
    booking.available_actions ?? {};

  const canCancel =
    availableActions.can_cancel === true;

  const canReview =
    availableActions.can_review === true;

  const tutorName =
    tutor?.full_name || "Tutor";


  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(
        booking.booking_id
      );
    } catch {
      return;
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <Link href="/student/bookings">
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
                Back to bookings
              </span>
            </Button>
          </Link>
        </div>

        <section className="mb-6 flex flex-col gap-4 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
              Booking details
            </h1>

          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                BOOKING_STATUS_VARIANTS[status] ??
                "secondary"
              }
            >
              {BOOKING_STATUS[status] ??
                status}
            </Badge>

            {canCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={
                  cancelMutation.isPending
                }
              >
                {cancelMutation.isPending
                  ? "Cancelling..."
                  : "Cancel booking"}
              </Button>
            )}

            {canReview && (
              <Button
                type="button"
                onClick={() =>
                  setReviewModalOpen(true)
                }
              >
                Give review
              </Button>
            )}
          </div>
        </section>

        {cancelMutation.error && (
          <div className="mb-6 rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
            <p className="text-sm text-[#93000a]">
              {cancelMutation.error?.response
                ?.data?.message ||
                cancelMutation.error?.message ||
                "Unable to cancel this booking."}
            </p>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Tutor
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-sm font-semibold text-[#3949ab]">
                  {getInitial(tutorName, "T")}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-black">
                    {tutorName}
                  </p>

                  {tutor?.city && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-[#626770]">
                      <MapPin
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      />

                      <span>
                        {tutor.city}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Subject
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm font-semibold text-black">
                {subject?.subject_name ||
                  "Subject unavailable"}
              </p>

              <div className="mt-4 border-t border-[#e5e7eb] pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                  Hourly rate
                </p>

                <p className="mt-1.5 text-lg font-semibold text-black">
                  {formatBookingCurrency(
                    booking.booked_hourly_rate
                  )}

                  <span className="ml-1 text-xs font-normal text-[#8a8e95]">
                    / hr
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>
              Lesson
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <div className="flex items-center gap-2 text-[#8a8e95]">
                  <CalendarDays
                    aria-hidden="true"
                    className="h-4 w-4"
                  />

                  <p className="text-xs font-semibold uppercase tracking-wide">
                    Date
                  </p>
                </div>

                <p className="mt-2 text-sm font-medium text-black">
                  {booking.booking_date
                    ? formatBookingDate(
                        booking.booking_date
                      )
                    : "—"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[#8a8e95]">
                  <Clock3
                    aria-hidden="true"
                    className="h-4 w-4"
                  />

                  <p className="text-xs font-semibold uppercase tracking-wide">
                    Start
                  </p>
                </div>

                <p className="mt-2 text-sm font-medium text-black">
                  {booking.booking_start
                    ? formatBookingDateTime(
                        booking.booking_start
                      )
                    : "—"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[#8a8e95]">
                  <Clock3
                    aria-hidden="true"
                    className="h-4 w-4"
                  />

                  <p className="text-xs font-semibold uppercase tracking-wide">
                    End
                  </p>
                </div>

                <p className="mt-2 text-sm font-medium text-black">
                  {booking.booking_end
                    ? formatBookingDateTime(
                        booking.booking_end
                      )
                    : "—"}
                </p>

                {booking.booking_end && (
                  <p className="mt-1 text-xs text-[#6b7280]">
                    Ends{" "}
                    {formatBookingTime(
                      booking.booking_end
                    )}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {availability && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>
                Availability slot
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                    Day
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-black">
                    {DAYS_OF_WEEK_BY_NUMBER[
                      availability.day_of_week
                    ] ??
                      availability.day_of_week ??
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                    Start time
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-black">
                    {availability.start_time ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                    End time
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-black">
                    {availability.end_time ||
                      "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {booking.intro_message && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>
                Introduction message
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-4 py-4">
                <div className="flex gap-3">
                  <MessageSquare
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#8a8e95]"
                  />

                  <p className="whitespace-pre-wrap text-sm leading-7 text-[#33373d]">
                    {booking.intro_message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(booking.meeting_link ||
          isCompleted) && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>
                Session
              </CardTitle>
            </CardHeader>

            <CardContent>
              {booking.meeting_link ? (
                <a
                  href={booking.meeting_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    type="button"
                    className="gap-2"
                  >
                    <Video
                      aria-hidden="true"
                      className="h-4 w-4"
                    />

                    Join lesson
                  </Button>
                </a>
              ) : (
                <p className="text-sm text-[#626770]">
                  No meeting link is currently available.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {status === "REJECTED" &&
          booking.rejection_reason && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>
                  Rejection reason
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-7 text-[#33373d]">
                  {booking.rejection_reason}
                </p>
              </CardContent>
            </Card>
          )}

        {status === "CANCELLED" && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>
                Cancellation
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                    Cancelled by
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-black">
                    {booking.cancelled_by ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                    Cancelled at
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-black">
                    {booking.cancelled_at
                      ? formatBookingDateTime(
                          booking.cancelled_at
                        )
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <StudentReviewModal
        isOpen={reviewModalOpen}
        booking={booking}
        onClose={() =>
          setReviewModalOpen(false)
        }
      />
    </>
  );
};

export default StudentBookingDetailsPage;