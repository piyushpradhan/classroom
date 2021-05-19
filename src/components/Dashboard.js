import React, { useEffect, useState } from "react";
import { BiCalendarPlus } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Modal from "react-modal";
import AttendanceChart from "../components/AttendanceChart";
import Calendar from "../components/Calendar";
import DashboardHeader from "../components/DashboardHeader";
import TodoComponent from "../components/TodoComponent";
import { useAuthContext } from "../context/AuthContext";
import { useDashboardContext } from "../context/DashboardContext";
import firebase from "../firebase/firebase";
import "../public/css/dashboard.css";
import AddEventPopup from "./AddEventPopup";
import ScheduledEvent from "./ScheduledEvent";

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
  const [eventData, setEventData] = useState(null);

  const { dashboardState, updateData } = useDashboardContext();

  const { currentUser } = useAuthContext();

  useEffect(() => {
    const response = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);
    response.get().then((snapshot) => {
      var temp = {};
      if (snapshot.data()) temp = snapshot.data().attendanceData;
      var tempEvents = [];
      if (snapshot.data()) tempEvents = getTodayEvents(snapshot.data());
      updateData(temp, tempEvents);
    });
  }, []);

  function getToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
  }

  function getTodayEvents(snapshotData) {
    var today = getToday();
    const events = snapshotData.events.filter((event) => event.date === today);
    return events;
  }

  function addSubject() {
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

  function openModal() {
    setEventData(null);
    toggleModal(true);
  }

  function closeModal() {
    toggleModal(false);
  }

  return (
    <div className="no-scrollbar w-screen min-h-screen flex 2xl:flex-row flex-col justify-between">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyle}
      >
        <AddEventPopup
          currentUser={currentUser}
          toggleModal={toggleModal}
          eventData={eventData}
          setEventData={setEventData}
        />
      </Modal>
      <div className="flex-grow bg-white flex flex-col 2xl:mb-8 px-16  h-full">
        <DashboardHeader />
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
      </div>
      <div className="flex flex-col md:items-center 2xl:mt-0 md:px-2 mt-8 md:flex-grow-1 bg-grey-200">
        <Calendar
          updateData={updateData}
          dashboardState={dashboardState}
          currentUser={currentUser}
        />
        <div className="flex flex-row md:px-4 mt-10 w-full justify-between">
          <div className="font-bold text-lg">Scheduled Events</div>
          <button
            className="outline-none border-none focus:outline-none focus:border-none"
            onClick={openModal}
          >
            <BiCalendarPlus className="text-2xl" />
          </button>
        </div>
        <div className="w-full px-4 mt-2">
          {dashboardState.events.map((event, index) => {
            var bgColor = "white";
            if (event.color !== null || event.color !== "")
              bgColor = event.color;
            return (
              <ScheduledEvent
                event={event}
                popupColor={bgColor}
                toggleModal={toggleModal}
                setEventData={setEventData}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
