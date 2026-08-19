"use client";

import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  Input,
  Loading,
  Select,
} from "@/components/common";

import {
  useCreateTutorAvailability,
  useDeleteTutorAvailability,
  useTutorAvailability,
  useUpdateTutorAvailability,
} from "@/hooks";

const DAYS = [
  { value: 0, label: "Sunday", short: "Sun" },
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
];

const DEFAULT_FORM = {
  day_of_week: 1,
  start_time: "09:00",
  end_time: "17:00",
  is_active: true,
};

const getDayName = (day) => {
  return (
    DAYS.find(
      (item) => item.value === Number(day)
    )?.label || "Unknown day"
  );
};

const getDayShortName = (day) => {
  return (
    DAYS.find(
      (item) => item.value === Number(day)
    )?.short || "—"
  );
};

const formatTime = (time) => {
  if (!time) return "—";

  const normalized = String(time).slice(0, 5);

  const [hours, minutes] =
    normalized.split(":");

  if (
    hours === undefined ||
    minutes === undefined
  ) {
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

const TutorAvailabilityPage = () => {
  const {
    data: availability = [],
    isLoading,
    isError,
    error,
  } = useTutorAvailability();

  const createMutation =
    useCreateTutorAvailability();

  const updateMutation =
    useUpdateTutorAvailability();

  const deleteMutation =
    useDeleteTutorAvailability();

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(DEFAULT_FORM);

  const slots = Array.isArray(availability)
    ? availability
    : [];

  const sortedSlots = [...slots].sort(
    (a, b) => {
      const dayDifference =
        Number(a.day_of_week) -
        Number(b.day_of_week);

      if (dayDifference !== 0) {
        return dayDifference;
      }

      return String(
        a.start_time || ""
      ).localeCompare(
        String(b.start_time || "")
      );
    }
  );

  const isEditing = Boolean(editingId);

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  const mutationError =
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error;

  const mutationMessage =
    mutationError?.response?.data?.message ||
    mutationError?.message ||
    null;

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setShowForm(false);

    createMutation.reset();
    updateMutation.reset();
  };

  const openCreateForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setShowForm(true);

    createMutation.reset();
    updateMutation.reset();
  };

  const openEditForm = (slot) => {
    setForm({
      day_of_week: Number(
        slot.day_of_week
      ),
      start_time: String(
        slot.start_time || ""
      ).slice(0, 5),
      end_time: String(
        slot.end_time || ""
      ).slice(0, 5),
      is_active: Boolean(
        slot.is_active
      ),
    });

    setEditingId(
      slot.availability_slot_id
    );
    setShowForm(true);

    createMutation.reset();
    updateMutation.reset();
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const payload = {
      day_of_week: Number(
        form.day_of_week
      ),
      start_time: form.start_time,
      end_time: form.end_time,
      is_active: Boolean(
        form.is_active
      ),
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          availability_slot_id:
            editingId,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync(
          payload
        );
      }

      resetForm();
    } catch {
      // Mutation error is rendered below.
    }
  };

  const handleToggleActive = async (
    slot
  ) => {
    try {
      await updateMutation.mutateAsync({
        availability_slot_id:
          slot.availability_slot_id,
        data: {
          is_active:
            !slot.is_active,
        },
      });
    } catch {
      // Mutation error is rendered below.
    }
  };

  const handleDelete = async (
    slotId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this availability slot?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(
        slotId
      );

      if (editingId === slotId) {
        resetForm();
      }
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
        title="Unable to load availability"
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load your availability."
        }
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
            Availability
          </h1>

          <p className="mt-2 text-sm text-[#626770]">
            Manage your recurring lesson times.
          </p>
        </div>

        {!showForm && (
          <Button
            type="button"
            onClick={openCreateForm}
          >
            Add availability
          </Button>
        )}
      </section>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>
                  {isEditing
                    ? "Edit availability"
                    : "Add availability"}
                </CardTitle>

                <CardDescription>
                  Set the day and time students can book.
                </CardDescription>
              </div>

              {isEditing && (
                <Badge variant="secondary">
                  Editing
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid gap-5 md:grid-cols-3">
                <Select
                  id="day_of_week"
                  name="day_of_week"
                  label="Day"
                  value={form.day_of_week}
                  onChange={handleChange}
                  options={DAYS.map(
                    (day) => ({
                      value: day.value,
                      label: day.label,
                    })
                  )}
                />

                <Input
                  id="start_time"
                  name="start_time"
                  label="Start time"
                  type="time"
                  value={form.start_time}
                  onChange={handleChange}
                  required
                />

                <Input
                  id="end_time"
                  name="end_time"
                  label="End time"
                  type="time"
                  value={form.end_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-4 py-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-[#cfd3da] accent-black"
                />

                <div>
                  <p className="text-sm font-medium text-black">
                    Active
                  </p>

                  <p className="mt-0.5 text-xs text-[#6b7280]">
                    Students can book this time.
                  </p>
                </div>
              </label>

              {mutationMessage && (
                <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
                  <p className="text-sm text-[#93000a]">
                    {mutationMessage}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-[#e5e7eb] pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSaving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={
                    isSaving ||
                    !form.start_time ||
                    !form.end_time
                  }
                >
                  {isSaving
                    ? "Saving..."
                    : isEditing
                    ? "Save changes"
                    : "Add availability"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Schedule */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>
                Weekly schedule
              </CardTitle>

              <CardDescription>
                Your recurring teaching slots.
              </CardDescription>
            </div>

            {slots.length > 0 && (
              <p className="text-sm text-[#626770]">
                <span className="font-medium text-black">
                  {slots.length}
                </span>{" "}
                {slots.length === 1
                  ? "slot"
                  : "slots"}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {sortedSlots.length === 0 ? (
            <EmptyState
              title="No availability yet"
              message="Add your first recurring lesson slot."
              action={
                <Button
                  type="button"
                  onClick={openCreateForm}
                >
                  Add availability
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {sortedSlots.map(
                (slot) => (
                  <div
                    key={
                      slot.availability_slot_id
                    }
                    className="flex flex-col gap-4 rounded-lg border border-[#e5e7eb] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#f0f3ff] text-xs font-semibold text-[#3949ab]">
                        {getDayShortName(
                          slot.day_of_week
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-black">
                            {getDayName(
                              slot.day_of_week
                            )}
                          </p>

                          <Badge variant="secondary">
                            {slot.is_active
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                        </div>

                        <p className="mt-1 text-sm text-[#626770]">
                          {formatTime(
                            slot.start_time
                          )}{" "}
                          –{" "}
                          {formatTime(
                            slot.end_time
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleToggleActive(
                            slot
                          )
                        }
                        disabled={
                          updateMutation.isPending
                        }
                      >
                        {slot.is_active
                          ? "Deactivate"
                          : "Activate"}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          openEditForm(
                            slot
                          )
                        }
                        disabled={
                          updateMutation.isPending ||
                          deleteMutation.isPending
                        }
                      >
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDelete(
                            slot.availability_slot_id
                          )
                        }
                        disabled={
                          deleteMutation.isPending
                        }
                      >
                        {deleteMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {deleteMutation.error && (
            <div className="mt-4 rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
              <p className="text-sm text-[#93000a]">
                {deleteMutation.error?.response?.data
                  ?.message ||
                  deleteMutation.error?.message ||
                  "Unable to delete availability."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorAvailabilityPage;