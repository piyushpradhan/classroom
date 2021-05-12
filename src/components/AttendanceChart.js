import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";

import { useDashboardContext } from "../context/DashboardContext";
import { useAuthContext } from "../context/AuthContext";

import { options } from "../dummy/attendanceData";

import firebase from "../firebase/firebase";

const AttendanceChart = React.memo(() => {
  const firestore = firebase.firestore();
  const { currentUser } = useAuthContext();
  const {
    attendanceState, 
    updateData, 
  } = useDashboardContext();
  
  var labels = Object.keys(attendanceState.data); 
  var data = Object.values(attendanceState.data); 
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
});

export default AttendanceChart;
