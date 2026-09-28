import StudentLayoutComponent from "@/components/student/student-layout.component";

const StudentLayout = async ({ children, params }) => {
  const { student_id } = await params;

  return (
    <StudentLayoutComponent studentId={student_id} isPrivate={true}>
      {children}
    </StudentLayoutComponent>
  );
};

export default StudentLayout;
