import React, { useState } from "react";
import firebase from '../firebase/firebase'; 
import { useDashboardContext } from '../context/DashboardContext'; 

function AddEventPopup({ currentUser, toggleModal }) {
  const [color, setColor] = useState("#FFFFFF");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [date, setDate] = useState(""); 

  const { attendanceState, updateData } = useDashboardContext(); 
  const popupColors = [
    "#ffadad",
    "#ffd6a5",
    "#fdffb6",
    "#caffbf",
    "#9bf6ff",
    "#a0c4ff",
    "#bdb2ff",
    "#ffc6ff",
  ];

  function updateColor(updatedColor) {
    setColor(updatedColor);
  }

  function getToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
  }

  function addNewEvent() {
    if (title.trim() === "" || date === "") {
      window.alert("Title and date fields are mandatory"); 
      return; 
    } 
    const response = firebase.firestore().collection("users").doc(currentUser.uid); 
    response.get().then((snapshot) => {
      const newEvent = {
        email: currentUser.email, 
        title: title, 
        desc: desc, 
        start: start, 
        end: end, 
        date: date, 
        color: color, 
      };
      const today = getToday(); 
      const prev = snapshot.data().events; 
      prev.push(newEvent); 
      const updated = prev; 
      if(newEvent.date === today) updated.push(newEvent);
      updateData(attendanceState.data, updated); 
      response.update({
        events: prev,  
      }); 
      toggleModal(false); 
    }); 
  }

  return (
    <div className="relative md:w-96 h-full">
      <div className="absolute w-full h-full bg-grey-900 -right-2 -bottom-2"></div>
      <div
        style={{ backgroundColor: color }}
        className="relative w-full border-2 border-black bg-white p-8 flex flex-col items-start"
      >
        <div className="text-xl font-bold">Add Event</div>
        <div className="mt-4 w-full">
          <input
            style={{ backgroundColor: color }}
            className="focus:outline-none w-full text-sm"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event Title"
          />
        </div>
          <div className="flex flex-col text-sm font-bold mt-4">
            <label>Pick Date</label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ backgroundColor: color }}
              className=""
              type="date"
              placeholder="Date"
            />
          </div>
        <div className="flex flex-row w-full space-x-14">
          <div className="flex flex-col text-sm font-bold mt-4">
            <label>Start</label>
            <input
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{ backgroundColor: color }}
              className=""
              type="time"
              placeholder="Start"
            />
          </div>
          <div className="flex flex-col text-sm font-bold mt-4">
            <label>End</label>
            <input
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={{ backgroundColor: color }}
              className=""
              type="time"
              placeholder="Start"
            />
          </div>
        </div>
        <div className="mt-4 w-full">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ backgroundColor: color }}
            className="text-sm w-full w-max-full focus:outline-none"
            placeholder="Add event description..."
          ></textarea>
        </div>
        <div className="flex flex-row space-x-2">
          {popupColors.map((palette) => {
            return (
              <button
                className="focus:outline-none"
                onClick={() => updateColor(palette)}
              >
                <div
                  className="w-6 h-6 rounded rounded-full"
                  style={{ backgroundColor: palette }}
                ></div>
              </button>
            );
          })}
        </div>
        <div className="flex flex-row mt-2 w-full justify-end">
          <button onClick={addNewEvent}
            className="bg-grey-900 px-4 py-2 text-white font-bold outline-none border-none focus:outline-none">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEventPopup;
