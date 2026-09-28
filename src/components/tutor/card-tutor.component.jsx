"use client";

import Link from "next/link";
import { Monitor, MapPin, Globe } from "lucide-react";
import { Button, UserAvatar } from "../common";

const getTeachingMode = (mode) => {
  const normalized = mode?.toLowerCase() || "";
  if (normalized.includes("online")) return "online";
  if (normalized.includes("person") || normalized.includes("physical")) {
    return "in-person";
  }
  return "other";
};

const TutorCard = ({
  tutor,
  showBookButton = false,
  onBook,
}) => {
  if (!tutor) {
    return null;
  }

  const {
    tutor_profile_id,
    full_name,
    professional_bio,
    hourly_rate,
    teaching_mode,
    avg_rating,
    total_completed_sessions,
    city,
    subjects = [],
    is_bookable,
    is_online,
  } = tutor;

  // Supports both flat avatar_url and nested tutor.user.avatar_url payloads
  const avatarUrl = tutor.avatar_url || tutor.user?.avatar_url || null;
  const tutorName = full_name || tutor.user?.full_name || "Tutor";

  const visibleSubjects = subjects.slice(0, 3);
  const canBook = is_bookable === true;
  const tutorIsOnline = is_online === true;

  const formattedRate =
    hourly_rate !== undefined && hourly_rate !== null
      ? `PKR ${Number(hourly_rate).toLocaleString()}`
      : "—";

  const formattedRating =
    avg_rating !== undefined && avg_rating !== null
      ? Number(avg_rating).toFixed(1)
      : null;

  const teachingMode = getTeachingMode(teaching_mode);

  const handleBook = () => {
    if (!canBook) {
      return;
    }
    onBook?.(tutor);
  };

  return (
    <article className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white transition-colors hover:border-[#c9cdd3]">
      {/* Image area with Online Status Indicator */}
      <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-[#f0f3ff]">
        <div className="relative">
          <UserAvatar
            avatarUrl={avatarUrl}
            name={tutorName}
            fallbackChar="T"
            size="xl"
            className="h-24 w-24 border-2 border-white text-2xl shadow-sm"
          />

          {/* Green Online Presence Dot */}
          {tutorIsOnline && (
            <span
              className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white"
              title="Online now"
              aria-label="Online now"
            />
          )}
        </div>

        {formattedRating && (
          <span className="absolute right-3 top-3 rounded-md bg-white px-2 py-1 text-xs font-medium text-black shadow-sm">
            {formattedRating} / 5
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight text-black">
              {tutorName}
            </h2>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#626770]">
              {city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#8a8e95]" />
                  {city}
                </span>
              )}

              {/* Relocated Teaching Mode Badge with Refined Icon and Label */}
              {teaching_mode && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-0.5 font-medium text-gray-700">
                  <span className="text-[#8a8e95] font-normal">Mode:</span>
                  {teachingMode === "online" && (
                    <Monitor className="h-3 w-3 text-gray-500" />
                  )}
                  {teachingMode === "in-person" && (
                    <MapPin className="h-3 w-3 text-gray-500" />
                  )}
                  {teachingMode === "other" && (
                    <Globe className="h-3 w-3 text-gray-500" />
                  )}
                  {teaching_mode}
                </span>
              )}
            </div>
          </div>
        </div>

        {professional_bio && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#626770]">
            {professional_bio}
          </p>
        )}

        {visibleSubjects.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleSubjects.map((subject) => {
              const key =
                subject.subject_id ||
                subject.id ||
                subject.subject_name ||
                subject.name;

              const name =
                subject.subject_name ||
                subject.name ||
                subject;

              return (
                <span
                  key={key}
                  className="rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-2.5 py-1 text-xs font-medium text-[#4c4546]"
                >
                  {name}
                </span>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-4 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-base font-semibold text-black">
              {formattedRate}
              <span className="ml-1 text-xs font-normal text-[#6b7280]">
                / hr
              </span>
            </p>

            {total_completed_sessions !== undefined &&
              total_completed_sessions !== null && (
                <p className="mt-1 text-xs text-[#8a8e95]">
                  {total_completed_sessions} completed sessions
                </p>
              )}
          </div>

          {tutor_profile_id && (
            <div className="flex flex-wrap gap-2">
              {showBookButton && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!canBook}
                  onClick={handleBook}
                >
                  {canBook ? "Book" : "Unavailable"}
                </Button>
              )}

              <Link href={`/tutor/${tutor_profile_id}`}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                >
                  View profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default TutorCard;