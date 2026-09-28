/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";

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
  ConfirmModal,
} from "@/components/common";
import ProfilePictureUpload from "@/components/common/upload-pfp";

import {
  useProfile,
  useUpdateProfile,
  useTutorProfile,
  useUpdateTutorProfile,
} from "@/hooks";

import {
  TEACHING_MODES,
  TEACHING_MODE_LABELS,
} from "@/constants";

const teachingModeOptions = Object.values(TEACHING_MODES).map((mode) => ({
  value: mode,
  label: TEACHING_MODE_LABELS[mode],
}));

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

  const updateProfileMutation = useUpdateProfile();
  const updateTutorProfileMutation = useUpdateTutorProfile();

  const [isUserEditing, setIsUserEditing] = useState(false);
  const [isTutorEditing, setIsTutorEditing] = useState(false);

  const initialUserFormRef = useRef({
    full_name: "",
    city: "",
    phone_number: "",
    timezone: "",
  });

  const initialTutorFormRef = useRef({
    professional_bio: "",
    hourly_rate: "",
    teaching_mode: "ONLINE",
  });

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

  // Modal states
  const [showUserSaveModal, setShowUserSaveModal] = useState(false);
  const [showUserCancelModal, setShowUserCancelModal] = useState(false);

  const [showTutorSaveModal, setShowTutorSaveModal] = useState(false);
  const [showTutorCancelModal, setShowTutorCancelModal] = useState(false);

  const [targetAvailability, setTargetAvailability] = useState(null);

  useEffect(() => {
    if (!user) return;

    const data = {
      full_name: user.full_name || "",
      city: user.city || "",
      phone_number: user.phone_number || "",
      timezone: user.timezone || "",
    };
    initialUserFormRef.current = data;
    setUserForm(data);
  }, [user]);

  useEffect(() => {
    if (!tutor) return;

    const data = {
      professional_bio: tutor.professional_bio || "",
      hourly_rate:
        tutor.hourly_rate !== undefined && tutor.hourly_rate !== null
          ? String(tutor.hourly_rate)
          : "",
      teaching_mode: tutor.teaching_mode || "ONLINE",
    };
    initialTutorFormRef.current = data;
    setTutorForm(data);
  }, [tutor]);

  const hasUserFormChanged = () => {
    return (
      userForm.full_name.trim() !== initialUserFormRef.current.full_name.trim() ||
      userForm.city.trim() !== initialUserFormRef.current.city.trim() ||
      userForm.phone_number.trim() !== initialUserFormRef.current.phone_number.trim() ||
      userForm.timezone.trim() !== initialUserFormRef.current.timezone.trim()
    );
  };

  const hasTutorFormChanged = () => {
    return (
      tutorForm.professional_bio.trim() !== initialTutorFormRef.current.professional_bio.trim() ||
      String(tutorForm.hourly_rate).trim() !== String(initialTutorFormRef.current.hourly_rate).trim() ||
      tutorForm.teaching_mode !== initialTutorFormRef.current.teaching_mode
    );
  };

  const resetUserForm = () => {
    setUserForm(initialUserFormRef.current);
    setShowUserSaveModal(false);
    setShowUserCancelModal(false);
    updateProfileMutation.reset();
  };

  const resetTutorForm = () => {
    setTutorForm(initialTutorFormRef.current);
    setShowTutorSaveModal(false);
    setShowTutorCancelModal(false);
    updateTutorProfileMutation.reset();
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

  const handleUserCancelClick = () => {
    if (hasUserFormChanged()) {
      setShowUserCancelModal(true);
    } else {
      setIsUserEditing(false);
      resetUserForm();
    }
  };

  const handleTutorCancelClick = () => {
    if (hasTutorFormChanged()) {
      setShowTutorCancelModal(true);
    } else {
      setIsTutorEditing(false);
      resetTutorForm();
    }
  };

  const handleUserSubmit = (event) => {
    event.preventDefault();
    if (!hasUserFormChanged()) {
      setIsUserEditing(false);
      return;
    }
    setShowUserSaveModal(true);
  };

  const handleTutorSubmit = (event) => {
    event.preventDefault();
    if (!hasTutorFormChanged()) {
      setIsTutorEditing(false);
      return;
    }
    setShowTutorSaveModal(true);
  };

  const confirmUpdateUser = async () => {
    try {
      await updateProfileMutation.mutateAsync(userForm);
      initialUserFormRef.current = { ...userForm };
      setShowUserSaveModal(false);
      setIsUserEditing(false);
    } catch {
      setShowUserSaveModal(false);
    }
  };

  const confirmUpdateTutor = async () => {
    try {
      await updateTutorProfileMutation.mutateAsync({
        professional_bio: tutorForm.professional_bio,
        hourly_rate:
          tutorForm.hourly_rate === ""
            ? undefined
            : Number(tutorForm.hourly_rate),
        teaching_mode: tutorForm.teaching_mode,
      });
      initialTutorFormRef.current = { ...tutorForm };
      setShowTutorSaveModal(false);
      setIsTutorEditing(false);
    } catch {
      setShowTutorSaveModal(false);
    }
  };

  const handleConfirmAvailabilityToggle = async () => {
    if (targetAvailability === null) return;

    try {
      await updateTutorProfileMutation.mutateAsync({
        is_available: targetAvailability,
      });
      setTargetAvailability(null);
    } catch {
      // Error handled by mutation state
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
          <p className="text-sm text-[#626770]">Settings are unavailable.</p>
        </CardContent>
      </Card>
    );
  }

  const userUpdateError =
    updateProfileMutation.error?.response?.data?.message ||
    updateProfileMutation.error?.message ||
    null;

  const tutorUpdateError =
    updateTutorProfileMutation.error?.response?.data?.message ||
    updateTutorProfileMutation.error?.message ||
    null;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <section className="border-b border-[#e5e7eb] pb-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <ProfilePictureUpload
            currentAvatarUrl={user.avatar_url}
            fullName={user.full_name}
          />

          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
              Settings  
            </h1>

            <p className="mt-1 truncate text-sm text-[#626770]">
              {user.full_name || "Tutor"}
              {user.email ? ` · ${user.email}` : ""}
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-4 pt-6">
        {/* Personal information */}
        <Card>
          <CardHeader className="border-b border-[#e5e7eb]">
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Personal information</CardTitle>

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
                >
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {!isUserEditing ? (
              <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
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
              <form onSubmit={handleUserSubmit} className="space-y-5">
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
                    <p className="text-sm text-[#93000a]">{userUpdateError}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUserCancelClick}
                    disabled={updateProfileMutation.isPending}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
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
              <CardTitle>Professional information</CardTitle>

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

                  <p className="mt-2 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-[#33373d]">
                    {tutor.professional_bio || "No bio added."}
                  </p>
                </div>

                <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                      Hourly rate
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-black">
                      {tutor.hourly_rate !== undefined &&
                      tutor.hourly_rate !== null
                        ? `PKR ${Number(tutor.hourly_rate).toLocaleString()}`
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                      Teaching mode
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-black">
                      {TEACHING_MODE_LABELS[tutor.teaching_mode] ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTutorSubmit} className="space-y-5">
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
                    options={teachingModeOptions}
                  />
                </div>

                {tutorUpdateError && (
                  <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
                    <p className="text-sm text-[#93000a]">{tutorUpdateError}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTutorCancelClick}
                    disabled={updateTutorProfileMutation.isPending}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={updateTutorProfileMutation.isPending}
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
            <CardTitle>Booking availability</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
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
                onClick={() => setTargetAvailability(!tutor.is_available)}
                disabled={updateTutorProfileMutation.isPending}
                className="shrink-0"
              >
                {tutor.is_available ? "Set unavailable" : "Set available"}
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
            <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
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

      {/* Confirmation Modal for Personal Info Save */}
      <ConfirmModal
        isOpen={showUserSaveModal}
        onClose={() => setShowUserSaveModal(false)}
        onConfirm={confirmUpdateUser}
        title="Are you sure you want to update your personal information?"
        message="Your profile details will be updated across the platform."
        confirmText="Save changes"
        variant="primary"
        isLoading={updateProfileMutation.isPending}
      />

      {/* Confirmation Modal for Personal Info Cancel */}
      <ConfirmModal
        isOpen={showUserCancelModal}
        onClose={() => setShowUserCancelModal(false)}
        onConfirm={() => {
          setIsUserEditing(false);
          resetUserForm();
        }}
        title="Discard unsaved changes?"
        message="You have unsaved changes in your personal information. Are you sure you want to cancel?"
        confirmText="Discard changes"
        variant="danger"
      />

      {/* Confirmation Modal for Professional Info Save */}
      <ConfirmModal
        isOpen={showTutorSaveModal}
        onClose={() => setShowTutorSaveModal(false)}
        onConfirm={confirmUpdateTutor}
        title="Are you sure you want to update your professional information?"
        message="Your tutor bio, rate, and teaching mode will be updated on your public profile."
        confirmText="Save changes"
        variant="primary"
        isLoading={updateTutorProfileMutation.isPending}
      />

      {/* Confirmation Modal for Professional Info Cancel */}
      <ConfirmModal
        isOpen={showTutorCancelModal}
        onClose={() => setShowTutorCancelModal(false)}
        onConfirm={() => {
          setIsTutorEditing(false);
          resetTutorForm();
        }}
        title="Discard unsaved changes?"
        message="You have unsaved changes in your professional information. Are you sure you want to cancel?"
        confirmText="Discard changes"
        variant="danger"
      />

      {/* Confirmation Modal for Availability Toggle */}
      <ConfirmModal
        isOpen={targetAvailability !== null}
        onClose={() => setTargetAvailability(null)}
        onConfirm={handleConfirmAvailabilityToggle}
        title={`Are you sure you want to set yourself as ${
          targetAvailability ? "Available" : "Unavailable"
        }?`}
        message={
          targetAvailability
            ? "Students will now be able to request and book lessons with you."
            : "You will no longer appear as active for new student bookings."
        }
        confirmText={targetAvailability ? "Set available" : "Set unavailable"}
        variant={targetAvailability ? "primary" : "danger"}
        isLoading={updateTutorProfileMutation.isPending}
      />
    </div>
  );
};

export default TutorSettingsPage;