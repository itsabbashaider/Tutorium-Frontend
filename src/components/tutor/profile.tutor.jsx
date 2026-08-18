"use client";

import Link from "next/link";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Loading,
} from "../common";

const TutorProfile = ({
  tutor,
  isLoading = false,
}) => {
  if (isLoading) {
    return <Loading />;
  }

  if (!tutor) {
    return (
      <EmptyState
        title="Tutor not found"
        message="The tutor profile could not be found."
      />
    );
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

  const formattedRating =
    avg_rating !== undefined &&
    avg_rating !== null
      ? Number(avg_rating).toFixed(1)
      : "—";

  const formattedRate =
    hourly_rate !== undefined &&
    hourly_rate !== null
      ? `PKR ${Number(
          hourly_rate
        ).toLocaleString()}`
      : "—";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Profile overview */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-2xl font-semibold text-[#3949ab]">
                  {full_name
                    ?.charAt(0)
                    ?.toUpperCase() || "T"}
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                    {full_name || "Tutor"}
                  </h1>

                  {city && (
                    <p className="mt-1 text-sm text-[#626770]">
                      {city}
                    </p>
                  )}

                  {teaching_mode && (
                    <p className="mt-3 text-xs font-medium text-[#8a8e95]">
                      {teaching_mode}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href={`/bookings/create?tutor=${tutor_profile_id}`}
                >
                  <Button className="w-full sm:w-auto">
                    Book this tutor
                  </Button>
                </Link>

                <Link
                  href={`/tutors/${tutor_profile_id}/availability`}
                >
                  <Button
                    variant="outline"
                    className="w-full transition-colors hover:border-black hover:bg-black hover:text-white sm:w-auto"
                  >
                    View availability
                  </Button>
                </Link>
              </div>
            </div>

            {professional_bio && (
              <div className="border-t border-[#e5e7eb] pt-5">
                <p className="max-w-4xl whitespace-pre-wrap text-sm leading-7 text-[#33373d]">
                  {professional_bio}
                </p>
              </div>
            )}

            <div className="grid gap-4 border-t border-[#e5e7eb] pt-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                  Rating
                </p>

                <p className="mt-1.5 text-lg font-semibold text-black">
                  {formattedRating}
                  <span className="ml-1 text-sm font-normal text-[#8a8e95]">
                    / 5
                  </span>
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                  Completed sessions
                </p>

                <p className="mt-1.5 text-lg font-semibold text-black">
                  {total_completed_sessions ??
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                  Hourly rate
                </p>

                <p className="mt-1.5 text-lg font-semibold text-black">
                  {formattedRate}
                  <span className="ml-1 text-sm font-normal text-[#8a8e95]">
                    / hr
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>

          <CardDescription>
            Subjects taught by this tutor.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {subjects.length === 0 ? (
            <p className="text-sm text-[#626770]">
              No subjects listed.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => {
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
                    className="rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-3 py-1.5 text-sm font-medium text-[#33373d]"
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorProfile;