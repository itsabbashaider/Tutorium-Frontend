"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  EmptyState,
  ErrorState,
  Loading,
  Pagination,
} from "@/components/common";

import { useMyReviews } from "@/hooks";

import {
  formatBookingDate,
  formatBookingDateTime,
  formatBookingTime,
  formatRating
} from "@/utils";

const PAGE_SIZE = 10;

const StudentReviewsPage = () => {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useMyReviews({
    page,
    limit: PAGE_SIZE,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load reviews"
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load your reviews."
        }
      />
    );
  }

  const reviews = Array.isArray(data?.reviews)
    ? data.reviews
    : [];

  const pagination = data?.pagination ?? {};

  const currentPage =
    pagination.currentPage ?? page;

  const totalPages =
    pagination.totalPages ?? 1;

  const totalItems =
    pagination.totalItems ?? reviews.length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
            Reviews
          </h1>
        </div>

        <p className="text-sm text-[#626770]">
          <span className="font-medium text-black">
            {totalItems}
          </span>{" "}
          {totalItems === 1 ? "review" : "reviews"}
        </p>
      </section>

      {/* Empty state */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState
              title="No reviews yet"
              message="Reviews you leave after completed lessons will appear here."
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Review list */}
          <section className="space-y-4">
            {reviews.map((review) => {
              const booking = review.booking ?? {};
              const tutor = booking.tutor ?? {};
              const subject = booking.subject ?? {};

              return (
                <article
                  key={review.review_id}
                  className="rounded-xl border border-[#e5e7eb] bg-white p-5 transition-colors hover:border-[#d4d8de] sm:p-6"
                >
                  {/* Review header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ">
                    <div>
                      <p className="text-xs text-[#8a8e95]">
                        Tutor
                      </p>

                      <p className="mt-1 text-sm font-semibold text-black">
                        {tutor.full_name || "Tutor"}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-black" />

                        <span className="text-sm font-medium text-black">
                          {formatRating(review.rating)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#8a8e95]">
                      {review.created_at
                        ? formatBookingDateTime(
                            review.created_at
                          )
                        : "—"}
                    </p>
                  </div>

                  {/* Comment */}
                  <div className="mt-5">
                    {review.comment ? (
                      <p className="max-w-4xl whitespace-pre-wrap text-sm leading-7 text-[#33373d]">
                        “{review.comment}”
                      </p>
                    ) : (
                      <p className="text-sm italic text-[#8a8e95]">
                        No comment added.
                      </p>
                    )}
                  </div>

                  {/* Lesson context */}
                  <div className="mt-5 border-t border-[#e5e7eb] pt-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {/* Subject */}
                      <div>
                        <p className="text-xs text-[#8a8e95]">
                          Subject
                        </p>

                        <p className="mt-1 text-sm font-medium text-black">
                          {subject.subject_name || "—"}
                        </p>
                      </div>

                      {/* Lesson date */}
                      <div>
                        <p className="text-xs text-[#8a8e95]">
                          Lesson date
                        </p>

                        <p className="mt-1 text-sm font-medium text-black">
                          {booking.booking_date
                            ? formatBookingDate(
                                booking.booking_date
                              )
                            : "—"}
                        </p>
                      </div>

                      {/* Lesson time */}
                      <div>
                        <p className="text-xs text-[#8a8e95]">
                          Lesson time
                        </p>

                        <p className="mt-1 text-sm font-medium text-black">
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

                      {/* Status */}
                      <div>
                        <p className="text-xs text-[#8a8e95]">
                          Status
                        </p>

                        <span className="mt-1 inline-flex rounded-full bg-[#f4f5f7] px-2.5 py-1 text-xs font-medium text-[#626770]">
                          {booking.status || "—"}
                        </span>
                      </div>
                    </div>

                    {/* Booking action */}
                    {booking.booking_id && (
                      <div className="mt-5 flex justify-end">
                        <Link
                          href={`/student/bookings/${booking.booking_id}`}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="transition-colors hover:border-black hover:bg-black hover:text-white"
                          >
                            View booking
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default StudentReviewsPage;