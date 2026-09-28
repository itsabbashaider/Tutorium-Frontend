"use client";

import { useState, useRef } from "react";
import { Edit3, Trash2, Plus, CheckCircle2, XCircle } from "lucide-react";

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
  ConfirmModal
} from "@/components/common";

import {
  useCreateTutorAvailability,
  useDeleteTutorAvailability,
  useTutorAvailability,
  useUpdateTutorAvailability,
} from "@/hooks";

import {
  DAYS_OF_WEEK,
} from "@/constants";

import { formatTime } from "@/utils";

const DEFAULT_FORM = {
  day_of_week: 1,
  start_time: "09:00",
  end_time: "17:00",
  is_active: true,
};

const TutorAvailabilityPage = () => {
  const {
    data: availability = [],
    isLoading,
    isError,
    error,
  } = useTutorAvailability();

  const createMutation = useCreateTutorAvailability();
  const updateMutation = useUpdateTutorAvailability();
  const deleteMutation = useDeleteTutorAvailability();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const initialFormRef = useRef(DEFAULT_FORM);

  const [pendingPayload, setPendingPayload] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Modal & State for Toggling Status with Confirmation
  const [slotToToggle, setSlotToToggle] = useState(null);

  // Modal State for Deletion
  const [slotToDelete, setSlotToDelete] = useState(null);

  // Modal State for Cancelling Edit with Unsaved Changes
  const [showCancelModal, setShowCancelModal] = useState(false);

  const slots = Array.isArray(availability) ? availability : [];

  const sortedSlots = [...slots].sort((a, b) => {
    const dayDifference = Number(a.day_of_week) - Number(b.day_of_week);
    if (dayDifference !== 0) return dayDifference;
    return String(a.start_time || "").localeCompare(String(b.start_time || ""));
  });

  const isEditing = Boolean(editingId);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const mutationError =
    createMutation.error || updateMutation.error || deleteMutation.error;

  const mutationMessage =
    mutationError?.response?.data?.message ||
    mutationError?.message ||
    null;

  const hasFormChanged = () => {
    if (!isEditing) return true;
    return (
      Number(form.day_of_week) !== Number(initialFormRef.current.day_of_week) ||
      form.start_time !== initialFormRef.current.start_time ||
      form.end_time !== initialFormRef.current.end_time ||
      Boolean(form.is_active) !== Boolean(initialFormRef.current.is_active)
    );
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    initialFormRef.current = DEFAULT_FORM;
    setEditingId(null);
    setShowForm(false);
    setShowCancelModal(false);
    createMutation.reset();
    updateMutation.reset();
  };

  const openCreateForm = () => {
    const freshForm = DEFAULT_FORM;
    setForm(freshForm);
    initialFormRef.current = freshForm;
    setEditingId(null);
    setShowForm(true);
    createMutation.reset();
    updateMutation.reset();
  };

  const openEditForm = (slot) => {
    const formattedSlot = {
      day_of_week: Number(slot.day_of_week),
      start_time: String(slot.start_time || "").slice(0, 5),
      end_time: String(slot.end_time || "").slice(0, 5),
      is_active: Boolean(slot.is_active),
    };
    setForm(formattedSlot);
    initialFormRef.current = formattedSlot;
    setEditingId(slot.availability_slot_id);
    setShowForm(true);
    createMutation.reset();
    updateMutation.reset();
  };

  const handleCancelClick = () => {
    if (isEditing && hasFormChanged()) {
      setShowCancelModal(true);
    } else {
      resetForm();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      day_of_week: Number(form.day_of_week),
      start_time: form.start_time,
      end_time: form.end_time,
      is_active: Boolean(form.is_active),
    };

    if (editingId) {
      // If no changes were made during edit, skip confirmation modal and just close/reset
      if (!hasFormChanged()) {
        resetForm();
        return;
      }

      setPendingPayload(payload);
      setShowEditModal(true);
      return;
    }

    try {
      await createMutation.mutateAsync(payload);
      resetForm();
    } catch {
      // Handled by state
    }
  };

  const confirmUpdate = async () => {
    if (!pendingPayload || !editingId) return;
    try {
      await updateMutation.mutateAsync({
        availability_slot_id: editingId,
        data: pendingPayload,
      });
      setShowEditModal(false);
      setPendingPayload(null);
      resetForm();
    } catch {
      // Handled by state
    }
  };

  const confirmToggleActive = async () => {
    if (!slotToToggle) return;
    try {
      await updateMutation.mutateAsync({
        availability_slot_id: slotToToggle.availability_slot_id,
        data: { is_active: !slotToToggle.is_active },
      });
      setSlotToToggle(null);
    } catch {
      // Handled by state
    }
  };

  const confirmDelete = async () => {
    if (!slotToDelete) return;
    try {
      await deleteMutation.mutateAsync(slotToDelete);
      if (editingId === slotToDelete) resetForm();
      setSlotToDelete(null);
    } catch {
      // Handled by state
    }
  };

  if (isLoading) return <Loading />;

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
        </div>

        {!showForm && (
          <Button
            type="button"
            className="bg-black text-white hover:bg-gray-800 gap-2"
            onClick={openCreateForm}
          >
            <Plus className="h-4 w-4" />
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
                  {isEditing ? "Edit availability" : "Add availability"}
                </CardTitle>
                <CardDescription>
                  Set the day and time students can book.
                </CardDescription>
              </div>

              {isEditing && (
                <Badge variant="secondary">Editing</Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-3">
                <Select
                  id="day_of_week"
                  name="day_of_week"
                  label="Day"
                  value={form.day_of_week}
                  onChange={handleChange}
                  options={DAYS_OF_WEEK.map((day) => ({
                    value: day.value,
                    label: day.label,
                  }))}
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

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 accent-black"
                />
                <div>
                  <p className="text-sm font-medium text-black">Active</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Students can book this time.
                  </p>
                </div>
              </label>

              {mutationMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-danger">{mutationMessage}</p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelClick}
                  disabled={isSaving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800"
                  disabled={
                    isSaving || !form.start_time || !form.end_time
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
              <CardTitle>Weekly schedule</CardTitle>
              <CardDescription>Your recurring teaching slots.</CardDescription>
            </div>

            {slots.length > 0 && (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-black">{slots.length}</span>{" "}
                {slots.length === 1 ? "slot" : "slots"}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {sortedSlots.length === 0 ? (
            <EmptyState
              title="No availability yet"
              message="Add your first recurring lesson slot."
            />
          ) : (
            <div className="space-y-3">
              {sortedSlots.map((slot) => (
                <div
                  key={slot.availability_slot_id}
                  className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-semibold text-blue-700">
                      {DAYS_OF_WEEK.find(
                        (day) => day.value === Number(slot.day_of_week)
                      )?.short ?? "—"}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-black">
                          {DAYS_OF_WEEK.find(
                            (day) => day.value === Number(slot.day_of_week)
                          )?.label ?? "Unknown day"}
                        </p>

                        {/* Active State Badge */}
                        {slot.is_active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 border border-green-200/60 shadow-xs">
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-gray-600">
                        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                      </p>
                    </div>
                  </div>

                  {/* Icon Actions with Tooltips */}
                  <div className="flex items-center gap-2 sm:justify-end">
                    {/* Toggle Status Action Button */}
                    <div className="group relative">
                      <button
                        type="button"
                        onClick={() => setSlotToToggle(slot)}
                        disabled={updateMutation.isPending}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border shadow-xs transition-colors ${
                          slot.is_active
                            ? "border-amber-200 bg-white text-amber-600 hover:bg-amber-50"
                            : "border-green-200 bg-white text-green-600 hover:bg-green-50"
                        }`}
                        aria-label={slot.is_active ? "Deactivate slot" : "Activate slot"}
                      >
                        {slot.is_active ? (
                          <XCircle className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg">
                        {slot.is_active ? "Deactivate this" : "Activate this"}
                      </span>
                    </div>

                    {/* Edit */}
                    <div className="group relative">
                      <button
                        type="button"
                        onClick={() => openEditForm(slot)}
                        disabled={updateMutation.isPending || deleteMutation.isPending}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-xs hover:bg-gray-50 hover:text-black transition-colors"
                        aria-label="Edit slot"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg">
                        Edit this
                      </span>
                    </div>

                    {/* Delete */}
                    <div className="group relative">
                      <button
                        type="button"
                        onClick={() => setSlotToDelete(slot.availability_slot_id)}
                        disabled={deleteMutation.isPending}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 shadow-xs hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Delete slot"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg">
                        Delete
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {deleteMutation.error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-danger">
                {deleteMutation.error?.response?.data?.message ||
                  deleteMutation.error?.message ||
                  "Unable to delete availability."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Modal for Editing */}
      <ConfirmModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setPendingPayload(null);
        }}
        onConfirm={confirmUpdate}
        title="Are you sure you want to update this availability slot?"
        message="Your changes will be saved to your weekly schedule. This action cannot be undone."
        confirmText="Save changes"
        variant="primary"
        isLoading={updateMutation.isPending}
      />

      {/* Confirmation Modal for Discarding Unsaved Changes on Cancel */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={resetForm}
        title="Discard unsaved changes?"
        message="You have unsaved changes in your availability slot. Are you sure you want to cancel?"
        confirmText="Discard changes"
        variant="danger"
      />

      {/* Confirmation Modal for Toggling Active/Inactive Status */}
      <ConfirmModal
        isOpen={Boolean(slotToToggle)}
        onClose={() => setSlotToToggle(null)}
        onConfirm={confirmToggleActive}
        title={`Are you sure you want to ${
          slotToToggle?.is_active ? "deactivate" : "activate"
        } this slot?`}
        message={`This will make the slot ${
          slotToToggle?.is_active ? "unavailable" : "available"
        } for student bookings.`}
        confirmText={slotToToggle?.is_active ? "Deactivate" : "Activate"}
        variant={slotToToggle?.is_active ? "danger" : "primary"}
        isLoading={updateMutation.isPending}
      />

      {/* Confirmation Modal for Deletion */}
      <ConfirmModal
        isOpen={Boolean(slotToDelete)}
        onClose={() => setSlotToDelete(null)}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this availability slot?"
        message="This slot will be permanently removed from your weekly schedule. This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default TutorAvailabilityPage;