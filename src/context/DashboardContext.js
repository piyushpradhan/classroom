import React, { createContext, useState, useContext } from "react";
import { AuthProvider } from "../context/AuthContext";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardState, setDashboardState] = useState({
    data: {},
    events: [],
  });

  function updateData(newData, newEvents) {
    const tempData = {
      data: newData,
      events: newEvents,
    };

    setDashboardState(tempData);
  }

  return (
    <AuthProvider>
      <DashboardContext.Provider value={{ dashboardState, updateData }}>
        {children}
      </DashboardContext.Provider>
    </AuthProvider>
  );
};

export function useDashboardContext() {
  return useContext(DashboardContext);
}
