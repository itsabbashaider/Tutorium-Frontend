"use client";

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
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() =>
          goToPage(currentPage - 1)
        }
        disabled={currentPage === 1}
        className="rounded-md border border-[#e5e7eb] bg-white px-3.5 py-2 text-sm font-medium text-[#151c27] transition hover:bg-[#f0f3ff] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            aria-current={
              page === currentPage
                ? "page"
                : undefined
            }
            className={[
              "flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition",
              page === currentPage
                ? "bg-black text-white"
                : "text-[#5c5f60] hover:bg-[#f0f3ff] hover:text-black",
            ].join(" ")}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          goToPage(currentPage + 1)
        }
        disabled={
          currentPage === totalPages
        }
        className="rounded-md border border-[#e5e7eb] bg-white px-3.5 py-2 text-sm font-medium text-[#151c27] transition hover:bg-[#f0f3ff] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;