"use client";

import { useState, useRef } from "react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
  Input,
  Loading,
  Textarea,
  ConfirmModal,
} from "@/components/common";
import ProfilePictureUpload from "@/components/common/upload-pfp";

import {
  useProfile,
  useStudentProfile,
  useUpdateProfile,
  useUpdateStudentProfile,
} from "@/hooks";

const PersonalInformationForm = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);

  const initialFormRef = useRef({
    full_name: user.full_name || "",
    city: user.city || "",
    phone_number: user.phone_number || "",
    timezone: user.timezone || "",
  });

  // eslint-disable-next-line react-hooks/refs
  const [form, setForm] = useState(initialFormRef.current);

  // Modal states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const mutation = useUpdateProfile();

  const errorMessage =
    mutation.error?.response?.data?.message ||
    mutation.error?.message ||
    null;

  const hasFormChanged = () => {
    return (
      form.full_name.trim() !== initialFormRef.current.full_name.trim() ||
      form.city.trim() !== initialFormRef.current.city.trim() ||
      form.phone_number.trim() !== initialFormRef.current.phone_number.trim() ||
      form.timezone.trim() !== initialFormRef.current.timezone.trim()
    );
  };

  const resetForm = () => {
    setForm(initialFormRef.current);
    setShowSaveModal(false);
    setShowCancelModal(false);
    mutation.reset();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    const currentValues = {
      full_name: user.full_name || "",
      city: user.city || "",
      phone_number: user.phone_number || "",
      timezone: user.timezone || "",
    };
    initialFormRef.current = currentValues;
    setForm(currentValues);
    mutation.reset();
    setIsEditing(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!hasFormChanged()) {
      setIsEditing(false);
      return;
    }

    setShowSaveModal(true);
  };

  const confirmUpdate = async () => {
    try {
      await mutation.mutateAsync({
        full_name: form.full_name.trim(),
        city: form.city.trim(),
        phone_number: form.phone_number.trim(),
        timezone: form.timezone.trim(),
      });

      initialFormRef.current = { ...form };
      setShowSaveModal(false);
      setIsEditing(false);
    } catch {
      setShowSaveModal(false);
    }
  };

  const handleCancelClick = () => {
    if (hasFormChanged()) {
      setShowCancelModal(true);
    } else {
      setIsEditing(false);
      resetForm();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="border-b border-[#e5e7eb]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Personal information</CardTitle>

              <p className="mt-1 text-sm text-[#626770]">
                Your basic account information.
              </p>
            </div>

            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEditClick}
              >
                Edit
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {!isEditing ? (
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="full_name"
                  name="full_name"
                  label="Full name"
                  value={form.full_name}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                />

                <Input
                  id="city"
                  name="city"
                  label="City"
                  value={form.city}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                />

                <Input
                  id="phone_number"
                  name="phone_number"
                  label="Phone"
                  type="tel"
                  value={form.phone_number}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                />

                <Input
                  id="timezone"
                  name="timezone"
                  label="Timezone"
                  value={form.timezone}
                  onChange={handleChange}
                  placeholder="e.g. Asia/Karachi"
                  disabled={mutation.isPending}
                />
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
                  <p className="text-sm text-[#93000a]">{errorMessage}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelClick}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={confirmUpdate}
        title="Are you sure you want to update your personal information?"
        message="Your profile details will be updated across the platform."
        confirmText="Save changes"
        variant="primary"
        isLoading={mutation.isPending}
      />

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setIsEditing(false);
          resetForm();
        }}
        title="Discard unsaved changes?"
        message="You have unsaved changes in your personal information. Are you sure you want to cancel?"
        confirmText="Discard changes"
        variant="danger"
      />
    </>
  );
};

