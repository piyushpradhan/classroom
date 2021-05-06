import React, { useState } from "react";
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
  const currentUser = firebase.auth().currentUser;
  const [newSubjectName, setNewSubjectName] = useState("");
  const [modalIsOpen, toggleModal] = useState(false);

  const {
    state: { labels },
    dispatch: subjectDispatch,
  } = useDashboardContext();

  const subjects = labels;

  function addSubject() {
    subjectDispatch({
      type: LABEL,
      payload: newSubjectName,
    });
  }

  function openModal() {
    toggleModal(true);
  }

  function closeModal() {
    toggleModal(false);
  }

  return (
    <AuthProvider>
      <div className="w-screen h-screen flex 2xl:flex-row flex-col justify-between">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={modalStyle}
        >
          <AddEventPopup />
        </Modal>
        <div className="flex-grow bg-white flex flex-col px-16 max-h-full">
          <DashboardHeader />
          <div className="text-xl my-4 font-bold">Attendance Chart</div>
          <div className="flex flex-col items-center xl:h-2/5 sm:flex-row border-2 border-grey-900 rounded-md xl:w-full lg:w-5/6 py-4">
            <div className="sm:w-3/5 sm:h-full mx-4">
              <AttendanceChart />
            </div>
            <div className="w-full sm:w-2/5 m-4 flex flex-col">
              <div className="text-md font-bold text-center mb-2">
                26th April 2021
              </div>
              <div className="flex flex-col overflow-y-auto mt-4">
                {labels.map((element) => {
                  return (
                    <div className="flex flex-row justify-between">
                      <div>
                        <input className="mx-8" type="checkbox" />
                        {element}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col border border-grey-900 rounded-md sm:mt-11 mx-8 sm:ml-8">
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
        <div className="flex flex-col items-center md:mt-0 md:px-2 mt-8 flex-grow-1 bg-grey-200">
          <Calendar />
          <div className="flex flex-row md:px-4 mt-10 w-full justify-between">
            <div className="font-bold text-lg">Scheduled Events</div>
            <button
              classNmae="outline-none border-none focus:outline-none focus:border-none"
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
    </AuthProvider>
  );
}

export default Dashboard;
