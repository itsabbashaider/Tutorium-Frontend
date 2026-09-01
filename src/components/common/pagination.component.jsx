"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/common";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-between border-t border-[#e5e7eb] pt-5">
      <p className="text-sm text-[#626770]">
        Page{" "}
        <span className="font-medium text-black">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-medium text-black">
          {totalPages}
        </span>
      </p>

      <div className="inline-flex items-center rounded-lg border border-[#e5e7eb] bg-white p-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            goToPage(currentPage - 1)
          }
          disabled={currentPage === 1}
          className="h-9 gap-1.5 px-3"
        >
          <ChevronLeft
            aria-hidden="true"
            className="h-4 w-4"
          />

          <span className="hidden sm:inline">
            Previous
          </span>
        </Button>

        <div className="mx-1 h-5 w-px bg-[#e5e7eb]" />

        <div className="flex h-9 min-w-12 items-center justify-center px-3 text-sm font-medium text-black">
          {currentPage}
        </div>

        <div className="mx-1 h-5 w-px bg-[#e5e7eb]" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            goToPage(currentPage + 1)
          }
          disabled={
            currentPage === totalPages
          }
          className="h-9 gap-1.5 px-3"
        >
          <span className="hidden sm:inline">
            Next
          </span>

          <ChevronRight
            aria-hidden="true"
            className="h-4 w-4"
          />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;