const StudentInformationForm = ({ studentProfile }) => {
  const [isEditing, setIsEditing] = useState(false);

  const initialFormRef = useRef({
    academic_level: studentProfile.academic_level || "",
    learning_goals: studentProfile.learning_goals || "",
  });

  // eslint-disable-next-line react-hooks/refs
  const [form, setForm] = useState(initialFormRef.current);

  // Modal states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const mutation = useUpdateStudentProfile();

  const errorMessage =
    mutation.error?.response?.data?.message ||
    mutation.error?.message ||
    null;

  const hasFormChanged = () => {
    return (
      form.academic_level.trim() !== initialFormRef.current.academic_level.trim() ||
      form.learning_goals.trim() !== initialFormRef.current.learning_goals.trim()
    );
  };

  const resetForm = () => {
    setForm(initialFormRef.current);
    setShowSaveModal(false);
    setShowCancelModal(false);
    mutation.reset();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    const currentValues = {
      academic_level: studentProfile.academic_level || "",
      learning_goals: studentProfile.learning_goals || "",
    };
    initialFormRef.current = currentValues;
    setForm(currentValues);
    mutation.reset();
    setIsEditing(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!hasFormChanged()) {
      setIsEditing(false);
      return;
    }

    setShowSaveModal(true);
  };

  const confirmUpdate = async () => {
    try {
      await mutation.mutateAsync({
        academic_level: form.academic_level.trim(),
        learning_goals: form.learning_goals.trim(),
      });

      initialFormRef.current = { ...form };
      setShowSaveModal(false);
      setIsEditing(false);
    } catch {
      setShowSaveModal(false);
    }
  };

  const handleCancelClick = () => {
    if (hasFormChanged()) {
      setShowCancelModal(true);
    } else {
      setIsEditing(false);
      resetForm();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="border-b border-[#e5e7eb]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Student information</CardTitle>

              <p className="mt-1 text-sm text-[#626770]">
                Information about your studies and learning goals.
              </p>
            </div>

            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEditClick}
              >
                Edit
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                  Academic level
                </p>

                <p className="mt-1.5 text-sm font-medium text-black">
                  {studentProfile.academic_level || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#8a8e95]">
                  Learning goals
                </p>

                <p className="mt-2 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-[#33373d]">
                  {studentProfile.learning_goals || "No learning goals added."}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="academic_level"
                name="academic_level"
                label="Academic level"
                value={form.academic_level}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g. Bachelor's, Grade 12"
                disabled={mutation.isPending}
              />

              <Textarea
                id="learning_goals"
                name="learning_goals"
                label="Learning goals"
                value={form.learning_goals}
                onChange={handleChange}
                maxLength={1000}
                rows={5}
                placeholder="Describe what you want to learn and achieve."
                helperText={`${form.learning_goals.length}/1000`}
                disabled={mutation.isPending}
              />

              {errorMessage && (
                <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
                  <p className="text-sm text-[#93000a]">{errorMessage}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelClick}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={confirmUpdate}
        title="Are you sure you want to update your student profile?"
        message="Your academic details and goals will be updated."
        confirmText="Save changes"
        variant="primary"
        isLoading={mutation.isPending}
      />

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setIsEditing(false);
          resetForm();
        }}
        title="Discard unsaved changes?"
        message="You have unsaved changes in your student profile. Are you sure you want to cancel?"
        confirmText="Discard changes"
        variant="danger"
      />
    </>
  );
};

const StudentSettingsPage = () => {
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useProfile();

  const {
    data: studentProfile,
    isLoading: isStudentProfileLoading,
    isError: isStudentProfileError,
    error: studentProfileError,
  } = useStudentProfile();

  const isLoading = isUserLoading || isStudentProfileLoading;

  if (isLoading) {
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

  if (isStudentProfileError) {
    return (
      <ErrorState
        title="Unable to load settings"
        message={
          studentProfileError?.response?.data?.message ||
          studentProfileError?.message ||
          "Unable to load your student profile."
        }
      />
    );
  }

  if (!user || !studentProfile) {
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

  return (
    <div className="mx-auto w-full max-w-5xl">
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
              {user.full_name || "Student"}
              {user.email ? ` · ${user.email}` : ""}
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-5 pt-6">
        <PersonalInformationForm user={user} />

        <StudentInformationForm studentProfile={studentProfile} />

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>

            <p className="mt-1 text-sm text-[#626770]">
              Your account details.
            </p>
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

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>

            <p className="mt-1 text-sm text-[#626770]">
              Manage your account password.
            </p>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-black">
                  Change your password
                </p>

                <p className="mt-1 text-sm text-[#626770]">
                  Password changes are not available yet.
                </p>
              </div>

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

export default StudentSettingsPage;