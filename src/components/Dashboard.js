import React, { useEffect, useState } from "react";
import { BiCalendarPlus } from "react-icons/bi";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import Calendar from "../components/Calendar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuthContext } from "../context/AuthContext";
import { useDashboardContext } from "../context/DashboardContext";
import firebase from "../firebase/firebase";
import "../public/css/dashboard.css";
import AddEventPopup from "./AddEventPopup";
import DashboardHome from "./DashboardHome";
import DashboardProfile from "./DashboardProfile";
import ScheduledEvent from "./ScheduledEvent";
import DashboardClassroom from "./DashboardClassroom";
import { useClassroomContext } from "../context/ClassroomContext";
import { GrClose } from "react-icons/gr";

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
  const [modalIsOpen, toggleModal] = useState(false);
  const [snackbar, toggleSnackbar] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const { dashboardState, updateData } = useDashboardContext();
  const { classroomState, setTeacherExplicit } = useClassroomContext();

  const { currentUser, setCurrentUser } = useAuthContext();

  const history = useHistory();

  var snackbarStyle;
  if (classroomState.isTeacher === false && snackbar === true) {
    snackbarStyle = "flex flex-row bg-grey-900 justify-between";
  } else {
    snackbarStyle = "flex flex-row bg-grey-900 justify-between hidden";
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user); 
        const response = firebase.firestore().collection("users").doc(user.uid);
        response.get().then((snapshot) => {
          var temp = {};
          if (snapshot.data()) temp = snapshot.data().attendanceData;
          var tempEvents = [];
          if (snapshot.data()) tempEvents = getTodayEvents(snapshot.data());
          updateData(temp, tempEvents);
          setTeacherExplicit(snapshot.data().isTeacher);
        });
      } else {
        history.replace("/");
      }
    });
  }, []);

  function logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        history.replace("/");
      });
  }

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

  function openModal() {
    setEventData(null);
    toggleModal(true);
  }

  function closeModal() {
    toggleModal(false);
  }

  function closeSnackbar() {
    toggleSnackbar(false);
  }

  return (
    <div className="no-scrollbar w-screen min-h-screen flex 2xl:flex-row flex-col justify-between">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyle}
        ariaHideApp={false}
      >
        <AddEventPopup
          currentUser={currentUser}
          toggleModal={toggleModal}
          eventData={eventData}
          setEventData={setEventData}
        />
      </Modal>
      <div className="flex-grow bg-white flex flex-col 2xl:mb-8 px-16 h-full">
        <div className={snackbarStyle}>
          <div className="w-full text-white text-sm text-center py-2">
            Head over to Profile section to change your status to teacher if
            you'd like to make questions and announcements
          </div>
          <button
            onClick={closeSnackbar}
            className="font-bold bg-white text-grey-900 focus:outline-none my-2 mr-2 p-1 rounded-md"
          >
            <GrClose />
          </button>
        </div>
        <DashboardHeader logout={logout} />
        <div className="flex flex-row space-x-7 justify-center">
          <button
            onClick={(e) => setTabIndex(0)}
            className="font-bold text-md border-2 border-grey-900 px-4 py-1 transition all duration-200 ease-in-out hover:bg-grey-900 hover:text-white"
          >
            Home
          </button>
          <button
            onClick={(e) => setTabIndex(1)}
            className="font-bold text-md border-2 border-grey-900 px-4 py-1 transition all duration-200 ease-in-out hover:bg-grey-900 hover:text-white"
          >
            Classroom
          </button>
          <button
            onClick={(e) => setTabIndex(2)}
            className="font-bold text-md border-2 border-grey-900 px-4 py-1 transition all duration-200 ease-in-out hover:bg-grey-900 hover:text-white"
          >
            Profile
          </button>
        </div>
        {tabIndex === 0 ? (
          <DashboardHome currentUser={currentUser} />
        ) : tabIndex === 1 ? (
          <DashboardClassroom />
        ) : (
          <DashboardProfile />
        )}
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
