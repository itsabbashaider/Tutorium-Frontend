"use client";

import Link from "next/link";
import { Monitor, MapPin, Shuffle } from "lucide-react";
import { Button, UserAvatar } from "../common";

const TEACHING_MODE_CONFIG = {
  ONLINE: { label: "Remote", icon: Monitor },
  IN_PERSON: { label: "Onsite", icon: MapPin },
  BOTH: { label: "Hybrid", icon: Shuffle },
};

const getTeachingModeMeta = (mode) => {
  const normalized = mode?.toUpperCase() || "";
  if (normalized.includes("ONLINE")) return TEACHING_MODE_CONFIG.ONLINE;
  if (normalized.includes("PERSON") || normalized.includes("ONSITE")) return TEACHING_MODE_CONFIG.IN_PERSON;
  if (normalized.includes("BOTH") || normalized.includes("HYBRID")) return TEACHING_MODE_CONFIG.BOTH;
  return { label: mode || "Remote", icon: Monitor };
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

  const modeMeta = getTeachingModeMeta(teaching_mode);
  const ModeIcon = modeMeta.icon;

  const handleBook = () => {
    if (!canBook) {
      return;
    }
    onBook?.(tutor);
  };

  return (
    <article className="group flex flex-col justify-between h-full overflow-hidden rounded-lg border border-[#e5e7eb] bg-white transition-shadow hover:shadow-md">
      {/* Top Section */}
      <div>
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
          {/* Header Row: Name & Location/Mode placed space-between */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold tracking-tight text-black">
                {tutorName}
              </h2>
            </div>

            {/* Location & Teaching Mode Badge */}
            <div className="flex items-center gap-2 shrink-0">
              {city && (
                <span className="flex items-center gap-1 text-xs text-[#626770]">
                  <MapPin className="h-3 w-3 text-[#8a8e95]" />
                  {city}
                </span>
              )}

              {teaching_mode && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                  <ModeIcon className="h-3 w-3 text-gray-500" />
                  {modeMeta.label}
                </span>
              )}
            </div>
          </div>

          {/* Strict Fixed-Height Bio Section (h-12 reserves exact 2 lines of space whether text exists or not) */}
          <div className="mt-3 h-12 overflow-hidden">
            {professional_bio ? (
              <p className="line-clamp-2 text-sm leading-6 text-[#626770]">
                {professional_bio}
              </p>
            ) : (
              <span aria-hidden="true" className="invisible text-sm leading-6">Placeholder bio line spacing</span>
            )}
          </div>

          {/* Strict Min-Height Subjects / Tags Section */}
          <div className="mt-4 flex flex-wrap gap-1.5 min-h-8">
            {visibleSubjects.length > 0 ? (
              visibleSubjects.map((subject) => {
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
              })
            ) : (
              <span aria-hidden="true" className="invisible text-xs px-2.5 py-1">No tags</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section (Locked evenly to the bottom of every card) */}
      <div className="mt-auto px-5 pb-5 pt-4 border-t border-[#e5e7eb] flex items-center justify-between">
        <div>
          <p className="text-base font-semibold text-black">
            {formattedRate}
            <span className="ml-1 text-xs font-normal text-[#6b7280]">
              / hr
            </span>
          </p>

          {/* Invisible spacer if session count is missing to keep footer height aligned */}
          <p className={`mt-0.5 text-xs text-[#8a8e95] ${total_completed_sessions ? '' : 'invisible select-none'}`}>
            {total_completed_sessions ? `${total_completed_sessions} completed sessions` : '0 sessions'}
          </p>
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
    </article>
  );
};

export default TutorCard;