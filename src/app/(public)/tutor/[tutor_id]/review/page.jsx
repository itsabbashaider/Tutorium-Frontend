"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
  useTutor,
  useTutorReviews,
} from "@/hooks";

import {
  formatBookingDate,
} from "@/utils";

const PAGE_SIZE = 10;

const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
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
      limit: PAGE_SIZE,
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
        message="This tutor profile is no longer available."
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

  const reviews = Array.isArray(
    data?.reviews
  )
    ? data.reviews
    : [];

  const pagination =
    data?.pagination ?? {};

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

  return (
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

            <span>Back to profile</span>
          </Button>
        </Link>
      </div>

      {/* Header */}
      <section className="mb-6 flex flex-col gap-4 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
            Reviews
          </h1>
        </div>
      </section>

      {/* Rating summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            Overall rating
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f5f5f5]">
              <span className="text-sm font-semibold text-black">
                {averageRating}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-black">
                Student feedback
              </p>

              <p className="mt-1 text-sm text-[#626770]">
                Reviews from completed lessons.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
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
            const booking =
              review.booking ?? {};

            const student =
              booking.student ?? {};

            const subject =
              booking.subject ?? {};

            const studentName =
              student.full_name ||
              "Student";

            const studentInitial =
              studentName
                .charAt(0)
                .toUpperCase();

            return (
              <Card key={review.review_id}>
                <CardContent className="p-5 sm:p-6">
                  {/* Review header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-sm font-semibold text-[#3949ab]">
                        {studentInitial}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-black">
                          {studentName}
                        </p>

                        <p className="mt-1 text-xs text-[#8a8e95]">
                          {formatDateTime(
                            review.created_at
                          )}
                        </p>
                      </div>
                    </div>

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
                  </div>

                  {/* Comment */}
                  <div className="mt-5">
                    {review.comment ? (
                      <p className="whitespace-pre-wrap text-sm leading-7 text-[#33373d]">
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
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                          Subject
                        </p>

                        <p className="mt-1 text-sm font-medium text-black">
                          {subject.subject_name ||
                            "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      {/* Pagination */}
      {reviews.length > 0 &&
        totalPages > 1 && (
          <div className="mt-6 flex flex-col gap-4 border-t border-[#e5e7eb] pt-5 sm:flex-row sm:items-center sm:justify-between">
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