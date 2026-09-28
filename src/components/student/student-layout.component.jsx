"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  CalendarCheck,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

import { useAuth, useStudentProfile } from "@/hooks";
import { UserAvatar, ConfirmModal } from "@/components/common";

const isActiveRoute = (pathname, href) => {
  if (!href) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
};

const StudentLayoutComponent = ({ children, studentId }) => {
  const pathname = usePathname();
  const routeParams = useParams();
  const profileMenuRef = useRef(null);

  const { user, logout } = useAuth();
  const isSessionActive = Boolean(user && user.role === "STUDENT");

  const { data: studentProfile } = useStudentProfile({
    enabled: isSessionActive,
  });

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const routeStudentId =
    routeParams?.student_id !== "undefined"
      ? routeParams?.student_id
      : undefined;

  const currentStudentId =
    routeStudentId ||
    studentId ||
    user?.student_profile_id ||
    user?.student_id ||
    user?.user_id ||
    user?.id;

  const navigation = useMemo(() => {
    const basePath = currentStudentId
      ? `/student/${currentStudentId}`
      : "/student";

    return [
      {
        label: "Main",
        items: [
          { label: "Find Tutors", href: "/tutor", icon: Compass },
          { label: "Dashboard", href: `${basePath}/dashboard`, icon: LayoutDashboard },
        ],
      },
      {
        label: "Teaching",
        items: [
          { label: "Bookings", href: `${basePath}/bookings`, icon: CalendarCheck },
          { label: "Reviews", href: `${basePath}/reviews`, icon: Star },
        ],
      },
    ];  
  }, [currentStudentId]);

  const currentPage =
    navigation
      .flatMap((section) => section.items)
      .find((item) => isActiveRoute(pathname, item.href))?.label || "Student";

  const studentUser = studentProfile?.user ?? studentProfile?.Student?.user ?? null;
  const studentAvatarUrl =
    studentProfile?.avatar_url || studentUser?.avatar_url || user?.avatar_url || null;

  const userName = studentUser?.full_name || user?.full_name || "Student";
  const userEmail = studentUser?.email || user?.email || "";
  const userRole = user?.role || "STUDENT";

  const settingsHref = currentStudentId
    ? `/student/${currentStudentId}/settings`
    : "/student/settings";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileNavOpen(false);
  }, [pathname]);

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-black">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-[#e5e7eb] bg-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            {/* Brand */}
            <div className="flex min-h-16 items-center gap-2.5 border-b border-[#e5e7eb] px-5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                <GraduationCap className="h-4.5 w-4.5" />
              </div>

              <Link
                href={
                  currentStudentId
                    ? `/student/${currentStudentId}/dashboard`
                    : "/"
                }
                className="text-lg font-bold tracking-tight text-black"
              >
                Tutorium
              </Link>
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
                        const active = isActiveRoute(pathname, item.href);
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={`flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors ${
                              active
                                ? "bg-black text-white"
                                : "text-[#5d636b] hover:bg-[#f4f5f7] hover:text-black"
                            }`}
                          >
                            {Icon && (
                              <Icon
                                className={`h-4 w-4 shrink-0 ${
                                  active ? "text-white" : "text-[#9aa0a8]"
                                }`}
                              />
                            )}
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
                      <UserAvatar
                        avatarUrl={studentAvatarUrl}
                        name={userName}
                        size="md"
                        className="h-9 w-9"
                      />

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

                    <p className="mt-3 text-xs text-[#8a8e95]">{userRole}</p>
                  </div>

                  <div className="p-1">
                    <Link
                      href={settingsHref}
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-[#5d636b] transition-colors hover:bg-[#f4f5f7] hover:text-black"
                    >
                      <Settings className="h-4 w-4 text-[#9aa0a8]" />
                      Settings
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm font-medium text-danger transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 text-danger" />
                      Logout
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setProfileMenuOpen((current) => !current)}
                aria-expanded={profileMenuOpen}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#f4f5f7]"
              >
                <UserAvatar
                  avatarUrl={studentAvatarUrl}
                  name={userName}
                  size="md"
                  className="h-9 w-9"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-black">
                    {userName}
                  </p>
                  <p className="truncate text-xs text-[#8a8e95]">{userRole}</p>
                </div>

                <ChevronRight
                  aria-hidden="true"
                  className={`h-4 w-4 shrink-0 text-[#9aa0a8] transition-transform ${
                    profileMenuOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile nav overlay */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileNavOpen(false)}
            />

            <div className="relative flex h-full w-72 max-w-[80vw] flex-col bg-white shadow-xl">
              <div className="flex min-h-16 items-center justify-between border-b border-[#e5e7eb] px-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                    <GraduationCap className="h-4.5 w-4.5" />
                  </div>

                  <span className="text-lg font-bold tracking-tight text-black">
                    Tutorium
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5d636b] transition-colors hover:bg-[#f4f5f7] hover:text-black"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-5">
                <div className="space-y-7">
                  {navigation.map((section) => (
                    <section key={section.label}>
                      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9aa0a8]">
                        {section.label}
                      </p>

                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const active = isActiveRoute(pathname, item.href);
                          const Icon = item.icon;

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              aria-current={active ? "page" : undefined}
                              className={`flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors ${
                                active
                                  ? "bg-black text-white"
                                  : "text-[#5d636b] hover:bg-[#f4f5f7] hover:text-black"
                              }`}
                            >
                              {Icon && (
                                <Icon
                                  className={`h-4 w-4 shrink-0 ${
                                    active ? "text-white" : "text-[#9aa0a8]"
                                  }`}
                                />
                              )}
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Main Workspace */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-20 min-h-16 border-b border-[#e5e7eb] bg-white/95 backdrop-blur-sm">
            <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(true)}
                  aria-label="Open menu"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#5d636b] transition-colors hover:bg-[#f4f5f7] hover:text-black lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <h1 className="truncate text-base font-semibold tracking-tight text-black sm:text-lg">
                  {currentPage}
                </h1>
              </div>

              {/* Mobile Account */}
              <div className="relative shrink-0 lg:hidden">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((current) => !current)}
                  aria-expanded={profileMenuOpen}
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:opacity-80"
                >
                  <UserAvatar
                    avatarUrl={studentAvatarUrl}
                    name={userName}
                    size="md"
                    className="h-9 w-9"
                  />
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
                      <p className="mt-2 text-xs text-[#8a8e95]">{userRole}</p>
                    </div>

                    <div className="p-1">
                      <Link
                        href={settingsHref}
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm text-[#5d636b] hover:bg-[#f4f5f7] hover:text-black"
                      >
                        <Settings className="h-4 w-4 text-[#9aa0a8]" />
                        Settings
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          setShowLogoutModal(true);
                        }}
                        className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm text-danger hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 text-danger" />
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
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>

      {/* Reusable Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Are you sure you want to logout?"
        message="You will need to login again."
        confirmText="Logout"
        variant="danger"
      />
    </div>
  );
};

export default StudentLayoutComponent;