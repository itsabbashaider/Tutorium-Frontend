"use client";

import { useSearchParams } from "next/navigation";

import { TutorList } from "@/components/tutor";

export default function TutorPage() {
const searchParams = useSearchParams();

const search = searchParams.get("search") || "";
const city = searchParams.get("city") || "";

return (
<main className="min-h-screen bg-[#f8f7f7] px-4 py-10 sm:px-6 lg:px-8">
<div className="mx-auto max-w-7xl">
<div>
<h1 className="text-3xl font-bold text-black">
Find a Tutor
</h1>

      <p className="mt-2 text-sm text-[#5c5f60]">
        Search for tutors by subject, name, or city.
      </p>
    </div>

    <div className="mt-8">
      <TutorList
        search={search}
        city={city}
      />
    </div>
  </div>
</main>

);
}