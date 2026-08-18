"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  EmptyState,
  ErrorState,
  Loading,
} from "@/components/common";

import {
  useAcceptBooking,
  useCompleteBooking,
  useTutorBookings,
} from "@/hooks";

import { formatBookingDate } from "@/utils";

const PAGE_SIZE = 10;

const TutorBookingsPage = () => {
  const [page, setPage] = useState(1);

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

  const acceptMutation = useAcceptBooking();
  const completeMutation = useCompleteBooking();

  const bookings = Array.isArray(data?.bookings)
    ? data.bookings
    : [];

  const pagination = data?.pagination ?? {
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
    completeMutation.isPending;

  const actionError =
    acceptMutation.error?.response?.data?.message ||
    acceptMutation.error?.message ||
    completeMutation.error?.response?.data?.message ||
    completeMutation.error?.message ||
    null;

  const handleAccept = async (bookingId) => {
    try {
      await acceptMutation.mutateAsync(bookingId);
    } catch {
      // Mutation error is displayed below.
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await completeMutation.mutateAsync(bookingId);
    } catch {
      // Mutation error is displayed below.
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
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
            Bookings
          </h1>

          <p className="mt-1 text-sm text-[#626770]">
            Manage lesson requests and sessions.
          </p>
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

      {/* Action error */}
      {actionError && (
        <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
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
              booking.student?.user ?? null;

            const subject =
              booking.subject ?? null;

            const status =
              booking.status || "UNKNOWN";

            const isPending =
              status === "PENDING";

            const isAccepted =
              status === "ACCEPTED";

            return (
              <article
                key={booking.booking_id}
                className="rounded-xl border border-[#e5e7eb] bg-white p-5 transition-colors hover:border-[#d4d8de]"
              >
                {/* Identity */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-sm font-semibold text-[#3949ab]">
                    {student?.full_name
                      ?.charAt(0)
                      ?.toUpperCase() || "S"}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-base font-semibold text-black">
                        {student?.full_name || "Student"}
                      </h2>

                      <span className="text-[#c4c7cc]">
                        •
                      </span>

                      <p className="truncate text-sm text-[#626770]">
                        {subject?.subject_name ||
                          "Subject unavailable"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions row */}
                <div className="mt-5 flex flex-col gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-[#8a8e95]">
                        Date
                      </span>

                      <span className="ml-2 font-medium text-black">
                        {booking.booking_date
                          ? formatBookingDate(
                              booking.booking_date
                            )
                          : "—"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[#8a8e95]">
                        Status
                      </span>

                      <span className="font-medium text-black">
                        {status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {isAccepted && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          handleComplete(
                            booking.booking_id
                          )
                        }
                        disabled={isMutating}
                      >
                        {completeMutation.isPending
                          ? "Completing..."
                          : "Complete"}
                      </Button>
                    )}

                    {isPending && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          handleAccept(
                            booking.booking_id
                          )
                        }
                        disabled={isMutating}
                      >
                        {acceptMutation.isPending
                          ? "Accepting..."
                          : "Accept"}
                      </Button>
                    )}

                    <Link
                      href={`/tutor/bookings/${booking.booking_id}`}
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
              </article>
            );
          })}
        </section>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-4 border-t border-[#e5e7eb] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#626770]">
            Page{" "}
            <span className="font-medium text-black">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-medium text-black">
              {totalPages}
            </span>
          </p>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousPage}
              disabled={
                isFetching ||
                !pagination.hasPreviousPage
              }
              className="transition-colors hover:border-black hover:bg-black hover:text-white"
            >
              Previous
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={goToNextPage}
              disabled={
                isFetching ||
                !pagination.hasNextPage
              }
              className="transition-colors hover:border-black hover:bg-black hover:text-white"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorBookingsPage;