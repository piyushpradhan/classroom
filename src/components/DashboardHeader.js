import React from "react";

import { useAuthContext } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { useClassroomContext } from "../context/ClassroomContext";

function DashboardHeader({ logout }) {
  const { currentUser } = useAuthContext();
  const { classroomState } = useClassroomContext();

  return (
    <>
      <div className="flex flex-row my-8 w-full justify-between items-center">
        <div className="flex flex-row">
          <img
            className="w-16 h-16 rounded-full"
            src={currentUser ? currentUser.photoURL : ""}
            alt=""
          />
          <div className="flex flex-col mx-4">
            <div className="text-2xl font-bold">
              {currentUser ? currentUser.displayName : ""}
            </div>
            <div className="text-md">
              {classroomState.isTeacher === true ? "Teacher" : "Student"}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="focus:outline-none text-2xl my-4 p-2 rounded-lg hover:bg-grey-100"
        >
          <FiLogOut />
        </button>
      </div>
    </>
  );
}

export default DashboardHeader;
