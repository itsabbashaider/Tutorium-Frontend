"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
  useTutor,
  useTutorReviews,
} from "@/hooks";

const formatDateTime = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatTime = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatRating = (rating) => {
  const value = Number(rating);

  return Number.isNaN(value)
    ? "—"
    : value.toFixed(1);
};

const TutorPublicReviewsPage = () => {
  const params = useParams();
  const tutorId = params?.tutor_id;

  const [page, setPage] = useState(1);

  const {
    data: tutor,
    isLoading: isTutorLoading,
    isError: isTutorError,
    error: tutorError,
  } = useTutor(tutorId);

  const {
    data,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
    error: reviewsError,
  } = useTutorReviews(
    tutor?.tutor_profile_id,
    {
      page,
      limit: 10,
    }
  );

  if (
    isTutorLoading ||
    isReviewsLoading
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

  if (!tutor) {
    return (
      <EmptyState
        title="Tutor not found"
        message="This tutor is no longer available."
      />
    );
  }

  if (isReviewsError) {
    return (
      <ErrorState
        title="Unable to load reviews"
        message={
          reviewsError?.response?.data?.message ||
          reviewsError?.message ||
          "Unable to load this tutor's reviews."
        }
      />
    );
  }

  const reviews = Array.isArray(data?.reviews)
    ? data.reviews
    : [];

  const pagination = data?.pagination ?? {};

  const currentPage =
    pagination.currentPage ??
    pagination.page ??
    page;

  const totalPages =
    pagination.totalPages ??
    pagination.total_pages ??
    1;

  const averageRating =
    tutor.avg_rating !== undefined &&
    tutor.avg_rating !== null
      ? formatRating(tutor.avg_rating)
      : "—";

  const userInitial =
    tutor.full_name
      ?.charAt(0)
      ?.toUpperCase() || "T";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-5 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-lg font-semibold text-[#3949ab]">
            {userInitial}
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black">
              Reviews
            </h1>

            <p className="mt-1 text-sm text-[#626770]">
              {tutor.full_name || "Tutor"}
            </p>
          </div>
        </div>

        <Link href={`/tutor/${tutorId}`}>
          <Button
            type="button"
            variant="outline"
            className="w-full transition-colors hover:border-black hover:bg-black hover:text-white sm:w-auto"
          >
            Back to profile
          </Button>
        </Link>
      </section>

      {/* Rating summary */}
      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="shrink-0">
              <p className="text-3xl font-semibold tracking-tight text-black">
                {averageRating}
              </p>

              <p className="mt-1 text-sm text-[#626770]">
                out of 5
              </p>
            </div>

            <div className="hidden h-10 w-px bg-[#e5e7eb] sm:block" />

            <div>
              <p className="text-sm font-medium text-black">
                Student feedback
              </p>

              <p className="mt-1 text-sm leading-6 text-[#626770]">
                Reviews shared after completed lessons.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review list */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState
              title="No reviews yet"
              message="This tutor does not have any public reviews yet."
            />
          </CardContent>
        </Card>
      ) : (
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
                {/* Review header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
                    {formatDateTime(
                      review.created_at
                    )}
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
                        {booking.booking_date ||
                          "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#8a8e95]">
                        Lesson time
                      </p>

                      <p className="mt-1 text-sm font-medium text-black">
                        {booking.booking_start
                          ? formatTime(
                              booking.booking_start
                            )
                          : "—"}{" "}
                        –{" "}
                        {booking.booking_end
                          ? formatTime(
                              booking.booking_end
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Pagination */}
      {reviews.length > 0 &&
        totalPages > 1 && (
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
                  currentPage >= totalPages
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
    </div>
  );
};

export default TutorPublicReviewsPage;