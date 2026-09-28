"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  Button,
  Card,
  CardContent,
  EmptyState,
  ErrorState,
  Loading,
  Pagination,
} from "@/components/common";

import TutorCard from "@/components/tutor/card-tutor.component";

import StudentCreateBookingModal from "@/components/student/create-booking-modal.component";

import { useSearchSubjects, useStudentRouteId, useTutors } from "@/hooks";

import { normalizeTutor } from "@/utils";

const PAGE_SIZE = 10;

const StudentCreateBookingsPage = () => {
  const studentId = useStudentRouteId();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedSubject, setSelectedSubject] = useState(null);

  const [bookingTutor, setBookingTutor] = useState(null);

  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [selectedSubject]);

  const {
    data: subjectSuggestions = [],
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
    error: subjectsError,
  } = useSearchSubjects(debouncedSearch, {
    enabled: Boolean(debouncedSearch) && !selectedSubject,
  });

  const {
    data: tutorData,
    isLoading: isTutorsLoading,
    isError: isTutorsError,
    error: tutorsError,
    isFetching: isTutorsFetching,
  } = useTutors(
    {
      subject: selectedSubject?.subject_name || "",
      page,
      limit: PAGE_SIZE,
      sort_by: "top_rated",
    },
    {
      enabled: Boolean(selectedSubject?.subject_name),
    },
  );

  const {
    data: topTutorData,
    isLoading: isTopTutorsLoading,
    isError: isTopTutorsError,
    error: topTutorsError,
  } = useTutors(
    {
      page: 1,
      limit: PAGE_SIZE,
      sort_by: "top_rated",
    },
    {
      enabled: !selectedSubject,
    },
  );

  const tutors = Array.isArray(tutorData?.tutors)
    ? tutorData.tutors.map(normalizeTutor)
    : [];

  const topTutors = Array.isArray(topTutorData?.tutors)
    ? topTutorData.tutors.map(normalizeTutor)
    : [];

  const pagination = tutorData?.pagination ?? {};

  const currentPage = pagination.currentPage ?? page;

  const totalPages = pagination.totalPages ?? 1;

  const totalItems = pagination.totalItems ?? tutors.length;

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setSearch(subject.subject_name);
    setDebouncedSearch(subject.subject_name);
  };

  const handleClearSubject = () => {
    setSelectedSubject(null);
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  const handleBookTutor = (tutor) => {
    setBookingTutor(tutor);
  };

  const handleCloseBookingModal = () => {
    setBookingTutor(null);
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Back */}
      <div className="mb-8">
        <Link href={`/student/${studentId}/bookings`}>
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

            <span>Back to bookings</span>
          </Button>
        </Link>
      </div>

      {/* Header */}
      <section className="mb-6 border-b border-[#e5e7eb] pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
          Find a tutor
        </h1>

        <p className="mt-1 text-sm text-[#626770]">
          Search by subject or choose a top-rated tutor.
        </p>
      </section>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="p-5 sm:p-6">
          <label
            htmlFor="subject-search"
            className="text-sm font-semibold text-black"
          >
            Subject
          </label>

          <div className="relative mt-2">
            <input
              id="subject-search"
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);

                setSelectedSubject(null);
              }}
              placeholder="Search for a subject..."
              autoComplete="off"
              className="h-11 w-full rounded-lg border border-[#dfe3e8] bg-white px-3 text-sm text-black outline-none transition-colors placeholder:text-[#9aa0a8] focus:border-black"
            />

            {search && (
              <button
                type="button"
                onClick={handleClearSubject}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#626770] transition-colors hover:text-black"
              >
                Clear
              </button>
            )}

            {!selectedSubject && debouncedSearch && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
                {isSubjectsLoading ? (
                  <div className="px-4 py-3 text-sm text-[#626770]">
                    Searching subjects...
                  </div>
                ) : subjectSuggestions.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {subjectSuggestions.map((subject) => (
                      <button
                        key={subject.subject_id}
                        type="button"
                        onClick={() => handleSelectSubject(subject)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[#33373d] transition-colors hover:bg-[#f5f6f7] hover:text-black"
                      >
                        <span>{subject.subject_name}</span>

                        <span className="text-[#9aa0a8]">→</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {isSubjectsError && (
            <div className="mt-3 rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
              <p className="text-sm text-[#93000a]">
                {subjectsError?.response?.data?.message ||
                  subjectsError?.message ||
                  "Unable to search subjects."}
              </p>
            </div>
          )}

          {!isSubjectsLoading &&
            !isSubjectsError &&
            debouncedSearch &&
            !selectedSubject &&
            subjectSuggestions.length === 0 && (
              <p className="mt-3 text-sm text-[#626770]">
                No matching subjects found.
              </p>
            )}

          {selectedSubject && (
            <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                  Subject
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-black">
                  {selectedSubject.subject_name}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearSubject}
              >
                Change
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top tutors */}
      {!selectedSubject && (
        <section className="mb-8">
          {isTopTutorsError ? (
            <ErrorState
              title="Unable to load tutors"
              message={
                topTutorsError?.response?.data?.message ||
                topTutorsError?.message ||
                "Unable to load top-rated tutors."
              }
            />
          ) : isTopTutorsLoading ? (
            <Loading />
          ) : topTutors.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <EmptyState
                  title="No tutors found"
                  message="There are currently no tutors available."
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {topTutors.map((tutor) => (
                <TutorCard
                  key={tutor.tutor_profile_id}
                  tutor={tutor}
                  showBookButton
                  onBook={handleBookTutor}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Subject results */}
      {selectedSubject && (
        <section>
          <div className="mb-5 flex flex-col gap-2 border-b border-[#e5e7eb] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-black">
                Tutors for {selectedSubject.subject_name}
              </h2>

              <p className="mt-1 text-sm text-[#626770]">
                Tutors who teach this subject.
              </p>
            </div>

            <p className="text-sm text-[#626770]">
              <span className="font-medium text-black">{totalItems}</span>{" "}
              {totalItems === 1 ? "tutor" : "tutors"}
            </p>
          </div>

          {isTutorsError ? (
            <ErrorState
              title="Unable to load tutors"
              message={
                tutorsError?.response?.data?.message ||
                tutorsError?.message ||
                "Unable to load tutors for this subject."
              }
            />
          ) : isTutorsLoading ? (
            <Loading />
          ) : tutors.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <EmptyState
                  title="No tutors found"
                  message="There are currently no tutors available for this subject."
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tutors.map((tutor) => (
                <TutorCard
                  key={tutor.tutor_profile_id}
                  tutor={tutor}
                  showBookButton
                  onBook={handleBookTutor}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>
      )}

      <StudentCreateBookingModal
        isOpen={Boolean(bookingTutor)}
        tutor={bookingTutor}
        subject={selectedSubject}
        onClose={handleCloseBookingModal}
      />
    </div>
  );
};

export default StudentCreateBookingsPage;
