"use client";

import { useSearchParams } from "next/navigation";

import { TutorList } from "@/components/tutor";

export default function TutorPage() {
const searchParams = useSearchParams();

const search = searchParams.get("search") || "";
const city = searchParams.get("city") || "";

return (
<main className="min-h-screen max-w-6xl bg-[#f8f7f7]  sm:px-6 ">
<div className="mx-auto max-w-7xl">
<div>
<h1 className="text-3xl font-bold text-black">
Find a Tutor
</h1>
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