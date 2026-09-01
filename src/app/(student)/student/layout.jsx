import StudentLayoutComponent from "@/components/student/student-layout.component";

const StudentLayout = ({ children }) => {
  return (
    <StudentLayoutComponent>
      {children}
    </StudentLayoutComponent>
  );
};

export default StudentLayout;