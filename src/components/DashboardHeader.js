import React from "react";

import { useAuthContext } from "../context/AuthContext";

function DashboardHeader() {
  const { currentUser } = useAuthContext();

  return (
    <>
      <div className="flex flex-row my-8">
        <img
          className="w-16 h-16 rounded-full"
          src={currentUser ? currentUser.photoURL : ""}
          alt=""
        />
        <div className="flex flex-col mx-4">
          <div className="text-2xl font-bold">{currentUser ? currentUser.displayName : ""}</div>
          <div className="text-md">Regd. No: 1901106220</div>
        </div>
      </div>
    </>
  );
}

export default DashboardHeader;
