import React, { useState } from "react";
import Calendar from "react-calendar";
import AttendanceChart from "../components/AttendanceChart";
import DashboardHeader from "../components/DashboardHeader";
import TodoComponent from "../components/TodoComponent";
import EditSubject from "../components/EditSubject";

import firebase from "../firebase/firebase";
import { LABEL } from "../constants/actionTypes";
import { AuthProvider } from "../context/AuthContext";
import { useDashboardContext } from "../context/DashboardContext";

function Dashboard() {
  const currentUser = firebase.auth().currentUser;
  const [newSubjectName, setNewSubjectName] = useState("");
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

  return (
    <AuthProvider>
      <div className="w-screen h-screen xl:grid xl:grid-cols-7 lg:flex lg:flex-col">
        <div className="xl:col-span-5 lg:col-span-7 bg-white flex flex-col px-16">
          <DashboardHeader />
          <div className="text-xl my-4 font-bold">Attendance Chart</div>
          <div className="flex flex-col items-center sm:flex-row border-2 border-grey-900 rounded-md xl:w-full lg:w-5/6 h-2/5 py-4">
            <div className="sm:w-3/5 sm:h-full my-10 mx-4">
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
              <div className="flex flex-col border border-grey-900 rounded-md mt-11 mx-8 sm:ml-8">
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
        <div className="md:mt-0 md:px-2 mt-8 col-span-2 bg-grey-900">
          <Calendar />
        </div>
      </div>
    </AuthProvider>
  );
}

export default Dashboard;
