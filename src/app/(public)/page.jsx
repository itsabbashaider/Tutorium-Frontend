"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  tutor1,
  tutor2,
  tutor3,
  tutor4,
} from "@/assets/images/tutor";

import { useAuth } from "@/hooks";
import { getLoginRedirectUrl } from "@/utils/auth/auth.util";

const featuredTutors = [
  {
    name: "Sarah Jenkins",
    title: "Ph.D. Quantum Physics, MIT",
    subjects: ["Physics", "Calculus"],
    rating: "5.0",
    rate: "$85",
    image: tutor1,
  },
  {
    name: "Michael Zhao",
    title: "Senior Engineer at Google",
    subjects: ["Python", "React"],
    rating: "4.9",
    rate: "$120",
    image: tutor2,
  },
  {
    name: "Elena Rossi",
    title: "MBA, Stanford University",
    subjects: ["Business", "Finance"],
    rating: "5.0",
    rate: "$150",
    image: tutor3,
  },
  {
    name: "David Kim",
    title: "Creative Director, Art Center",
    subjects: ["UI/UX", "Design"],
    rating: "4.8",
    rate: "$95",
    image: tutor4,
  },
];

const features = [
  {
    title: "Vetted Tutors",
    description:
      "Find experienced educators whose expertise and teaching background are built around real learning outcomes.",
    icon: "✓",
  },
  {
    title: "Flexible Scheduling",
    description:
      "Discover recurring availability and book sessions that fit your schedule and timezone.",
    icon: "◷",
  },
  {
    title: "Focused Learning",
    description:
      "Get one-on-one instruction built around your subject, goals, pace, and preferred teaching style.",
    icon: "↗",
  },
];

