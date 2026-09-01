"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
  Loading,
} from "@/components/common";

import { useStudentPublicProfile } from "@/hooks";

const StudentPublicProfilePage = () => {
  const { student_id } = useParams();

  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useStudentPublicProfile(student_id);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !student) {
    return (
      <ErrorState
        title="Unable to load profile"
        message={
          error?.response?.data?.message ||
          error?.message ||
          "This student profile could not be found."
        }
      />
    );
  }

  const fullName =
    student.user?.full_name || "Student";

  const city =
    student.user?.city || null;

  const academicLevel =
    student.academic_level || null;

  const learningGoals =
    student.learning_goals || null;

  const completionRate = Number(
    student.completion_rate
  );

  const hasCompletionRate =
    Number.isFinite(completionRate);

  const initial =
    fullName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Back */}
      <div className="mb-8">
        <Link href="/tutor/bookings">
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

            <span>
              Back to bookings
            </span>
          </Button>
        </Link>
      </div>

      {/* Profile */}
      <Card className="overflow-hidden">
        <CardContent className="p-6 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Identity */}
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-xl font-semibold text-[#3949ab]">
                {initial}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold tracking-tight text-black">
                  {fullName}
                </h1>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-[#626770]">
                  {city && (
                    <span>
                      {city}
                    </span>
                  )}

                  {city &&
                    academicLevel && (
                      <span
                        aria-hidden="true"
                        className="text-[#c4c7cc]"
                      >
                        •
                      </span>
                  )}

                  {academicLevel && (
                    <span>
                      {academicLevel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student information */}
      <Card className="mt-6">
        <CardHeader className="px-6 pb-3 pt-6 sm:px-7 sm:pt-7">
          <CardTitle>
            Learning goals
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-7 sm:px-7 sm:pb-7">
          {learningGoals ? (
            <p className="max-w-4xl whitespace-pre-wrap text-sm leading-7 text-[#33373d]">
              {learningGoals}
            </p>
          ) : (
            <p className="text-sm text-[#8a8e95]">
              No learning goals shared.
            </p>
          )}

          {hasCompletionRate && (
            <div className="mt-6 border-t border-[#e5e7eb] pt-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-black">
                    Completion rate
                  </p>

                  <p className="mt-1 text-xs text-[#8a8e95]">
                    Completed bookings out of finalized bookings.
                  </p>
                </div>

                <p className="text-lg font-semibold text-black">
                  {completionRate.toFixed(0)}%
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eef0f2]">
                <div
                  className="h-full rounded-full bg-black transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        completionRate
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPublicProfilePage;
