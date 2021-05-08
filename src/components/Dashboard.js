import React, { useState, useEffect } from "react";
import Modal from "react-modal";

import { BiCalendarPlus } from "react-icons/bi";

import Calendar from "../components/Calendar";
import AttendanceChart from "../components/AttendanceChart";
import DashboardHeader from "../components/DashboardHeader";
import TodoComponent from "../components/TodoComponent";
import EditSubject from "../components/EditSubject";

import firebase from "../firebase/firebase";
import { LABEL } from "../constants/actionTypes";
import { AuthProvider } from "../context/AuthContext";
import { useDashboardContext } from "../context/DashboardContext";
import { useAuthContext } from "../context/AuthContext"; 
import ScheduledEvent from "./ScheduledEvent";
import AddEventPopup from "./AddEventPopup";

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "absolute",
    border: "none",
    background: "transparent",
    borderRadius: "0px",
  },
};

function Dashboard() {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [modalIsOpen, toggleModal] = useState(false);
  const [labels, setLabels] = useState([]); 

  const {
    attendanceState,  
    updateData
  } = useDashboardContext();

  const {
    currentUser
  } = useAuthContext(); 

  useEffect(() => {
    const firestore = firebase.firestore(); 
    async function fetchData() {
      const response = firestore.collection("users").doc(currentUser.uid);  
      response.get().then((snapshot) => {
        console.log(snapshot.data().attendanceData); 
        // setLabels(snapshot.data().attendanceData.labels);  
        updateData(snapshot.data().attendanceData); 
      })
    }
    fetchData();
  }, attendanceState);


  async function addSubject() {
     const firestore = firebase.firestore(); 
     const response = firestore.collection('users').doc(currentUser.uid); 
     response.update({
       attendanceData: {
         labels: [...attendanceState.labels, newSubjectName],
         data: [...attendanceState.data, 0]
       }
     }); 
    updateData(attendanceState); 
  }

  function openModal() {
    toggleModal(true);
  }

  function closeModal() {
    toggleModal(false);
  }

  return (
    <div className="w-screen sm:h-screen flex 2xl:flex-row flex-col justify-between">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyle}
      >
        <AddEventPopup />
      </Modal>
      <div className="flex-grow bg-white flex flex-col px-16 h-full">
        <DashboardHeader />
        <div className="text-xl my-4 font-bold">Attendance Chart</div>
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-center xl:max-h-max xl:flex-row border-2 border-grey-900 xl:w-full lg:w-full py-4">
            <div className="sm:w-3/5 sm:h-full mx-4">
              <AttendanceChart />
            </div>
            <div className="w-full sm:w-2/5 m-4 flex flex-col">
              <div className="text-md font-bold text-center mb-2">
                26th April 2021
              </div>
              <div className="flex flex-col mt-4">
                {attendanceState.labels.map((element) => {
                  return (
                    <div className="flex flex-row">
                      <div className="flex flex-row justify-between">
                        {element}
                        <button className="">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col border border-grey-900 sm:mt-11 mx-8 sm:ml-8">
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
          <TodoComponent />
        </div>
      </div>
      <div className="flex flex-col md:items-center md:mt-0 md:px-2 mt-8 md:flex-grow-1 bg-grey-200">
        <Calendar />
        <div className="flex flex-row md:px-4 mt-10 w-full justify-between">
          <div className="font-bold text-lg">Scheduled Events</div>
          <button
            className="outline-none border-none focus:outline-none focus:border-none"
            onClick={openModal}
          >
            <BiCalendarPlus className="text-2xl focus:outline-none" />
          </button>
        </div>
        <div className="w-full px-4 mt-2">
          <ScheduledEvent />
          <ScheduledEvent />
          <ScheduledEvent />
          <ScheduledEvent />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