export default function HomePage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const navigateToTutors = (query = "") => {
    if (authLoading) {
      return;
    }

    const normalizedQuery = query.trim();

    const destination = normalizedQuery
      ? `/tutor?search=${encodeURIComponent(
          normalizedQuery
        )}`
      : "/tutor";

    if (isAuthenticated) {
      router.push(destination);
      return;
    }

    router.push(
      getLoginRedirectUrl(destination)
    );
  };

  const handleSearch = (event) => {
    event.preventDefault();

    navigateToTutors(search);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27]">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e5e7eb]/80 bg-[#f9f9ff]/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-16">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-[20px] font-bold tracking-tight text-black"
            >
              Tutorium
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              <a
                href="#find-tutors"
                className="rounded-lg px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Find Tutors
              </a>

              <a
                href="#how-it-works"
                className="rounded-lg px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
              >
                How it works
              </a>

              <a
                href="#featured-tutors"
                className="rounded-lg px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
              >
                Featured Tutors
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#626770] transition-colors hover:bg-white hover:text-black"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#222] active:scale-[0.98]"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      <main className="overflow-x-hidden pt-16">
        {/* Hero */}
        <section 
          id="find-tutors"
          className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_-20%,#e7eefe_0%,#f9f9ff_52%)] px-4 pb-20 pt-20 sm:px-6 md:pt-28 lg:px-16 lg:pb-28">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-72 w-xl -translate-x-1/2 rounded-full bg-[#b3c5ff]/20 blur-3xl"
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-[-0.04em] text-black sm:text-5xl md:text-[52px] md:leading-[1.08]">
              Master any subject with
              <span className="text-[#003fa4]">
                {" "}
                the right tutor.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#5c5f60] sm:text-lg">
              Discover experienced tutors, explore
              availability, and book focused
              one-on-one lessons built around your
              goals.
            </p>

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-10 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-[#cfc4c5] bg-white p-2 shadow-[0_12px_36px_rgba(21,28,39,0.08)] md:flex-row"
            >
              <div className="flex min-h-12 flex-1 items-center rounded-xl border border-transparent bg-[#f0f3ff] px-4 transition focus-within:border-[#7e7576]">
                <span
                  aria-hidden="true"
                  className="mr-3 text-lg text-[#5c5f60]"
                >
                  ⌕
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search by subject, skill, or tutor name..."
                  aria-label="Search for tutors"
                  className="h-12 w-full border-none bg-transparent text-sm text-[#151c27] outline-none placeholder:text-[#8a8e95] focus:ring-0"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="min-h-12 rounded-xl bg-black px-8 text-sm font-semibold text-white transition hover:bg-[#222] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Find Tutors
              </button>
            </form>
          </div>
        </section>

        {/* Feature Bento */}
        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-16 lg:py-20"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="group overflow-hidden rounded-xl border border-[#cfc4c5] bg-white md:col-span-2">
              <div className="grid min-h-70 md:grid-cols-2">
                <div className="flex flex-col justify-between p-6 sm:p-8">
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#cfc4c5] bg-[#e7eefe] text-lg font-bold text-black">
                      ✓
                    </div>

                    <h2 className="text-xl font-semibold tracking-tight text-black">
                      Vetted Tutors
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-[#5c5f60]">
                      Find educators with relevant
                      experience, subject expertise, and
                      teaching styles that match your goals.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateToTutors()}
                    disabled={authLoading}
                    className="mt-8 w-fit text-sm font-semibold text-[#003fa4] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Explore tutors →
                  </button>
                </div>

                <div className="relative min-h-64 overflow-hidden bg-[#e7eefe]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,transparent_40%)]" />

                  <div className="absolute left-8 top-8 rounded-xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur">
                    <p className="text-xs font-medium text-[#5c5f60]">
                      Expertise
                    </p>

                    <p className="mt-1 text-sm font-semibold text-black">
                      Subject-focused
                    </p>
                  </div>

                  <div className="absolute bottom-8 right-8 rounded-xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur">
                    <p className="text-xs font-medium text-[#5c5f60]">
                      Learning
                    </p>

                    <p className="mt-1 text-sm font-semibold text-black">
                      One-on-one
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="flex flex-col rounded-xl border border-[#cfc4c5] bg-white p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#cfc4c5] bg-[#e7eefe] text-lg font-semibold text-black">
                ◷
              </div>

              <h2 className="mt-6 text-xl font-semibold tracking-tight text-black">
                Flexible Scheduling
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#5c5f60]">
                See recurring tutor availability and
                choose lesson times that work for you.
              </p>

              <div className="mt-auto pt-8">
                <div className="flex items-center justify-between rounded-xl border border-[#cfc4c5] bg-[#f0f3ff] px-4 py-3">
                  <span className="text-xs text-[#5c5f60]">
                    Availability
                  </span>

                  <span className="text-xs font-semibold text-black">
                    Weekly schedule
                  </span>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-[#cfc4c5] bg-white p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#cfc4c5] bg-[#e7eefe] text-lg font-semibold text-black">
                ↗
              </div>

              <h2 className="mt-6 text-xl font-semibold tracking-tight text-black">
                Focused Learning
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#5c5f60]">
                Build each session around your subject,
                goals, pace, and preferred teaching mode.
              </p>
            </article>

            <article className="relative overflow-hidden rounded-xl bg-[#1b1b1b] p-7 text-white md:col-span-2 sm:p-8">
              <div className="relative z-10 max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b3c5ff]">
                  Find your next tutor
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  Ready to level up?
                </h2>

                <p className="mt-3 max-w-lg text-base leading-7 text-[#c6c6c6]">
                  Search by subject, skill, city, or tutor
                  profile and find a lesson that fits.
                </p>

                <button
                  type="button"
                  onClick={() => navigateToTutors()}
                  disabled={authLoading}
                  className="mt-7 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e7eefe] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Browse Tutors
                </button>
              </div>

              <div
                aria-hidden="true"
                className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#447cff]/20 blur-3xl"
              />

              <div
                aria-hidden="true"
                className="absolute -bottom-28 right-16 h-52 w-52 rounded-full bg-[#dae1ff]/10 blur-3xl"
              />
            </article>
          </div>
        </section>

        {/* Featured tutors */}
        <section
          id="featured-tutors"
          className="bg-[#f0f3ff] px-4 py-16 sm:px-6 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black">
                  Meet tutors worth learning from.
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#5c5f60]">
                  Explore a few featured profiles, then
                  discover the full tutor marketplace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigateToTutors()}
                disabled={authLoading}
                className="w-fit text-sm font-semibold text-[#003fa4] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                View all tutors →
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredTutors.map((tutor) => (
                <article
                  key={tutor.name}
                  className="group overflow-hidden rounded-xl border border-[#cfc4c5] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#b9b1b2] hover:shadow-[0_8px_24px_rgba(21,28,39,0.08)]"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-[#e7eefe]">
                    <Image
                      src={tutor.image}
                      alt={tutor.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute right-3 top-3 rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-xs font-semibold text-black shadow-sm backdrop-blur">
                      ★ {tutor.rating}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold tracking-tight text-black">
                      {tutor.name}
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-[#5c5f60]">
                      {tutor.title}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {tutor.subjects.map(
                        (subject) => (
                          <span
                            key={subject}
                            className="rounded-full bg-[#e7eefe] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#4c4546]"
                          >
                            {subject}
                          </span>
                        )
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#e5e7eb] pt-4">
                      <span className="text-lg font-bold text-black">
                        {tutor.rate}

                        <span className="ml-1 text-xs font-normal text-[#5c5f60]">
                          /hr
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => navigateToTutors()}
                        disabled={authLoading}
                        className="text-sm font-semibold text-[#003fa4] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        View tutors
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#dce2f3] px-4 py-20 sm:px-6 lg:px-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Find a tutor who fits your goals.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#5c5f60]">
              Explore tutors, compare their expertise, and
              request a lesson when you are ready.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-xl bg-black px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#222] active:scale-[0.98]"
              >
                Get Started
              </Link>

              <a
                href="mailto:support@tutorium.com"
                className="rounded-xl border border-[#cfc4c5] bg-white px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-[#f9f9ff]"
              >
                Contact Tutorium
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#cfc4c5] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-16">
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-black"
            >
              Tutorium
            </Link>

            <p className="mt-1 text-sm text-[#5c5f60]">
              Premium learning marketplace
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            <Link
              href="/about"
              className="text-xs font-semibold text-[#5c5f60] hover:text-black"
            >
              About
            </Link>

            <a
              href="mailto:support@tutorium.com"
              className="text-xs font-semibold text-[#5c5f60] hover:text-black"
            >
              Contact
            </a>

            <Link
              href="/privacy"
              className="text-xs font-semibold text-[#5c5f60] hover:text-black"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-xs font-semibold text-[#5c5f60] hover:text-black"
            >
              Terms
            </Link>
          </div>

          <p className="text-xs text-[#5c5f60]">
            © 2026 Tutorium
          </p>
        </div>
      </footer>
    </div>
  );
}