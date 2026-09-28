"use client";

import { createContext, useContext } from "react";
import { useParams } from "next/navigation";

import { Loading } from "@/components/common";
import { useAuth } from "@/hooks";

import StudentLayoutComponent from "@/components/student/student-layout.component";
import TutorLayoutComponent from "@/components/tutor/tutor-layout.component";

const PublicRoleContext = createContext(null);

export const usePublicRole = () => {
  return useContext(PublicRoleContext);
};

const PublicLayout = ({ children }) => {
  const { user, isLoading } = useAuth();
  const params = useParams();

  if (isLoading) {
    return <Loading />;
  }

  const role = String(user?.role || "")
    .trim()
    .toUpperCase();

  const content = (
    <PublicRoleContext.Provider value={role}>
      {children}
    </PublicRoleContext.Provider>
  );

  // Extract student ID from route params, or fallback to authenticated user's ID
  const studentId =
    params?.student_id ||
    user?.student_profile_id ||
    user?.student_id ||
    user?.user_id ||
    user?.id;

  if (role === "STUDENT") {
    return (
      <StudentLayoutComponent studentId={studentId}>
        {content}
      </StudentLayoutComponent>
    );
  }

  if (role === "TUTOR") {
    return (
      <TutorLayoutComponent tutorId={user?.tutor_id || user?.id}>
        {content}
      </TutorLayoutComponent>
    );
  }

  return content;
};

export default PublicLayout;
