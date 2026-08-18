"use client";

import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  EmptyState,
  ErrorState,
  Loading,
} from "@/components/common";

import { useMyReviews } from "@/hooks";

import {
  formatBookingDate,
  formatBookingDateTime,
  formatBookingTime,
} from "@/utils";

const PAGE_SIZE = 10;

const formatRating = (rating) => {
  const value = Number(rating);

  if (Number.isNaN(value)) {
    return "—";
  }

  return value.toFixed(1);
};

const TutorReviewsPage = () => {
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
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
            Reviews
          </h1>

          <p className="mt-1 text-sm text-[#626770]">
            Feedback from students after completed lessons.
          </p>
        </div>

        <p className="text-sm text-[#626770]">
          <span className="font-medium text-black">
            {totalItems}
          </span>{" "}
          {totalItems === 1
            ? "review"
            : "reviews"}
        </p>
      </section>

      {/* Empty state */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState
              title="No reviews yet"
              message="Student feedback will appear here after completed lessons are reviewed."
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Review list */}
          <section className="space-y-4">
            {reviews.map((review) => {
              const booking = review.booking ?? {};
              const student = booking.student ?? {};
              const subject = booking.subject ?? {};

              return (
                <article
                  key={review.review_id}
                  className="rounded-xl border border-[#e5e7eb] bg-white p-5 transition-colors hover:border-[#d4d8de] sm:p-6"
                >
                  {/* Review */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-black">
                          {formatRating(
                            review.rating
                          )}
                        </span>

                        <span className="text-sm text-[#8a8e95]">
                          / 5
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-medium text-black">
                        {student.full_name ||
                          "Student"}
                      </p>
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
                        No written comment was provided.
                      </p>
                    )}
                  </div>

                  {/* Lesson context */}
                  <div className="mt-5 border-t border-[#e5e7eb] pt-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-[#8a8e95]">
                          Subject
                        </p>

                        <p className="mt-1 text-sm font-medium text-black">
                          {subject.subject_name ||
                            "—"}
                        </p>
                      </div>

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
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

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
                  disabled={currentPage <= 1}
                  onClick={() =>
                    setPage((value) =>
                      Math.max(
                        1,
                        value - 1
                      )
                    )
                  }
                  className="transition-colors hover:border-black hover:bg-black hover:text-white"
                >
                  Previous
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    currentPage >=
                    totalPages
                  }
                  onClick={() =>
                    setPage((value) =>
                      Math.min(
                        totalPages,
                        value + 1
                      )
                    )
                  }
                  className="transition-colors hover:border-black hover:bg-black hover:text-white"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TutorReviewsPage;