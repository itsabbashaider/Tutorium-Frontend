import TutorLayoutComponent from "@/components/tutor/tutor-layout.component";

const TutorLayout = ({ children }) => {
  return (
    <TutorLayoutComponent>
      {children}
    </TutorLayoutComponent>
  );
};

export default TutorLayout;