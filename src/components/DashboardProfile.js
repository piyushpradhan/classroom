import React, { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useAuthContext } from "../context/AuthContext";
import { useClassroomContext } from "../context/ClassroomContext";
import { useDashboardContext } from "../context/DashboardContext";

import firebase from "../firebase/firebase";

const DashboardProfile = () => {
  const { currentUser } = useAuthContext();
  const { dashboardState } = useDashboardContext();
  const { classroomState, setTeacher, setTeacherExplicit } =
    useClassroomContext();

  const [newTeacher, setNewTeacher] = useState("");
  const [teachersList, setTeachersList] = useState([]);
  var subjects = Object.keys(dashboardState.data);

  console.log(classroomState.isTeacher);

  useEffect(() => {
    const response = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);
    response.get().then((snapshot) => {
      var teachersList = [];
      if (snapshot.data() !== undefined)
        teachersList = snapshot.data().teachers;
      setTeachersList(teachersList);
      setTeacherExplicit(snapshot.data().isTeacher);
    });
  }, []);

  function addTeacher() {
    if (newTeacher.trim() !== "") {
      const response = firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid);
      response.get().then((snapshot) => {
        var teachersList = [];
        if (snapshot.data() !== undefined)
          teachersList = snapshot.data().teachers;
        teachersList.push(newTeacher);
        response.update({
          teachers: teachersList,
        });
        setTeachersList(teachersList);
      });
      setNewTeacher("");
    } else {
      window.alert("enter a valid teacher's email");
    }
  }

  function deleteTeacher(index) {
    const response = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);
    response.get().then((snapshot) => {
      var teachersList = [];
      if (snapshot.data() !== undefined)
        teachersList = snapshot.data().teachers;
      teachersList.splice(index, 1);
      response.update({
        teachers: teachersList,
      });
      setTeachersList(teachersList);
    });
  }

  function toggleStatus() {
    const response = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);
    response.update({
      isTeacher: !classroomState.isTeacher,
    });
    setTeacher();
  }

  return (
    <div className="flex flex-row justify-center space-x-32 items-center">
      <div className="relative max-w-max mt-8 self-center">
        <div className="absolute bg-grey-900 w-full h-full -right-2 -bottom-2"></div>
        <div className="relative h-full bg-white flex flex-col space-y-4 border-2 border-grey-900 py-8">
          <div className="relative flex flex-row justify-center items-center md:space-x-8 space-x-2 md:px-8 px-2">
            <img
              className="md:w-32 w-16 md:h-32 h-16 rounded-full"
              src={currentUser ? currentUser.photoURL : ""}
              alt=""
            />
            <div className="flex flex-col">
              <div className="font-bold md:text-2xl text-xl">
                {currentUser.displayName}
              </div>
              <div className="md:text-lg text-md">
                {classroomState.isTeacher ? "Teacher" : "Student"}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-start items-center space-x-4 md:px-8 px-4">
            <div className="text-md">Change your status to:</div>
            <button
              onClick={toggleStatus}
              className="font-bold text-md max-w-max border-2 border-grey-900 px-4 py-1 transition all duration-200 ease-in-out hover:bg-grey-900 hover:text-white"
            >
              {classroomState.isTeacher === true ? "Student" : "Teacher"}
            </button>
          </div>

          <div className="flex flex-row justify-between items-center md:mx-8 mx-4">
            <input
              type="text"
              value={newTeacher}
              onChange={(e) => setNewTeacher(e.target.value)}
              className="w-full focus:outline-none"
              placeholder="Add a teacher's email"
            />
            <button
              onClick={addTeacher}
              className="px-4 py-1 focus:outline-none bg-grey-900 text-white font-bold"
            >
              Add
            </button>
          </div>
          <div className="flex flex-col md:mx-8 mx-4">
            {teachersList.map((t, ind) => {
              return (
                <div className="flex flex-row bg-grey-200 justify-between items-center">
                  <div className="text-sm py-0.5 px-1">{t}</div>
                  <button
                    onClick={(e) => deleteTeacher(ind)}
                    className="focus:outline-none"
                  >
                    <BiTrash />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col md:px-8 px-4">
            <div className="font-bold text-md">My Subjects</div>
            {subjects.map((subject) => {
              return <div className="text-sm">{subject}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
