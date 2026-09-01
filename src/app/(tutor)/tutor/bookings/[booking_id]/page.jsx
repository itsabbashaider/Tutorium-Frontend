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
  formatTimeValue,
  getInitial
} from "@/utils";

import {
  DAYS_OF_WEEK_BY_NUMBER,
  BOOKING_STATUS,
  BOOKING_STATUS_VARIANTS,
} from "@/constants";


const TutorBookingDetailsPage = () => {
  const params = useParams();

  const bookingId = params?.booking_id;

  const [showRejectForm, setShowRejectForm] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useBooking(bookingId);

  const acceptMutation =
    useAcceptBooking();

  const rejectMutation =
    useRejectBooking();

  const completeMutation =
    useCompleteBooking();

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
      <EmptyState
        title="Booking not found"
        message="The requested booking could not be found."
      />
    );
  }

  const student =
    booking.student?.user ?? null;

  const subject =
    booking.subject ?? null;

  const availability =
    booking.availability ?? null;

  const status =
    booking.status || "UNKNOWN";

  const isCompleted =
    status === "COMPLETED";

  const isRejected =
    status === "REJECTED";

  const isCancelled =
    status === "CANCELLED";

  const availableActions =
  booking.available_actions ?? {};

  const canAccept =
    availableActions.can_accept === true;

  const canReject =
    availableActions.can_reject === true;

  const canComplete =
    availableActions.can_complete === true;

  const studentName =
    student?.full_name || "Student";

  const studentInitial =
    getInitial(studentName, "S");

  const acceptError =
    acceptMutation.error?.response
      ?.data?.message ||
    acceptMutation.error?.message ||
    null;

  const rejectError =
    rejectMutation.error?.response
      ?.data?.message ||
    rejectMutation.error?.message ||
    null;

  const completeError =
    completeMutation.error?.response
      ?.data?.message ||
    completeMutation.error?.message ||
    null;

  const isMutationPending =
    acceptMutation.isPending ||
    rejectMutation.isPending ||
    completeMutation.isPending;

  const handleAccept = async () => {
    try {
      await acceptMutation.mutateAsync(
        booking.booking_id
      );
    } catch {
      return;
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
      return;
    }
  };

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync(
        booking.booking_id
      );
    } catch {
      return;
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
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

          {canAccept &&
            !showRejectForm && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAccept}
                  disabled={
                    isMutationPending
                  }
                >
                  {acceptMutation.isPending
                    ? "Accepting..."
                    : "Accept booking"}
                </Button>

                {canReject && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setShowRejectForm(true)
                    }
                    disabled={
                      isMutationPending
                    }
                  >
                    Reject booking
                  </Button>
                )}
              </>
            )}

          {canComplete && (
            <Button
              type="button"
              variant="outline"
              onClick={handleComplete}
              disabled={
                isMutationPending
              }
            >
              {completeMutation.isPending
                ? "Completing..."
                : "Mark completed"}
            </Button>
          )}
        </div>
      </section>

      {(acceptError ||
        completeError) && (
        <div className="mb-6 rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
          <p className="text-sm text-[#93000a]">
            {acceptError ||
              completeError}
          </p>
        </div>
      )}

      {canReject &&
        showRejectForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                Reject booking
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-5">
                <p className="text-sm text-[#626770]">
                  Provide a reason for the
                  student.
                </p>

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
                      setShowRejectForm(
                        false
                      );
                      setRejectionReason(
                        ""
                      );
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
                    variant="outline"
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
            </CardContent>
          </Card>
        )}

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Student
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-sm font-semibold text-[#3949ab]">
                {studentInitial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black">
                  {studentName}
                </p>

                {student?.city && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#626770]">
                    <MapPin
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                    />

                    <span>
                      {student.city}
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
                  {formatTimeValue(
                    availability.start_time
                  ) || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                  End time
                </p>

                <p className="mt-1.5 text-sm font-medium text-black">
                  {formatTimeValue(
                    availability.end_time
                  ) || "—"}
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

      {booking.meeting_link && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>
              Session
            </CardTitle>
          </CardHeader>

          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {isRejected &&
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

      {isCancelled && (
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

      {isCompleted && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>
              Session status
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-[#626770]">
              This lesson has been completed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TutorBookingDetailsPage;