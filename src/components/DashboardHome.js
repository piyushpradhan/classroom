import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AttendanceChart from "../components/AttendanceChart";
import TodoComponent from "../components/TodoComponent";
import { useDashboardContext } from "../context/DashboardContext";
import firebase from "../firebase/firebase";
import "../public/css/dashboard.css";

const DashboardHome = ({ currentUser }) => {
  const [newSubjectName, setNewSubjectName] = useState("");
  const { dashboardState, updateData } = useDashboardContext();

  function addSubject() {
    if (newSubjectName.trim() !== "") {
      const firestore = firebase.firestore();
      const response = firestore.collection("users").doc(currentUser.uid);
      response.get().then((snapshot) => {
        const temp = snapshot.data().attendanceData;
        temp[newSubjectName] = 0;
        updateData(temp, dashboardState.events);
        response.update({
          attendanceData: temp,
        });
      });
      setNewSubjectName("");
    }
  }

  function deleteSubject(selectedSub) {
    const firestore = firebase.firestore();
    const response = firestore.collection("users").doc(currentUser.uid);
    response.get().then((snapshot) => {
      const temp = snapshot.data().attendanceData;
      Object.keys(temp).map((item) => {
        if (item === selectedSub) {
          delete temp[item];
        }
        return item;
      });
      updateData(temp, dashboardState.events);
      response.update({
        attendanceData: temp,
      });
    });
  }

  function incrementAttendance(sub) {
    var updated = dashboardState.data;
    updated[sub]++;
    updateData(updated, dashboardState.events);
    const response = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);
    response.update({
      attendanceData: updated,
    });
  }

  function decrementAttendance(sub) {
    var updated = dashboardState.data;
    updated[sub]--;
    updateData(updated, dashboardState.events);
    const response = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);
    response.update({
      attendanceData: updated,
    });
  }

  return (
    <>
      <div className="text-xl my-4 font-bold">Attendance Chart</div>
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center xl:max-h-max lg:flex-row border-2 border-grey-900 xl:w-full py-4">
          <div className="sm:w-3/5 sm:h-full mx-4">
            <AttendanceChart />
          </div>
          <div className="w-full sm:w-2/5 m-4 flex flex-col">
            <div className="text-md font-bold text-center mb-2">
              26th April 2021
            </div>
            <div className="flex flex-col mt-4">
              {Object.keys(dashboardState.data).map((label) => {
                return (
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row items-center w-full justify-between">
                      <button
                        onClick={() => {
                          decrementAttendance(label);
                        }}
                      >
                        <FiChevronLeft />
                      </button>
                      <div className="bg-grey-900 flex-grow-1 rounded rounded-full px-2 py-0 mt-1 text-white">
                        {label} {dashboardState.data[label]}
                      </div>
                      <button
                        onClick={() => {
                          incrementAttendance(label);
                        }}
                      >
                        <FiChevronRight />
                      </button>
                      <button onClick={() => deleteSubject(label)}>
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col border-2 border-grey-900 sm:mt-11 mx-8 sm:ml-8">
              <div className="text-md font-semibold text-center mt-2">
                Add new subject
              </div>
              <input
                className="mx-8 my-3 text-sm focus:outline-none"
                type="text"
                placeholder="Subject..."
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
              <button
                onClick={addSubject}
                className="font-bold uppercase text-white bg-grey-900"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <TodoComponent currentUser={currentUser} />
      </div>
    </>
  );
};

export default DashboardHome;
