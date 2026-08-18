"use client";

import { useState } from "react";

import {
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
} from "@/components/common";

import {
  useAddTutorSubjects,
  useRemoveTutorSubject,
  useSearchSubjects,
  useTutorSubjects,
} from "@/hooks";

const TutorSubjectsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] =
    useState(null);

  const {
    data: subjects = [],
    isLoading,
    isError,
    error,
  } = useTutorSubjects();

  const {
    data: suggestions = [],
    isLoading: isSearching,
  } = useSearchSubjects(search);

  const addMutation =
    useAddTutorSubjects();

  const removeMutation =
    useRemoveTutorSubject();

  const isAlreadyAssigned = (subjectId) => {
    return subjects.some(
      (subject) =>
        subject.subject_id === subjectId
    );
  };

  const handleSelect = (subject) => {
    if (
      !subject?.subject_id ||
      isAlreadyAssigned(subject.subject_id)
    ) {
      return;
    }

    setSelectedSubject(subject);
    setSearch(subject.subject_name);
  };

  const handleAdd = async (event) => {
    event.preventDefault();

    if (!selectedSubject?.subject_id) {
      return;
    }

    try {
      await addMutation.mutateAsync({
        subject_ids: [
          selectedSubject.subject_id,
        ],
      });

      setSearch("");
      setSelectedSubject(null);
    } catch {
      // Error rendered below.
    }
  };

  const handleRemove = async (subjectId) => {
    try {
      await removeMutation.mutateAsync(
        subjectId
      );
    } catch {
      // Error rendered below.
    }
  };

  const addError =
    addMutation.error?.response?.data
      ?.message ||
    addMutation.error?.message ||
    null;

  const removeError =
    removeMutation.error?.response?.data
      ?.message ||
    removeMutation.error?.message ||
    null;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load subjects"
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load your subjects."
        }
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <section>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-black">
              Subjects
            </h1>

            <p className="mt-2 text-sm text-[#626770]">
              Manage the subjects you teach.
            </p>
          </div>

          <p className="text-sm text-[#626770]">
            <span className="font-medium text-black">
              {subjects.length}
            </span>{" "}
            {subjects.length === 1
              ? "subject"
              : "subjects"}
          </p>
        </div>
      </section>

      {/* Add subject */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>
            Add a subject
          </CardTitle>

          <CardDescription>
            Search for a subject and add it to your profile.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleAdd}
            className="space-y-4"
          >
            <div className="relative">
              <Input
                id="subject"
                label="Subject"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedSubject(null);
                  addMutation.reset();
                }}
                placeholder="Search subjects..."
                autoComplete="off"
                error={addError}
              />

              {search.trim() &&
                !selectedSubject && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
                    {isSearching ? (
                      <div className="px-4 py-3 text-sm text-[#626770]">
                        Searching...
                      </div>
                    ) : suggestions.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-[#626770]">
                        No subjects found.
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto">
                        {suggestions.map(
                          (subject) => {
                            const assigned =
                              isAlreadyAssigned(
                                subject.subject_id
                              );

                            return (
                              <button
                                key={
                                  subject.subject_id
                                }
                                type="button"
                                disabled={
                                  assigned
                                }
                                onClick={() =>
                                  handleSelect(
                                    subject
                                  )
                                }
                                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <span className="font-medium text-black">
                                  {
                                    subject.subject_name
                                  }
                                </span>

                                {assigned && (
                                  <span className="text-xs text-[#8a8e95]">
                                    Added
                                  </span>
                                )}
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                )}
            </div>

            {selectedSubject && (
              <div className="flex items-center justify-between rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-4 py-3">
                <div>
                  <p className="text-xs text-[#8a8e95]">
                    Selected
                  </p>

                  <p className="mt-1 text-sm font-medium text-black">
                    {
                      selectedSubject.subject_name
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubject(null);
                    setSearch("");
                  }}
                  className="text-sm font-medium text-[#5c5f60] hover:text-black"
                >
                  Clear
                </button>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  addMutation.isPending ||
                  !selectedSubject
                }
              >
                {addMutation.isPending
                  ? "Adding..."
                  : "Add subject"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>
            Your subjects
          </CardTitle>

          <CardDescription>
            Subjects currently shown on your tutor profile.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {subjects.length === 0 ? (
            <EmptyState
              title="No subjects yet"
              message="Add the subjects you teach to make your profile easier to discover."
            />
          ) : (
            <div className="divide-y divide-[#e5e7eb]">
              {subjects.map((subject) => (
                <div
                  key={subject.subject_id}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-black">
                      {subject.subject_name}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleRemove(subject.subject_id)
                    }
                    disabled={removeMutation.isPending}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {removeError && (
            <div className="mt-4 rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
              <p className="text-sm text-[#93000a]">
                {removeError}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorSubjectsPage;