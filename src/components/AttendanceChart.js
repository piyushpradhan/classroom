import React from "react";
import { Bar } from "react-chartjs-2";
import { useDashboardContext } from "../context/DashboardContext";
import { options } from "../dummy/attendanceData";

const AttendanceChart = React.memo(() => {
  const {
    state: { labels, data },
  } = useDashboardContext();

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
      <Bar data={attendanceData} options={options} />
    </>
  );
});

export default AttendanceChart;
