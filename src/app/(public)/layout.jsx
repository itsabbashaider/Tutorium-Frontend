"use client";

import {
  createContext,
  useContext,
} from "react";

import { Loading } from "@/components/common";

import {
  useAuth,
} from "@/hooks";

import StudentLayoutComponent from "@/components/student/student-layout.component";
import TutorLayoutComponent from "@/components/tutor/tutor-layout.component";

const PublicRoleContext =
  createContext(null);

export const usePublicRole = () => {
  return useContext(
    PublicRoleContext
  );
};

const PublicLayout = ({
  children,
}) => {
  const {
    user,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  const role = String(
    user?.role || ""
  )
    .trim()
    .toUpperCase();

  const content = (
    <PublicRoleContext.Provider
      value={role}
    >
      {children}
    </PublicRoleContext.Provider>
  );

  if (role === "STUDENT") {
    return (
      <StudentLayoutComponent>
        {content}
      </StudentLayoutComponent>
    );
  }

  if (role === "TUTOR") {
    return (
      <TutorLayoutComponent>
        {content}
      </TutorLayoutComponent>
    );
  }

  return content;
};

export default PublicLayout;