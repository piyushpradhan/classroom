import React, {
  createContext,
  useState,
  useReducer,
  useContext,
  useEffect,
} from "react";
import { AuthProvider } from "../context/AuthContext";
import firebase from "../firebase/firebase";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [attendanceState, setAttendanceState] = useState({
    data: {},
    events: [],
  });

  function updateData(newData, newEvents) {
    const tempData = {
      data: newData,
      events: newEvents, 
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
