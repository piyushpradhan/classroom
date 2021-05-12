import React, {
  createContext,
  useState,
  useReducer,
  useContext,
  useEffect,
} from "react";
import { AuthProvider } from "../context/AuthContext";
import firebase from "../firebase/firebase";

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
  const [attendanceState, setAttendanceState] = useState({
    data: {},
  });

  function updateData(newData) {
    const tempData = {
      data: newData,
    };

    setAttendanceState(tempData);
  }

  return (
    <AuthProvider>
      <DashboardContext.Provider value={{ attendanceState, updateData }}>
        {children}
      </DashboardContext.Provider>
    </AuthProvider>
  );
};

export function useDashboardContext() {
  return useContext(DashboardContext);
}
