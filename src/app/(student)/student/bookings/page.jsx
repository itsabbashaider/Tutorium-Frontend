"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
  ErrorState,
  Loading,
  Pagination,
} from "@/components/common";

import StudentReviewModal from "@/components/student/review-modal.component";

import {
  useCancelBooking,
  useStudentBookings,
} from "@/hooks";

import {
  formatBookingDate,
  formatBookingDateTime,
  formatBookingTime,
  getInitial,
} from "@/utils";

import {
  BOOKING_STATUS,
  BOOKING_STATUS_VARIANTS,
} from "@/constants"

const PAGE_SIZE = 10;

const StudentBookingsPage = () => {

  
  const [reviewBooking, setReviewBooking] =
    useState(null);

  const [page, setPage] = useState(1);
  
  const {
    data,
    isLoading,
    isError,
    error,
  } = useStudentBookings({
    page,
    limit: PAGE_SIZE,
  });
  
  const cancelMutation =
    useCancelBooking();

  const bookings = Array.isArray(
    data?.bookings
  )
    ? data.bookings
    : [];

  const pagination =
    data?.pagination ?? {};

  const currentPage =
    pagination.currentPage ?? page;

  const totalPages =
    pagination.totalPages ?? 1;

  const totalItems =
    pagination.totalItems ?? 0;

  const actionError =
    cancelMutation.error?.response?.data
      ?.message ||
    cancelMutation.error?.message ||
    null;

  const handleCancel = async (
    bookingId
  ) => {
    try {
      await cancelMutation.mutateAsync(
        bookingId
      );
    } catch {
      return;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load bookings"
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load your bookings."
        }
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <section className="mb-6 flex flex-col gap-4 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
            Bookings
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-[#626770]">
            <span className="font-medium text-black">
              {totalItems}
            </span>{" "}
            {totalItems === 1
              ? "booking"
              : "bookings"}
          </p>

          <Link href="/student/bookings/create-bookings">
            <Button
              type="button"
              className="h-11"
            >
              Create booking
            </Button>
          </Link>
        </div>
      </section>

      {/* Action error */}
      {actionError && (
        <div className="mb-6 rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
          <p className="text-sm text-[#93000a]">
            {actionError}
          </p>
        </div>
      )}

      {/* Bookings */}
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState
              title={
                totalItems === 0
                  ? "No bookings yet"
                  : "No bookings on this page"
              }
              message={
                totalItems === 0
                  ? "Your tutoring bookings will appear here."
                  : "Try another page."
              }
            />
          </CardContent>
        </Card>
      ) : (
        <section className="space-y-4">
          {bookings.map((booking) => {
            const tutor =
              booking.tutor?.user ?? null;

            const subject =
              booking.subject ?? null;

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

            return (
              <Card
                key={booking.booking_id}
                className="overflow-hidden"
              >
                <CardContent className="p-5 sm:p-6">
                  {/* Booking header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-sm font-semibold text-[#3949ab]">
                        {getInitial(tutorName, "T")}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <h2 className="truncate text-base font-semibold text-black">
                            {tutorName}
                          </h2>

                          <span
                            aria-hidden="true"
                            className="text-[#c4c7cc]"
                          >
                            •
                          </span>

                          <p className="truncate text-sm text-[#626770]">
                            {subject?.subject_name ||
                              "Subject unavailable"}
                          </p>
                        </div>

                        {tutor?.city && (
                          <p className="mt-1 text-xs text-[#8a8e95]">
                            {tutor.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <Badge
                      variant={BOOKING_STATUS_VARIANTS[status]}
                    >
                      {BOOKING_STATUS[status]}
                    </Badge>
                  </div>

                  {/* Lesson information */}
                  <div className="mt-5 grid gap-4 border-t border-[#e5e7eb] pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                        Lesson date
                      </p>

                      <p className="mt-1.5 text-sm font-medium text-black">
                        {booking.booking_date
                          ? formatBookingDate(
                              booking.booking_date
                            )
                          : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                        Lesson time
                      </p>

                      <p className="mt-1.5 text-sm font-medium text-black">
                        {booking.booking_start
                          ? formatBookingDateTime(
                              booking.booking_start
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

                  {/* Actions */}
                  <div className="mt-5 flex flex-col gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      {canCancel && (
                        <p className="text-xs text-[#8a8e95]">
                          Waiting for tutor approval.
                        </p>
                      )}

                      {status === "ACCEPTED" && (
                        <p className="text-xs text-[#8a8e95]">
                          Your booking has been accepted.
                        </p>
                      )}

                      {isCompleted && (
                        <p className="text-xs text-[#8a8e95]">
                          This lesson has been completed.
                        </p>
                      )}

                      {status === "REJECTED" && (
                        <p className="text-xs text-[#8a8e95]">
                          This booking was rejected.
                        </p>
                      )}

                      {status === "CANCELLED" && (
                        <p className="text-xs text-[#8a8e95]">
                          This booking was cancelled.
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      {canCancel && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleCancel(
                              booking.booking_id
                            )
                          }
                          disabled={
                            cancelMutation.isPending
                          }
                        >
                          {cancelMutation.isPending
                            ? "Cancelling..."
                            : "Cancel"}
                        </Button>
                      )}

                      {canReview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setReviewBooking(
                              booking
                            )
                          }
                        >
                          Give review
                        </Button>
                      )}
                      <Link
                        href={`/student/bookings/${booking.booking_id}`}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="transition-colors hover:border-black hover:bg-black hover:text-white"
                        >
                          View details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <StudentReviewModal
        isOpen={Boolean(reviewBooking)}
        booking={reviewBooking}
        onClose={() =>
          setReviewBooking(null)
        }
      />
    </div>
  );
};

export default StudentBookingsPage;