/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
  Input,
  Loading,
  Select,
  Textarea,
} from "@/components/common";

import {
  useProfile,
  useUpdateProfile,
  useTutorProfile,
  useUpdateTutorProfile,
} from "@/hooks";

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

const TutorSettingsPage = () => {
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useProfile();

  const {
    data: tutor,
    isLoading: isTutorLoading,
    isError: isTutorError,
    error: tutorError,
  } = useTutorProfile();

  const updateProfileMutation =
    useUpdateProfile();

  const updateTutorProfileMutation =
    useUpdateTutorProfile();

  const [isUserEditing, setIsUserEditing] =
    useState(false);

  const [isTutorEditing, setIsTutorEditing] =
    useState(false);

  const [userForm, setUserForm] = useState({
    full_name: "",
    city: "",
    phone_number: "",
    timezone: "",
  });

  const [tutorForm, setTutorForm] = useState({
    professional_bio: "",
    hourly_rate: "",
    teaching_mode: "ONLINE",
  });

  useEffect(() => {
    if (!user) return;

    setUserForm({
      full_name: user.full_name || "",
      city: user.city || "",
      phone_number: user.phone_number || "",
      timezone: user.timezone || "",
    });
  }, [user]);

  useEffect(() => {
    if (!tutor) return;

    setTutorForm({
      professional_bio:
        tutor.professional_bio || "",
      hourly_rate:
        tutor.hourly_rate !== undefined &&
        tutor.hourly_rate !== null
          ? String(tutor.hourly_rate)
          : "",
      teaching_mode:
        tutor.teaching_mode || "ONLINE",
    });
  }, [tutor]);

  const resetUserForm = () => {
    setUserForm({
      full_name: user?.full_name || "",
      city: user?.city || "",
      phone_number:
        user?.phone_number || "",
      timezone: user?.timezone || "",
    });
  };

  const resetTutorForm = () => {
    setTutorForm({
      professional_bio:
        tutor?.professional_bio || "",
      hourly_rate:
        tutor?.hourly_rate !== undefined &&
        tutor?.hourly_rate !== null
          ? String(tutor.hourly_rate)
          : "",
      teaching_mode:
        tutor?.teaching_mode || "ONLINE",
    });
  };

  const handleUserChange = (event) => {
    const { name, value } = event.target;

    setUserForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleTutorChange = (event) => {
    const { name, value } = event.target;

    setTutorForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateProfileMutation.mutateAsync(
        userForm
      );

      setIsUserEditing(false);
    } catch {
      // Error rendered below.
    }
  };

  const handleTutorSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateTutorProfileMutation.mutateAsync({
        professional_bio:
          tutorForm.professional_bio,
        hourly_rate:
          tutorForm.hourly_rate === ""
            ? undefined
            : Number(tutorForm.hourly_rate),
        teaching_mode:
          tutorForm.teaching_mode,
      });

      setIsTutorEditing(false);
    } catch {
      // Error rendered below.
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      await updateTutorProfileMutation.mutateAsync({
        is_available: !tutor?.is_available,
      });
    } catch {
      // Error rendered below.
    }
  };

  if (isUserLoading || isTutorLoading) {
    return <Loading />;
  }

  if (isUserError) {
    return (
      <ErrorState
        title="Unable to load settings"
        message={
          userError?.response?.data?.message ||
          userError?.message ||
          "Unable to load your account."
        }
      />
    );
  }

  if (isTutorError) {
    return (
      <ErrorState
        title="Unable to load settings"
        message={
          tutorError?.response?.data?.message ||
          tutorError?.message ||
          "Unable to load your tutor profile."
        }
      />
    );
  }

  if (!user || !tutor) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-[#626770]">
            Settings are unavailable.
          </p>
        </CardContent>
      </Card>
    );
  }

  const userInitial =
    user.full_name
      ?.charAt(0)
      ?.toUpperCase() || "T";

  const userUpdateError =
    updateProfileMutation.error?.response?.data
      ?.message ||
    updateProfileMutation.error?.message ||
    null;

  const tutorUpdateError =
    updateTutorProfileMutation.error?.response
      ?.data?.message ||
    updateTutorProfileMutation.error?.message ||
    null;

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Page header */}
      <div className="border-b border-[#e5e7eb] pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-lg font-semibold text-[#3949ab]">
            {userInitial}
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-black">
              Settings
            </h1>

            <p className="mt-1 truncate text-sm text-[#626770]">
              {user.full_name || "Tutor"}
              {user.email
                ? ` · ${user.email}`
                : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 pt-6">
        {/* Personal information */}
        <Card>
          <CardHeader className="border-b border-[#e5e7eb]">
            <div className="flex items-center justify-between gap-4">
              <CardTitle>
                Personal information
              </CardTitle>

              {!isUserEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetUserForm();
                    updateProfileMutation.reset();
                    setIsUserEditing(true);
                  }}
                  className="transition-colors hover:border-black hover:bg-black hover:text-white"
                >
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {!isUserEditing ? (
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                    Full name
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-black">
                    {user.full_name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                    City
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-black">
                    {user.city || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                    Phone
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-black">
                    {user.phone_number || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                    Timezone
                  </p>

                  <p className="mt-1.5 text-sm font-medium text-black">
                    {user.timezone || "—"}
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleUserSubmit}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    id="full_name"
                    name="full_name"
                    label="Full name"
                    value={userForm.full_name}
                    onChange={handleUserChange}
                  />

                  <Input
                    id="city"
                    name="city"
                    label="City"
                    value={userForm.city}
                    onChange={handleUserChange}
                  />

                  <Input
                    id="phone_number"
                    name="phone_number"
                    label="Phone"
                    type="tel"
                    value={userForm.phone_number}
                    onChange={handleUserChange}
                  />

                  <Input
                    id="timezone"
                    name="timezone"
                    label="Timezone"
                    value={userForm.timezone}
                    onChange={handleUserChange}
                    placeholder="e.g. Asia/Karachi"
                  />
                </div>

                {userUpdateError && (
                  <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
                    <p className="text-sm text-[#93000a]">
                      {userUpdateError}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetUserForm();
                      updateProfileMutation.reset();
                      setIsUserEditing(false);
                    }}
                    disabled={
                      updateProfileMutation.isPending
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={
                      updateProfileMutation.isPending
                    }
                  >
                    {updateProfileMutation.isPending
                      ? "Saving..."
                      : "Save changes"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Professional information */}
        <Card>
          <CardHeader className="border-b border-[#e5e7eb]">
            <div className="flex items-center justify-between gap-4">
              <CardTitle>
                Professional information
              </CardTitle>

              {!isTutorEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetTutorForm();
                    updateTutorProfileMutation.reset();
                    setIsTutorEditing(true);
                  }}
                  className="transition-colors hover:border-black hover:bg-black hover:text-white"
                >
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {!isTutorEditing ? (
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                    Bio
                  </p>

                  <p className="mt-2 max-w-4xl whitespace-pre-wrap text-sm leading-6 text-[#33373d]">
                    {tutor.professional_bio ||
                      "No bio added."}
                  </p>
                </div>

                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                      Hourly rate
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-black">
                      {tutor.hourly_rate !==
                        undefined &&
                      tutor.hourly_rate !==
                        null
                        ? `PKR ${Number(
                            tutor.hourly_rate
                          ).toLocaleString()}`
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                      Teaching mode
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-black">
                      {tutor.teaching_mode || "—"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleTutorSubmit}
                className="space-y-5"
              >
                <Textarea
                  id="professional_bio"
                  name="professional_bio"
                  label="Bio"
                  rows={5}
                  maxLength={1000}
                  value={tutorForm.professional_bio}
                  onChange={handleTutorChange}
                  placeholder="Tell students about your experience and teaching style."
                  helperText={`${tutorForm.professional_bio.length}/1000`}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    id="hourly_rate"
                    name="hourly_rate"
                    label="Hourly rate (PKR)"
                    type="number"
                    min="1"
                    step="0.01"
                    value={tutorForm.hourly_rate}
                    onChange={handleTutorChange}
                    placeholder="e.g. 1500"
                  />

                  <Select
                    id="teaching_mode"
                    name="teaching_mode"
                    label="Teaching mode"
                    value={tutorForm.teaching_mode}
                    onChange={handleTutorChange}
                    options={TEACHING_MODE_OPTIONS}
                  />
                </div>

                {tutorUpdateError && (
                  <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
                    <p className="text-sm text-[#93000a]">
                      {tutorUpdateError}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetTutorForm();
                      updateTutorProfileMutation.reset();
                      setIsTutorEditing(false);
                    }}
                    disabled={
                      updateTutorProfileMutation.isPending
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={
                      updateTutorProfileMutation.isPending
                    }
                  >
                    {updateTutorProfileMutation.isPending
                      ? "Saving..."
                      : "Save changes"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Booking availability */}
        <Card>
          <CardHeader>
            <CardTitle>
              Booking availability
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-black">
                  {tutor.is_available
                    ? "Accepting new bookings"
                    : "Not accepting new bookings"}
                </p>

                <p className="mt-1 text-sm text-[#626770]">
                  {tutor.is_available
                    ? "Students can currently book you."
                    : "Students cannot currently book you."}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleAvailabilityToggle}
                disabled={
                  updateTutorProfileMutation.isPending
                }
                className="shrink-0 transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                {updateTutorProfileMutation.isPending
                  ? "Updating..."
                  : tutor.is_available
                    ? "Set unavailable"
                    : "Set available"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                  Email
                </p>

                <p className="mt-1.5 text-sm font-medium text-black">
                  {user.email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                  Role
                </p>

                <p className="mt-1.5 text-sm font-medium text-black">
                  {user.role || "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#626770]">
                Password changes are not available yet.
              </p>

              <Button
                type="button"
                variant="outline"
                disabled
                className="shrink-0"
              >
                Change password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorSettingsPage;