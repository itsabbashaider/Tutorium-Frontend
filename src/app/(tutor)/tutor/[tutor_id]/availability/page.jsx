"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

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
  useTutorPublicAvailability,
} from "@/hooks";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const getDayName = (day) => {
  return (
    DAYS.find(
      (item) => item.value === Number(day)
    )?.label || "Unknown day"
  );
};

const formatTime = (time) => {
  if (!time) return "—";

  const normalized = String(time).slice(0, 5);
  const [hours, minutes] = normalized.split(":");

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

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const TutorPublicAvailabilityPage = () => {
  const params = useParams();

  const tutorId = params?.tutor_id;

  const {
    data: tutor,
    isLoading: isTutorLoading,
    isError: isTutorError,
    error: tutorError,
  } = useTutor(tutorId);

  const {
    data: availability = [],
    isLoading: isAvailabilityLoading,
    isError: isAvailabilityError,
    error: availabilityError,
  } = useTutorPublicAvailability(tutorId);

  if (
    isTutorLoading ||
    isAvailabilityLoading
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

  if (isAvailabilityError) {
    return (
      <ErrorState
        title="Unable to load availability"
        message={
          availabilityError?.response?.data?.message ||
          availabilityError?.message ||
          "Unable to load this tutor's availability."
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

  const slots = Array.isArray(availability)
    ? availability
    : [];

  const groupedAvailability = DAYS.map((day) => ({
    ...day,
    slots: slots
      .filter(
        (slot) =>
          Number(slot.day_of_week) ===
          day.value
      )
      .sort((a, b) =>
        String(a.start_time || "").localeCompare(
          String(b.start_time || "")
        )
      ),
  })).filter(
    (day) => day.slots.length > 0
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-5 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-lg font-semibold text-[#3949ab]">
            {tutor.full_name
              ?.charAt(0)
              ?.toUpperCase() || "T"}
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black">
              Availability
            </h1>

            <p className="mt-1 text-sm text-[#626770]">
              {tutor.full_name || "Tutor"}
              {tutor.city
                ? ` · ${tutor.city}`
                : ""}
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

      {/* Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>
            Weekly schedule
          </CardTitle>
        </CardHeader>

        <CardContent>
          {groupedAvailability.length === 0 ? (
            <EmptyState
              title="No availability listed"
              message="This tutor currently has no public availability."
            />
          ) : (
            <div className="divide-y divide-[#e5e7eb]">
              {groupedAvailability.map((day) => (
                <div
                  key={day.value}
                  className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-start"
                >
                  <div className="w-32 shrink-0">
                    <p className="text-sm font-semibold text-black">
                      {day.label}
                    </p>
                  </div>

                  <div className="flex flex-1 flex-wrap gap-2">
                    {day.slots.map((slot) => (
                      <div
                        key={
                          slot.availability_slot_id ||
                          `${day.value}-${slot.start_time}-${slot.end_time}`
                        }
                        className="rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-4 py-3"
                      >
                        <p className="text-sm font-medium text-black">
                          {formatTime(
                            slot.start_time
                          )}
                        </p>

                        <p className="mt-1 text-xs text-[#626770]">
                          until{" "}
                          {formatTime(
                            slot.end_time
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CTA */}
      {slots.length > 0 && (
        <div className="flex flex-col gap-4 rounded-xl border border-[#e5e7eb] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-black">
              Ready to book a lesson?
            </p>

            <p className="mt-1 text-sm text-[#626770]">
              Choose a suitable time and request a lesson.
            </p>
          </div>

          <Link
            href={`/student/bookings/create?tutor_id=${tutorId}`}
          >
            <Button className="w-full sm:w-auto">
              Request a lesson
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TutorPublicAvailabilityPage;