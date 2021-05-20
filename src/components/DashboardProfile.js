import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { useDashboardContext } from "../context/DashboardContext";

const DashboardProfile = ({ isTeacher, setTeacher }) => {
  const { currentUser } = useAuthContext();
  const { dashboardState } = useDashboardContext();
  var subjects = Object.keys(dashboardState.data);

  return (
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
              {isTeacher ? "Teacher" : "Student"}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-start items-center space-x-4 md:px-8 px-4">
          <div className="text-md">Toggle your status:</div>
          <button
            onClick={(e) => setTeacher(!isTeacher)}
            className="font-bold text-md max-w-max border-2 border-grey-900 px-4 py-1 transition all duration-200 ease-in-out hover:bg-grey-900 hover:text-white"
          >
            {isTeacher === true ? "Student" : "Teacher"}
          </button>
        </div>
        <div className="flex flex-col md:px-8 px-4">
          <div className="font-bold text-md">My Subjects</div>
          {subjects.map((subject) => {
            return <div className="text-sm">{subject}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
