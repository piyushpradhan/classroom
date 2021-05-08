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

  useEffect(() => {
    async function fetchData() {
      const response = firestore.collection("users").doc(currentUser.uid);  
      response.get().then((snapshot) => {
        console.log(snapshot.data().attendanceData); 
        updateData(snapshot.data().attendanceData); 
      })
    }
    fetchData();
  }, []);

  const attendanceData = {
    labels: attendanceState.labels,  
    datasets: [
      {
        label: "Attendance",
        backgroundColor: "rgba(255, 255, 255 ,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: attendanceState.data,
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
