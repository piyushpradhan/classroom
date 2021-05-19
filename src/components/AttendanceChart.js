import React from "react";
import { Bar } from "react-chartjs-2";

import { useDashboardContext } from "../context/DashboardContext";

const AttendanceChart = () => {
  const { dashboardState } = useDashboardContext();

  var labels = Object.keys(dashboardState.data);
  var data = Object.values(dashboardState.data);
  const attendanceData = {
    labels: labels,
    datasets: [
      {
        label: "Attendance",
        backgroundColor: "rgba(255, 255, 255 ,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: data,
      },
    ],
  };

  return (
    <>
      <Bar data={attendanceData} />
    </>
  );
};

export default React.memo(AttendanceChart);
