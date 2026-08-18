"use client";

import { useState } from "react";

import {
  EmptyState,
  ErrorState,
  Loading,
  Pagination,
} from "../common";

import TutorCard from "./card.tutor";
import TutorSearch from "./search.tutor";

import { useTutors } from "../../hooks/tutor/use-tutor.hook";

const TutorList = ({
  search = "",
}) => {
  const [filters, setFilters] = useState({
    search,
    page: 1,
  });

  const {
    data,
    isLoading,
    isError,
    error,
  } = useTutors(filters);

  const tutors = Array.isArray(data?.tutors)
    ? data.tutors
    : [];

  const pagination = data?.pagination ?? {};

  const currentPage =
    pagination.currentPage ??
    filters.page ??
    1;

  const totalPages =
    pagination.totalPages ?? 1;

  const handleSearch = (values) => {
    setFilters({
      search: values.search || "",
      page: 1,
    });
  };

  const handlePageChange = (page) => {
    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load tutors"
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while loading tutors."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <TutorSearch
        initialSearch={filters.search}
        onSearch={handleSearch}
      />

      {tutors.length === 0 ? (
        <EmptyState
          title="No tutors found"
          message="Try a tutor name, subject, or city."
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <TutorCard
                key={
                  tutor.tutor_profile_id ||
                  tutor.id
                }
                tutor={tutor}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TutorList;