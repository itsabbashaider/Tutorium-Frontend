/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ErrorState,
  Input,
  Loading,
  Select,
  Textarea,
} from "../common";

import {
  useTutorProfile,
  useUpdateTutorProfile,
} from "../../hooks";

const TEACHING_MODE_OPTIONS = [
  {
    value: "ONLINE",
    label: "Online",
  },
  {
    value: "IN_PERSON",
    label: "In person",
  },
  {
    value: "BOTH",
    label: "Online & in person",
  },
];

const TutorProfile = () => {
  const {
    data: tutor,
    isLoading,
    isError,
    error,
  } = useTutorProfile();

  const updateMutation =
    useUpdateTutorProfile();

  const [professionalBio, setProfessionalBio] =
    useState("");

  const [hourlyRate, setHourlyRate] =
    useState("");

  const [teachingMode, setTeachingMode] =
    useState("ONLINE");

  useEffect(() => {
    if (!tutor) {
      return;
    }

    setProfessionalBio(
      tutor.professional_bio ?? ""
    );

    setHourlyRate(
      tutor.hourly_rate !== undefined &&
        tutor.hourly_rate !== null
        ? String(tutor.hourly_rate)
        : ""
    );

    setTeachingMode(
      tutor.teaching_mode ?? "ONLINE"
    );
  }, [tutor]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateMutation.mutateAsync({
        professional_bio: professionalBio,
        hourly_rate:
          hourlyRate === ""
            ? undefined
            : Number(hourlyRate),
        teaching_mode: teachingMode,
      });
    } catch {
      // Mutation error is rendered below.
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load profile"
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while loading your profile."
        }
      />
    );
  }

  const updateError =
    updateMutation.error?.response?.data
      ?.message ||
    updateMutation.error?.message ||
    null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Professional profile
        </CardTitle>

        <CardDescription>
          Information students can see on your tutor profile.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Textarea
            id="professional_bio"
            label="Professional bio"
            value={professionalBio}
            onChange={(event) =>
              setProfessionalBio(
                event.target.value
              )
            }
            rows={6}
            maxLength={1000}
            placeholder="Tell students about your teaching experience, expertise, and approach."
            helperText={`${professionalBio.length}/1000`}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="hourly_rate"
              label="Hourly rate (PKR)"
              type="number"
              min="1"
              step="0.01"
              value={hourlyRate}
              onChange={(event) =>
                setHourlyRate(
                  event.target.value
                )
              }
              placeholder="e.g. 1500"
            />

            <Select
              id="teaching_mode"
              label="Teaching mode"
              value={teachingMode}
              onChange={(event) =>
                setTeachingMode(
                  event.target.value
                )
              }
              options={TEACHING_MODE_OPTIONS}
            />
          </div>

          {updateError && (
            <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
              <p className="text-sm text-[#93000a]">
                {updateError}
              </p>
            </div>
          )}

          {updateMutation.isSuccess && (
            <div className="rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-4 py-3">
              <p className="text-sm text-[#33373d]">
                Profile updated successfully.
              </p>
            </div>
          )}

          <div className="flex justify-end border-t border-[#e5e7eb] pt-5">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending
                ? "Saving..."
                : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TutorProfile;