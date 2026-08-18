"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  Loading,
  Textarea,
} from "@/components/common";

import {
  useAcceptBooking,
  useBooking,
  useCompleteBooking,
  useRejectBooking,
} from "@/hooks";

import {
  formatBookingCurrency,
  formatBookingDate,
  formatBookingDateTime,
  formatBookingTime,
  formatTimeValue,
  getDayName,
} from "@/utils";

const TutorBookingDetailsPage = () => {
  const params = useParams();

  const bookingId = params?.booking_id;

  const [showRejectForm, setShowRejectForm] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useBooking(bookingId);

  const acceptMutation = useAcceptBooking();
  const rejectMutation = useRejectBooking();
  const completeMutation = useCompleteBooking();

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
          "Something went wrong while loading this booking."
        }
      />
    );
  }

  const booking = data ?? null;

  if (!booking) {
    return (
      <EmptyState
        title="Booking not found"
        message="The requested booking could not be found."
      />
    );
  }

  const studentUser =
    booking.student?.user ?? null;

  const subject =
    booking.subject ?? null;

  const availability =
    booking.availability ?? null;

  const status = booking.status;

  const isPending =
    status === "PENDING";

  const isAccepted =
    status === "ACCEPTED";

  const isCompleted =
    status === "COMPLETED";

  const isClosed =
    status === "REJECTED" ||
    status === "CANCELLED";

  const isMutationPending =
    acceptMutation.isPending ||
    rejectMutation.isPending ||
    completeMutation.isPending;

  const acceptError =
    acceptMutation.error?.response?.data?.message ||
    acceptMutation.error?.message ||
    null;

  const rejectError =
    rejectMutation.error?.response?.data?.message ||
    rejectMutation.error?.message ||
    null;

  const completeError =
    completeMutation.error?.response?.data?.message ||
    completeMutation.error?.message ||
    null;

  const handleAccept = async () => {
    try {
      await acceptMutation.mutateAsync(
        booking.booking_id
      );
    } catch {
      // Mutation error is rendered below.
    }
  };

  const handleReject = async () => {
    const reason =
      rejectionReason.trim();

    if (!reason) {
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        booking_id:
          booking.booking_id,
        payload: {
          rejection_reason:
            reason,
        },
      });

      setRejectionReason("");
      setShowRejectForm(false);
    } catch {
      // Mutation error is rendered below.
    }
  };

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync(
        booking.booking_id
      );
    } catch {
      // Mutation error is rendered below.
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <section>
        <Link href="/tutor/bookings">
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

            <span>Back to bookings</span>
          </Button>
        </Link>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
              Booking details
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#626770]">
              Review the lesson information and manage the current booking.
            </p>
          </div>

          <span className="w-fit rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-3 py-1.5 text-xs font-medium text-[#5c5f60]">
            {status || "Unknown"}
          </span>
        </div>
      </section>

      {/* Main summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Student
              </p>

              <p className="mt-2 text-sm font-semibold text-black">
                {studentUser?.full_name ||
                  "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Subject
              </p>

              <p className="mt-2 text-sm font-semibold text-black">
                {subject?.subject_name ||
                  "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Lesson date
              </p>

              <p className="mt-2 text-sm font-semibold text-black">
                {formatBookingDate(
                  booking.booking_date
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Lesson rate
              </p>

              <p className="mt-2 text-sm font-semibold text-black">
                {formatBookingCurrency(
                  booking.booked_hourly_rate
                )}
                <span className="ml-1 text-xs font-normal text-[#6b7280]">
                  / hr
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student + lesson */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Student */}
        <Card>
          <CardHeader>
            <CardTitle>
              Student
            </CardTitle>

            <CardDescription>
              Student information associated with
              this booking.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-sm font-semibold text-[#3949ab]">
                {studentUser?.full_name
                  ?.charAt(0)
                  ?.toUpperCase() || "S"}
              </div>

              <div>
                <p className="text-base font-semibold text-black">
                  {studentUser?.full_name ||
                    "Student"}
                </p>

                <p className="mt-1 text-sm text-[#626770]">
                  {studentUser?.city ||
                    "City unavailable"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>
              Schedule
            </CardTitle>

            <CardDescription>
              Scheduled lesson time and recurring
              availability.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                  Start
                </p>

                <p className="mt-2 text-sm font-medium text-black">
                  {formatBookingDateTime(
                    booking.booking_start
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                  End
                </p>

                <p className="mt-2 text-sm font-medium text-black">
                  {booking.booking_end
                    ? formatBookingDateTime(
                        booking.booking_end
                      )
                    : "—"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                  Availability
                </p>

                <p className="mt-2 text-sm font-medium text-black">
                  {availability
                    ? `${getDayName(
                        availability.day_of_week
                      )} · ${formatTimeValue(
                        availability.start_time
                      )} – ${formatTimeValue(
                        availability.end_time
                      )}`
                    : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Student message */}
      {booking.intro_message && (
        <Card>
          <CardHeader>
            <CardTitle>
              Student message
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-4 py-3">
              <p className="whitespace-pre-wrap text-sm leading-6 text-[#33373d]">
                {booking.intro_message}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meeting */}
      {booking.meeting_link && (
        <Card>
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-black">
                Meeting
              </p>

              <p className="mt-1 text-sm text-[#626770]">
                Join the scheduled lesson.
              </p>
            </div>

            <a
              href={booking.meeting_link}
              target="_blank"
              rel="noreferrer"
            >
              <Button>
                Open meeting
              </Button>
            </a>
          </CardContent>
        </Card>
      )}

      {/* Rejection reason */}
      {booking.rejection_reason && (
        <Card>
          <CardHeader>
            <CardTitle>
              Rejection reason
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-4 py-3">
              <p className="whitespace-pre-wrap text-sm leading-6 text-[#33373d]">
                {booking.rejection_reason}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancellation */}
      {booking.cancelled_at && (
        <Card>
          <CardHeader>
            <CardTitle>
              Cancellation
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Cancelled by
              </p>

              <p className="mt-2 text-sm font-medium text-black">
                {booking.cancelled_by ||
                  "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                Cancelled at
              </p>

              <p className="mt-2 text-sm font-medium text-black">
                {formatBookingDateTime(
                  booking.cancelled_at
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>
            Actions
          </CardTitle>

          <CardDescription>
            Available actions for this booking.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isPending &&
            !showRejectForm && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={handleAccept}
                  disabled={isMutationPending}
                >
                  {acceptMutation.isPending
                    ? "Accepting..."
                    : "Accept booking"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setShowRejectForm(true)
                  }
                  disabled={isMutationPending}
                >
                  Reject booking
                </Button>
              </div>
            )}

          {isPending &&
            showRejectForm && (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-black">
                    Reject booking
                  </p>

                  <p className="mt-1 text-sm text-[#626770]">
                    Provide a reason for the student.
                  </p>
                </div>

                <Textarea
                  id="rejection_reason"
                  label="Reason"
                  value={rejectionReason}
                  onChange={(event) =>
                    setRejectionReason(
                      event.target.value
                    )
                  }
                  rows={4}
                  maxLength={1000}
                  placeholder="Explain why you cannot accept this booking."
                  error={rejectError}
                />

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason("");
                      rejectMutation.reset();
                    }}
                    disabled={
                      rejectMutation.isPending
                    }
                  >
                    Keep booking
                  </Button>

                  <Button
                    type="button"
                    onClick={handleReject}
                    disabled={
                      rejectMutation.isPending ||
                      !rejectionReason.trim()
                    }
                  >
                    {rejectMutation.isPending
                      ? "Rejecting..."
                      : "Confirm rejection"}
                  </Button>
                </div>
              </div>
            )}

          {isAccepted && (
            <div className="space-y-4">
              {completeError && (
                <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
                  <p className="text-sm text-[#93000a]">
                    {completeError}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-black">
                    Lesson accepted
                  </p>

                  <p className="mt-1 text-sm text-[#626770]">
                    Mark the booking completed after the
                    lesson has finished.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleComplete}
                  disabled={isMutationPending}
                >
                  {completeMutation.isPending
                    ? "Completing..."
                    : "Mark completed"}
                </Button>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">
                  Lesson completed
                </p>

                <p className="mt-1 text-sm text-[#626770]">
                  This booking is complete.
                </p>
              </div>
            </div>
          )}

          {isClosed && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">
                  Booking closed
                </p>

                <p className="mt-1 text-sm text-[#626770]">
                  No further actions are available.
                </p>
              </div>
            </div>
          )}

          {acceptError && isPending && (
            <div className="mt-4 rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
              <p className="text-sm text-[#93000a]">
                {acceptError}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorBookingDetailsPage;