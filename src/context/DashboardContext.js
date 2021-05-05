import React, { createContext, useState, useReducer, useContext } from "react";
import DashboardReducer from "../reducers/DashboardReducer";

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
  const initialState = {
    labels: initialData.labels,
    data: [65, 59, 80, 81, 56],
    dataset: initialData,
  };
  const [state, dispatch] = useReducer(DashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

export function useDashboardContext() {
  return useContext(DashboardContext);
}
