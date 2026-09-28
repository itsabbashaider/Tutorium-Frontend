"use client";

import { useParams } from "next/navigation";

import { useAuth } from "@/hooks/auth/use-auth.hook";

const isUsableStudentId = (studentId) =>
  Boolean(studentId) && studentId !== "undefined";

export const useStudentRouteId = () => {
  const params = useParams();
  const { user } = useAuth();

  const routeStudentId = params?.student_id;

  if (isUsableStudentId(routeStudentId)) {
    return routeStudentId;
  }

  return (
    user?.student_profile_id || user?.student_id || user?.user_id || user?.id
  );
};
