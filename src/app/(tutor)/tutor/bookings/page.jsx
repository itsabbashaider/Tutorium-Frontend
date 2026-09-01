"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  UserRound,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
  ErrorState,
  Loading,
  Pagination,
  Textarea,
} from "@/components/common";

import {
  useAcceptBooking,
  useCompleteBooking,
  useRejectBooking,
  useTutorBookings,
} from "@/hooks";

import {
  formatBookingDate,
  formatBookingTime,
  getInitial,
} from "@/utils";

const PAGE_SIZE = 10;

import {
  BOOKING_STATUS,
  BOOKING_STATUS_VARIANTS,
} from "@/constants";

const TutorBookingsPage = () => {
  const [page, setPage] = useState(1);

  const [
    rejectingBookingId,
    setRejectingBookingId,
  ] = useState(null);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useTutorBookings({
    page,
    limit: PAGE_SIZE,
  });

  const acceptMutation =
    useAcceptBooking();

  const rejectMutation =
    useRejectBooking();

  const completeMutation =
    useCompleteBooking();

  const bookings = Array.isArray(
    data?.bookings
  )
    ? data.bookings
    : [];

  const pagination =
    data?.pagination ?? {
      totalItems: 0,
      totalPages: 1,
      currentPage: page,
      pageSize: PAGE_SIZE,
      hasPreviousPage: page > 1,
      hasNextPage: false,
    };

  const currentPage =
    pagination.currentPage ?? page;

  const totalPages =
    pagination.totalPages ?? 1;

  const totalItems =
    pagination.totalItems ?? 0;

  const isMutating =
    acceptMutation.isPending ||
    rejectMutation.isPending ||
    completeMutation.isPending;

  const actionError =
    acceptMutation.error?.response
      ?.data?.message ||
    acceptMutation.error?.message ||
    rejectMutation.error?.response
      ?.data?.message ||
    rejectMutation.error?.message ||
    completeMutation.error?.response
      ?.data?.message ||
    completeMutation.error?.message ||
    null;

  const handleAccept = async (
    bookingId
  ) => {
    try {
      await acceptMutation.mutateAsync(
        bookingId
      );
    } catch {
      return;
    }
  };

  const handleReject = async () => {
    const reason =
      rejectionReason.trim();

    if (
      !rejectingBookingId ||
      !reason
    ) {
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        booking_id:
          rejectingBookingId,
        payload: {
          rejection_reason:
            reason,
        },
      });

      setRejectingBookingId(null);
      setRejectionReason("");
      rejectMutation.reset();
    } catch {
      return;
    }
  };

  const handleComplete = async (
    bookingId
  ) => {
    try {
      await completeMutation.mutateAsync(
        bookingId
      );
    } catch {
      return;
    }
  };

  const goToPreviousPage = () => {
    if (
      isFetching ||
      !pagination.hasPreviousPage
    ) {
      return;
    }

    setPage((current) =>
      Math.max(1, current - 1)
    );
  };

  const goToNextPage = () => {
    if (
      isFetching ||
      !pagination.hasNextPage
    ) {
      return;
    }

    setPage((current) =>
      Math.min(
        totalPages,
        current + 1
      )
    );
  };

  const closeRejectForm = () => {
    setRejectingBookingId(null);
    setRejectionReason("");
    rejectMutation.reset();
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
      <section className="mb-8 flex flex-col gap-4 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
            Bookings
          </h1>
        </div>

        <p className="text-sm text-[#626770]">
          <span className="font-medium text-black">
            {totalItems}
          </span>{" "}
          {totalItems === 1
            ? "booking"
            : "bookings"}
        </p>
      </section>

      {actionError && (
        <div className="mb-6 rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
          <p className="text-sm text-[#93000a]">
            {actionError}
          </p>
        </div>
      )}

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              title={
                totalItems === 0
                  ? "No bookings yet"
                  : "No bookings on this page"
              }
              message={
                totalItems === 0
                  ? "Student lesson requests will appear here."
                  : "Try another page."
              }
            />
          </CardContent>
        </Card>
      ) : (
        <section className="space-y-4">
          {bookings.map((booking) => {
            const student =
              booking.student?.user ??
              null;

            const studentProfileId =
              booking.student
                ?.student_profile_id;

            const subject =
              booking.subject ?? null;

            const status =
              booking.status || "UNKNOWN";

            const availableActions =
              booking.available_actions ?? {};

            const canAccept =
              availableActions.can_accept ===
              true;

            const canReject =
              availableActions.can_reject ===
              true;

            const canComplete =
              availableActions.can_complete ===
              true;

            const studentName =
              student?.full_name ||
              "Student";

            const isRejecting =
              rejectingBookingId ===
              booking.booking_id;

            return (
              <Card
                key={booking.booking_id}
                className="overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-sm font-semibold text-[#3949ab]">
                          {getInitial(studentName, "S")}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <h2 className="truncate text-sm font-semibold text-black">
                              {studentName}
                            </h2>

                            <span className="text-[#c7c9ce]">
                              ·
                            </span>

                            <p className="truncate text-sm text-[#626770]">
                              {subject?.subject_name ||
                                "Subject unavailable"}
                            </p>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#7b8088]">
                            {booking.booking_date && (
                              <div className="flex items-center gap-1.5">
                                <CalendarDays
                                  aria-hidden="true"
                                  className="h-3.5 w-3.5"
                                />

                                <span>
                                  {formatBookingDate(
                                    booking.booking_date
                                  )}
                                </span>
                              </div>
                            )}

                            {booking.booking_start && (
                              <div className="flex items-center gap-1.5">
                                <Clock3
                                  aria-hidden="true"
                                  className="h-3.5 w-3.5"
                                />

                                <span>
                                  {formatBookingTime(
                                    booking.booking_start
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <Badge
                          variant={
                            BOOKING_STATUS_VARIANTS[status] ??
                            "secondary"
                          }
                        >
                          {BOOKING_STATUS[status] ??
                            status}
                        </Badge>

                        {studentProfileId && (
                          <Link
                            href={`/student/${studentProfileId}`}
                          >
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                            >
                              <UserRound
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                              />

                              View profile
                            </Button>
                          </Link>
                        )}

                        <Link
                          href={`/tutor/bookings/${booking.booking_id}`}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                          >
                            View details
                          </Button>
                        </Link>

                        {canAccept &&
                          !isRejecting && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleAccept(
                                  booking.booking_id
                                )
                              }
                              disabled={
                                isMutating
                              }
                            >
                              {acceptMutation.isPending
                                ? "Accepting..."
                                : "Accept"}
                            </Button>
                          )}

                        {canReject &&
                          !isRejecting && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRejectingBookingId(
                                  booking.booking_id
                                );
                                setRejectionReason(
                                  ""
                                );
                                rejectMutation.reset();
                              }}
                              disabled={
                                isMutating
                              }
                            >
                              Reject
                            </Button>
                          )}

                        {canComplete && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleComplete(
                                booking.booking_id
                              )
                            }
                            disabled={
                              isMutating
                            }
                          >
                            {completeMutation.isPending
                              ? "Completing..."
                              : "Complete"}
                          </Button>
                        )}
                      </div>
                    </div>

                    {isRejecting && (
                      <div className="mt-5 border-t border-[#e5e7eb] pt-5">
                        <div className="rounded-lg border border-[#e5e7eb] bg-[#fafbfc] p-4">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-semibold text-black">
                                Reject booking
                              </p>

                              <p className="mt-1 text-sm text-[#626770]">
                                Provide a reason for the
                                student.
                              </p>
                            </div>

                            <Textarea
                              id={`rejection_reason_${booking.booking_id}`}
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
                              error={
                                rejectMutation.error
                                  ?.response?.data
                                  ?.message ||
                                rejectMutation.error
                                  ?.message ||
                                null
                              }
                              disabled={
                                rejectMutation.isPending
                              }
                            />

                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={
                                  closeRejectForm
                                }
                                disabled={
                                  rejectMutation.isPending
                                }
                              >
                                Keep booking
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={
                                  handleReject
                                }
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
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default TutorBookingsPage;