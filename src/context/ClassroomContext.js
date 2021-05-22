import React, { createContext, useState, useContext } from "react";
import { useAuthContext } from "./AuthContext";

const ClassroomContext = createContext();

export const ClassroomProvider = ({ children }) => {
  const [classroomState, setClassroomState] = useState({
    isTeacher: false,
    assignments: [],
  });

  function setTeacher() {
    setClassroomState({
      isTeacher: !classroomState.isTeacher,
      assignments: classroomState.assignments,
    });
  }

  function setTeacherExplicit(value) {
    setClassroomState({
      isTeacher: value,
      assignments: classroomState.assignments,
    });
  }

  function updateAssignmentList(updatedAssignments) {
    setClassroomState({
      isTeacher: classroomState.isTeacher,
      assignments: updatedAssignments,
    });
  }

  return (
    <ClassroomContext.Provider
      value={{
        classroomState,
        setTeacher,
        updateAssignmentList,
        setTeacherExplicit,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};

export function useClassroomContext() {
  return useContext(ClassroomContext);
}
