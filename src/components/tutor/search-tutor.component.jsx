"use client";

import { useEffect, useState } from "react";

import {
  Button,
  Input,
} from "../common";

import {
  useSearchSubjects,
  useTutors,
} from "../../hooks";

const MIN_QUERY_LENGTH = 2;

const TutorSearch = ({
  initialSearch = "",
  onSearch,
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(initialSearch);
  }, [initialSearch]);

  const query = search.trim();

  /*
   * Tutor suggestions
   */
  const {
    data: tutorData,
    isLoading: isLoadingTutors,
  } = useTutors(
    {
      search: query,
      page: 1,
      limit: 5,
    },
    {
      enabled:
        isOpen &&
        query.length >= MIN_QUERY_LENGTH,
    }
  );

  /*
   * Subject suggestions
   */
  const {
    data: subjectSuggestions = [],
    isLoading: isLoadingSubjects,
  } = useSearchSubjects(query);

  const tutors = Array.isArray(tutorData?.tutors)
    ? tutorData.tutors
    : [];

  /*
   * Cities are derived from the tutor results.
   *
   * This currently works only when the tutor API
   * returns tutors matching the search value.
   *
   * After the backend unified-search change below,
   * city suggestions will work correctly too.
   */
  const cities = [
    ...new Set(
      tutors
        .map((tutor) => tutor.city)
        .filter(Boolean)
    ),
  ];

  const subjects = Array.isArray(subjectSuggestions)
    ? subjectSuggestions
    : [];

  const isSearching =
    isLoadingTutors ||
    isLoadingSubjects;

  const hasResults =
    tutors.length > 0 ||
    cities.length > 0 ||
    subjects.length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();

    setIsOpen(false);

    onSearch?.({
      search: query,
      page: 1,
    });
  };

  const handleClear = () => {
    setSearch("");
    setIsOpen(false);

    onSearch?.({
      search: "",
      page: 1,
    });
  };

  const selectSuggestion = (value) => {
    setSearch(value);
    setIsOpen(false);

    onSearch?.({
      search: value,
      page: 1,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-[#e5e7eb] bg-white p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Input
            id="tutor-search"
            label="Search"
            value={search}
            onFocus={() => setIsOpen(true)}
            onChange={(event) => {
              setSearch(event.target.value);
              setIsOpen(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsOpen(false);
              }, 150);
            }}
            placeholder="Tutor, subject, or city..."
            autoComplete="off"
          />

          {isOpen &&
            query.length >= MIN_QUERY_LENGTH && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
                {isSearching ? (
                  <div className="px-4 py-3 text-sm text-[#626770]">
                    Searching...
                  </div>
                ) : !hasResults ? (
                  <div className="px-4 py-3 text-sm text-[#626770]">
                    No matches found.
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {/* Tutors */}
                    {tutors.length > 0 && (
                      <div>
                        <p className="border-b border-[#f0f1f3] px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#8a8e95]">
                          Tutors
                        </p>

                        {tutors.map((tutor) => (
                          <button
                            key={tutor.tutor_profile_id}
                            type="button"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              selectSuggestion(
                                tutor.full_name
                              );
                            }}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-[#f9fafb]"
                          >
                            <span className="text-sm font-medium text-black">
                              {tutor.full_name}
                            </span>

                            {tutor.city && (
                              <span className="text-xs text-[#8a8e95]">
                                {tutor.city}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Subjects */}
                    {subjects.length > 0 && (
                      <div>
                        <p className="border-t border-b border-[#f0f1f3] px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#8a8e95]">
                          Subjects
                        </p>

                        {subjects.map((subject) => {
                          const value =
                            subject.subject_name ||
                            subject.name ||
                            "";

                          return (
                            <button
                              key={subject.subject_id}
                              type="button"
                              onMouseDown={(event) => {
                                event.preventDefault();
                                selectSuggestion(value);
                              }}
                              className="w-full px-4 py-3 text-left text-sm font-medium text-black transition hover:bg-[#f9fafb]"
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Cities */}
                    {cities.length > 0 && (
                      <div>
                        <p className="border-t border-b border-[#f0f1f3] px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#8a8e95]">
                          Cities
                        </p>

                        {cities.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              selectSuggestion(city);
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-medium text-black transition hover:bg-[#f9fafb]"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            variant="outline"
            className="flex-1 transition-colors hover:border-black hover:bg-black hover:text-white sm:flex-none"
          >
            Search
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="flex-1 transition-colors hover:border-black hover:bg-black hover:text-white sm:flex-none"
          >
            Clear
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TutorSearch;