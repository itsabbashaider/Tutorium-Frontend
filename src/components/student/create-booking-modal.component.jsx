"use client";

import { useMemo, useState } from "react";

import {
  Button,
  Modal,
  Textarea,
} from "@/components/common";

import {
  useCreateBooking,
  useTutorPublicAvailability,
} from "@/hooks";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getUpcomingDatesForDay = (
  dayOfWeek,
  count = 12
) => {
  const dates = [];
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const targetDay = Number(dayOfWeek);

  if (
    Number.isNaN(targetDay) ||
    targetDay < 0 ||
    targetDay > 6
  ) {
    return [];
  }

  const cursor = new Date(today);

  while (dates.length < count) {
    if (cursor.getDay() === targetDay) {
      const year = cursor.getFullYear();

      const month = String(
        cursor.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        cursor.getDate()
      ).padStart(2, "0");

      dates.push({
        value: `${year}-${month}-${day}`,
        label: cursor.toLocaleDateString(
          undefined,
          {
            weekday: "short",
            month: "short",
            day: "numeric",
          }
        ),
      });
    }

    cursor.setDate(
      cursor.getDate() + 1
    );
  }

  return dates;
};

const formatTime = (time) => {
  if (!time) {
    return "—";
  }

  const normalized = String(time).slice(0, 5);

  const [hours, minutes] =
    normalized.split(":");

  if (!hours || !minutes) {
    return normalized;
  }

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString(
    undefined,
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
};

const StudentCreateBookingModal = ({
  isOpen,
  tutor,
  subject,
  onClose,
  onSuccess,
}) => {
  const [selectedSubject, setSelectedSubject] =
    useState(null);

  const [selectedSlot, setSelectedSlot] =
    useState(null);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [introMessage, setIntroMessage] =
    useState("");

  const {
    data: availability = [],
    isLoading: isAvailabilityLoading,
    isError: isAvailabilityError,
    error: availabilityError,
  } = useTutorPublicAvailability(
    tutor?.tutor_profile_id,
    {
      enabled:
        isOpen &&
        Boolean(
          tutor?.tutor_profile_id
        ),
    }
  );

  const {
    mutateAsync: createBooking,
    isPending: isCreating,
    error: createError,
    reset: resetCreateMutation,
  } = useCreateBooking();

  const tutorSubjects =
    Array.isArray(tutor?.subjects)
      ? tutor.subjects
      : [];

  const currentSubject =
    subject ||
    selectedSubject ||
    null;

  const activeSlots = useMemo(() => {
    if (!Array.isArray(availability)) {
      return [];
    }

    return availability.filter(
      (slot) =>
        slot?.is_active !== false
    );
  }, [availability]);

  const availableDates = useMemo(() => {
    if (!selectedSlot) {
      return [];
    }

    return getUpcomingDatesForDay(
      selectedSlot.day_of_week
    );
  }, [selectedSlot]);

  const tutorName =
    tutor?.full_name ||
    tutor?.user?.full_name ||
    "Tutor";

  const tutorCity =
    tutor?.city ||
    tutor?.user?.city ||
    null;

  const hourlyRate =
    tutor?.hourly_rate ??
    tutor?.hourlyRate ??
    null;

  const errorMessage =
    createError?.response?.data?.message ||
    createError?.message ||
    null;

  const resetForm = () => {
    setSelectedSubject(null);
    setSelectedSlot(null);
    setSelectedDate("");
    setIntroMessage("");
    resetCreateMutation();
  };

  const handleClose = () => {
    if (isCreating) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleSubjectChange = (
    value
  ) => {
    const nextSubject =
      tutorSubjects.find(
        (item) =>
          item.subject_id === value
      );

    setSelectedSubject(
      nextSubject || null
    );
    // Removed unintended resetting of selectedSlot and selectedDate here
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !currentSubject ||
      !selectedSlot ||
      !selectedDate
    ) {
      return;
    }

    try {
      const response =
        await createBooking({
          tutor_profile_id:
            tutor.tutor_profile_id,

          availability_slot_id:
            selectedSlot.availability_slot_id,

          subject_id:
            currentSubject.subject_id,

          booking_date:
            selectedDate,

          intro_message:
            introMessage.trim(),
        });

      resetForm();

      onSuccess?.(response);

      onClose();
    } catch {
      return;
    }
  };

  if (!isOpen || !tutor) {
    return null;
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Create booking"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Tutor */}
        <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-sm font-semibold text-[#3949ab]">
              {tutorName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-black">
                {tutorName}
              </p>

              {tutorCity && (
                <p className="mt-1 text-xs text-[#8a8e95]">
                  {tutorCity}
                </p>
              )}
            </div>
          </div>

          <p className="shrink-0 text-sm font-semibold text-black">
            {hourlyRate !== null &&
            hourlyRate !== undefined
              ? `PKR ${Number(
                  hourlyRate
                ).toLocaleString()}`
              : "—"}
            <span className="ml-1 text-xs font-normal text-[#8a8e95]">
              / hr
            </span>
          </p>
        </div>

        {/* Tutor unavailable */}
        {!tutor.is_available && (
          <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
            <p className="text-sm text-[#93000a]">
              This tutor is currently unavailable.
            </p>
          </div>
        )}

        {/* Subject */}
        <div>
          <label
            htmlFor="booking-subject"
            className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]"
          >
            Subject
          </label>

          {subject ? (
            <div className="mt-2 rounded-lg border border-black bg-black px-4 py-3">
              <p className="text-sm font-medium text-white">
                {subject.subject_name}
              </p>
            </div>
          ) : (
            <select
              id="booking-subject"
              value={
                selectedSubject?.subject_id ||
                ""
              }
              onChange={(event) =>
                handleSubjectChange(
                  event.target.value
                )
              }
              disabled={isCreating}
              className="mt-2 h-11 w-full rounded-lg border border-[#dfe3e8] bg-white px-3 text-sm text-black outline-none transition-colors focus:border-black"
            >
              <option value="">
                Select a subject
              </option>

              {tutorSubjects.map(
                (item) => (
                  <option
                    key={
                      item.subject_id
                    }
                    value={
                      item.subject_id
                    }
                  >
                    {item.subject_name}
                  </option>
                )
              )}
            </select>
          )}
        </div>

        {/* Availability */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
              Availability
            </label>

            {selectedSlot && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSlot(null);
                  setSelectedDate("");
                }}
                disabled={isCreating}
                className="text-xs font-medium text-[#626770] transition-colors hover:text-black"
              >
                Change
              </button>
            )}
          </div>

          {isAvailabilityLoading ? (
            <div className="mt-2 rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-4 py-3">
              <p className="text-sm text-[#626770]">
                Loading availability...
              </p>
            </div>
          ) : isAvailabilityError ? (
            <div className="mt-2 rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
              <p className="text-sm text-[#93000a]">
                {availabilityError
                  ?.response?.data
                  ?.message ||
                  availabilityError?.message ||
                  "Unable to load availability."}
              </p>
            </div>
          ) : activeSlots.length ===
            0 ? (
            <div className="mt-2 rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-4 py-3">
              <p className="text-sm text-[#626770]">
                No active availability slots.
              </p>
            </div>
          ) : (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {activeSlots.map(
                (slot) => {
                  const selected =
                    selectedSlot?.availability_slot_id ===
                    slot.availability_slot_id;

                  return (
                    <button
                      key={
                        slot.availability_slot_id
                      }
                      type="button"
                      disabled={isCreating}
                      onClick={() => {
                        setSelectedSlot(
                          slot
                        );
                        setSelectedDate(
                          ""
                        );
                      }}
                      className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                        selected
                          ? "border-black bg-black text-white"
                          : "border-[#e5e7eb] bg-white hover:border-black"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className={`text-sm font-semibold ${
                            selected
                              ? "text-white"
                              : "text-black"
                          }`}
                        >
                          {DAY_NAMES[
                            Number(
                              slot.day_of_week
                            )
                          ] ||
                            "Unknown day"}
                        </p>

                        {selected && (
                          <span className="text-xs font-medium text-white">
                            Selected
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-1 text-xs ${
                          selected
                            ? "text-[#d9d9d9]"
                            : "text-[#626770]"
                        }`}
                      >
                        {formatTime(
                          slot.start_time
                        )}{" "}
                        –{" "}
                        {formatTime(
                          slot.end_time
                        )}
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Date */}
        {selectedSlot && (
          <div>
            <label
              htmlFor="booking-date"
              className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]"
            >
              Lesson date
            </label>

            <select
              id="booking-date"
              value={selectedDate}
              onChange={(event) =>
                setSelectedDate(
                  event.target.value
                )
              }
              disabled={isCreating}
              className="mt-2 h-11 w-full rounded-lg border border-[#dfe3e8] bg-white px-3 text-sm text-black outline-none transition-colors focus:border-black"
            >
              <option value="">
                Select a date
              </option>

              {availableDates.map(
                (date) => (
                  <option
                    key={date.value}
                    value={date.value}
                  >
                    {date.label}
                  </option>
                )
              )}
            </select>
          </div>
        )}

        {/* Message */}
        <Textarea
          id="booking-intro-message"
          label="Message to tutor"
          value={introMessage}
          onChange={(event) =>
            setIntroMessage(
              event.target.value
            )
          }
          placeholder="What would you like help with?"
          rows={4}
          maxLength={1000}
          disabled={isCreating}
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
            disabled={isCreating}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={
              isCreating ||
              !tutor.is_available ||
              isAvailabilityLoading ||
              activeSlots.length === 0 ||
              !currentSubject ||
              !selectedSlot ||
              !selectedDate
            }
          >
            {isCreating
              ? "Creating..."
              : "Create booking"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentCreateBookingModal;