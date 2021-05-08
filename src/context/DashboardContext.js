import React, { createContext, useState, useReducer, useContext } from "react";

const initialData = {
  labels: ["ADA", "OB", "FLAT", "COA", "OS"],
  datasets: [
    {
      label: "Attendance",
      backgroundColor: "rgba(255, 255, 255 ,1)",
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 2,
      data: [65, 59, 80, 81, 56],
    },
  ],
};

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const initialAttendanceState = {
    labels: [],
    data: [],
  };
  const [attendanceState, setAttendanceState] = useState(initialAttendanceState);

  function updateData(data) {
    const tempData = {
      labels: data.labels, 
      data: data.data, 
    }; 

    setAttendanceState(tempData); 
  }

  return (
    <DashboardContext.Provider value={{ attendanceState, updateData }}>
      {children}
    </DashboardContext.Provider>
  );
};

export function useDashboardContext() {
  return useContext(DashboardContext);
}
