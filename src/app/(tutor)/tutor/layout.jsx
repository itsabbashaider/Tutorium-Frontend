"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useAuth,
} from "@/hooks";

const navigation = [
  {
    label: "Main",
    items: [
      {
        label: "Find Tutors",
        href: "/tutor",
      },
      {
        label: "Dashboard",
        href: "/tutor/dashboard",
      },
    ],
  },
  {
    label: "Teaching",
    items: [
      {
        label: "Subjects",
        href: "/tutor/subjects",
      },
      {
        label: "Availability",
        href: "/tutor/availability",
      },
      {
        label: "Bookings",
        href: "/tutor/bookings",
      },
      {
        label: "Reviews",
        href: "/tutor/reviews",
      },
    ],
  },
];

const isActiveRoute = (pathname, href) => {
  if (href === "/tutor") {
    return pathname === "/tutor";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
};

const TutorLayout = ({ children }) => {
  const pathname = usePathname();
  const profileMenuRef = useRef(null);

const { user, logout } = useAuth();

  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);

  const currentPage =
    navigation
      .flatMap((section) => section.items)
      .find((item) =>
        isActiveRoute(pathname, item.href)
      )?.label || "Tutor";

  const userName =
    user?.full_name || "Tutor";

  const userEmail =
    user?.email || "";

  const userRole =
    user?.role || "Tutor";

  const userInitial =
    userName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          event.target
        )
      ) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [profileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-black">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-[#e5e7eb] bg-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            {/* Brand */}
            <div className="flex min-h-16 items-center border-b border-[#e5e7eb] px-5">
              <p
                href="/tutor/dashboard"
                className="text-xl font-bold tracking-tight text-black"
              >
                Tutorium
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-5">
              <div className="space-y-7">
                {navigation.map((section) => (
                  <section key={section.label}>
                    <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9aa0a8]">
                      {section.label}
                    </p>

                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const active =
                          isActiveRoute(
                            pathname,
                            item.href
                          );

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            aria-current={
                              active
                                ? "page"
                                : undefined
                            }
                            className={`flex min-h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                              active
                                ? "bg-black text-white"
                                : "text-[#5d636b] hover:bg-[#f4f5f7] hover:text-black"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </nav>

            {/* Account Menu */}
            <div
              ref={profileMenuRef}
              className="relative border-t border-[#e5e7eb] p-3"
            >
              {profileMenuOpen && (
                <div className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.10)]">
                  <div className="border-b border-[#e5e7eb] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-sm font-semibold text-[#3949ab]">
                        {userInitial}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-black">
                          {userName}
                        </p>

                        {userEmail && (
                          <p className="truncate text-xs text-[#8a8e95]">
                            {userEmail}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-[#8a8e95]">
                      {userRole}
                    </p>
                  </div>

                  <div className="p-1">
                    <Link
                      href="/tutor/settings"
                      onClick={() =>
                        setProfileMenuOpen(false)
                      }
                      className="flex min-h-10 items-center rounded-lg px-3 text-sm font-medium text-[#5d636b] transition-colors hover:bg-[#f4f5f7] hover:text-black"
                    >
                      Settings
                    </Link>

                    <button
                      type="button"
                      onClick={async () => {
                        setProfileMenuOpen(false);
                        await logout();
                      }}
                      className="flex min-h-10 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-[#5d636b] transition-colors hover:bg-[#f4f5f7] hover:text-black"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setProfileMenuOpen(
                    (current) => !current
                  )
                }
                aria-expanded={profileMenuOpen}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#f4f5f7]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0f3ff] text-sm font-semibold text-[#3949ab]">
                  {userInitial}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-black">
                    {userName}
                  </p>

                  <p className="truncate text-xs text-[#8a8e95]">
                    {userRole}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className={`text-sm text-[#8a8e95] transition-transform ${
                    profileMenuOpen
                      ? "rotate-90"
                      : ""
                  }`}
                >
                  ›
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-20 min-h-16 border-b border-[#e5e7eb] bg-white">
            <div className="flex min-h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <h1 className="text-sm font-semibold text-black">
                {currentPage}
              </h1>

              {/* Mobile Account */}
              <div className="relative lg:hidden">
                <button
                  type="button"
                  onClick={() =>
                    setProfileMenuOpen(
                      (current) => !current
                    )
                  }
                  aria-expanded={profileMenuOpen}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f3ff] text-sm font-semibold text-[#3949ab] transition-colors hover:bg-[#e8ebff]"
                >
                  {userInitial}
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.10)]">
                    <div className="border-b border-[#e5e7eb] px-4 py-3">
                      <p className="text-sm font-semibold text-black">
                        {userName}
                      </p>

                      {userEmail && (
                        <p className="mt-1 truncate text-xs text-[#8a8e95]">
                          {userEmail}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-[#8a8e95]">
                        {userRole}
                      </p>
                    </div>

                    <div className="p-1">
                      <Link
                        href="/tutor/settings"
                        onClick={() =>
                          setProfileMenuOpen(false)
                        }
                        className="flex min-h-10 items-center rounded-lg px-3 text-sm text-[#5d636b] hover:bg-[#f4f5f7] hover:text-black"
                      >
                        Settings
                      </Link>

                      <button
                        type="button"
                        onClick={async () => {
                          setProfileMenuOpen(false);
                          await logout();
                        }}
                        className="flex min-h-10 w-full items-center rounded-lg px-3 text-left text-sm text-[#5d636b] hover:bg-[#f4f5f7] hover:text-black"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TutorLayout;