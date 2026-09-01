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

          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map(
              (value) => {
                const isSelected =
                  rating >= value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setRating(
                        value
                      )
                    }
                    disabled={
                      isPending
                    }
                    aria-label={`Give ${value} out of 5`}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-[#e5e7eb] bg-white text-[#626770] hover:border-black hover:text-black"
                    }`}
                  >
                    {value}
                  </button>
                );
              }
            )}
          </div>

          {rating > 0 && (
            <p className="mt-2 text-xs text-[#626770]">
              {rating} out of 5
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