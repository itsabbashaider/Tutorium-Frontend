"use client";

import Link from "next/link";

import {
  Button,
} from "../common";

const TutorCard = ({
  tutor,
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
  } = tutor;

  const visibleSubjects =
    subjects.slice(0, 3);

  const formattedRate =
    hourly_rate !== undefined &&
    hourly_rate !== null
      ? `PKR ${Number(
          hourly_rate
        ).toLocaleString()}`
      : "—";

  const formattedRating =
    avg_rating !== undefined &&
    avg_rating !== null
      ? Number(avg_rating).toFixed(1)
      : null;

  return (
    <article className="group overflow-hidden rounded-lg border border-[#e5e7eb] bg-white transition-colors hover:border-[#c9cdd3]">
      {/* Image area */}
      <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-[#f0f3ff]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-semibold text-[#3949ab] shadow-sm">
          {full_name
            ?.charAt(0)
            ?.toUpperCase() || "T"}
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
              {full_name || "Tutor"}
            </h2>

            {city && (
              <p className="mt-1 text-sm text-[#626770]">
                {city}
              </p>
            )}
          </div>

          {teaching_mode && (
            <span className="shrink-0 text-xs font-medium text-[#8a8e95]">
              {teaching_mode}
            </span>
          )}
        </div>

        {professional_bio && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#626770]">
            {professional_bio}
          </p>
        )}

        {visibleSubjects.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleSubjects.map(
              (subject) => {
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
              }
            )}
          </div>
        )}

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#e5e7eb] pt-4">
          <div>
            <p className="text-base font-semibold text-black">
              {formattedRate}
              <span className="ml-1 text-xs font-normal text-[#6b7280]">
                / hr
              </span>
            </p>

            {total_completed_sessions !==
              undefined &&
              total_completed_sessions !==
                null && (
                <p className="mt-1 text-xs text-[#8a8e95]">
                  {total_completed_sessions}{" "}
                  completed sessions
                </p>
              )}
          </div>

          {tutor_profile_id && (
            <Link
              href={`/tutor/${tutor_profile_id}`}
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
              >
                View profile
              </Button>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default TutorCard;