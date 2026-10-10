"use client";

import { useState } from "react";

import {
  Button,
  Modal,
  Textarea,
} from "@/components/common";

import { useCreateReview } from "@/hooks";

const StudentReviewModal = ({
  isOpen,
  booking,
  onClose,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    mutateAsync,
    isPending,
    error,
    reset,
  } = useCreateReview();

  if (!booking) {
    return null;
  }

  const tutorName =
    booking.tutor?.user?.full_name ||
    "Tutor";

  const subjectName =
    booking.subject?.subject_name ||
    "Tutoring session";

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    null;

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
    reset();
  };

  const handleClose = () => {
    if (isPending) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!rating) {
      return;
    }

    try {
      await mutateAsync({
        booking_id:
          booking.booking_id,
        rating,
        comment:
          comment.trim(),
      });

      resetForm();
      onClose();
    } catch {
      return;
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Give a review"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Booking */}
        <div className="border-b border-[#e5e7eb] pb-5">
          <p className="text-sm font-semibold text-black">
            {tutorName}
          </p>

          <p className="mt-1 text-xs text-[#8a8e95]">
            {subjectName}
          </p>
        </div>

        {/* Rating */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
            Rating
          </label>

          <div className="mt-3 flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(
              (value) => {
                const isHighlighted =
                  (hoverRating || rating) >= value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setRating(value)
                    }
                    onMouseEnter={() =>
                      setHoverRating(value)
                    }
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                    disabled={isPending}
                    aria-label={`Give ${value} out of 5 stars`}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <svg
                      className={`h-8 w-8 transition-colors ${
                        isHighlighted
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300 fill-gray-100"
                      }`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.103.432-.353.782-.74.555l-4.721-2.758a.563.563 0 00-.586 0L6.982 20.54c-.387.227-.843-.123-.74-.555l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </button>
                );
              }
            )}
          </div>

          {rating > 0 && (
            <p className="mt-2 text-xs text-[#626770]">
              {rating} out of 5 stars
            </p>
          )}
        </div>

        {/* Comment */}
        <Textarea
          id="student-review-comment"
          label="Comment"
          value={comment}
          onChange={(event) =>
            setComment(
              event.target.value
            )
          }
          placeholder="Share your experience with this tutor."
          maxLength={1000}
          rows={5}
          disabled={isPending}
        />

        {/* Error */}
        {errorMessage && (
          <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
            <p className="text-sm text-[#93000a]">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-[#e5e7eb] pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={
              !rating ||
              isPending
            }
          >
            {isPending
              ? "Submitting..."
              : "Submit review"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentReviewModal;