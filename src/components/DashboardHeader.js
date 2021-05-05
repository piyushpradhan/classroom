import React from "react";
import firebase from "../firebase/firebase";

function DashboardHeader() {
  const user = firebase.auth().currentUser;

  return (
    <>
      <div className="flex flex-row my-8">
        <img
          className="w-16 h-16 rounded-full"
          src="/images/sample_profile.jpeg"
          alt=""
        />
        <div className="flex flex-col mx-4">
          <div className="text-2xl font-bold">Piyush Pradhan</div>
          <div className="text-md">Regd. No: 1901106220</div>
        </div>
      </div>
    </>
  );
}

export default DashboardHeader;
