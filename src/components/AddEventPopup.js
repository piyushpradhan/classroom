import React, { useEffect, useState } from "react";
import { RiAddCircleFill } from "react-icons/ri";
import { useDashboardContext } from "../context/DashboardContext";
import firebase from "../firebase/firebase";

import { GrClose } from "react-icons/gr";

function AddEventPopup({ currentUser, toggleModal, eventData, setEventData }) {
  const [color, setColor] = useState("#FFFFFF");
  const [title, setTitle] = useState(eventData == null ? "" : eventData.title);

  const [desc, setDesc] = useState(eventData == null ? "" : eventData.desc);
  const [start, setStart] = useState(eventData == null ? "" : eventData.start);
  const [end, setEnd] = useState(eventData == null ? "" : eventData.end);
  const [date, setDate] = useState(eventData == null ? "" : eventData.date);
  const [people, setPeople] = useState(
    eventData == null ? [] : eventData.people
  );
  const [meetingLink, setMeetingLink] = useState(
    eventData == null ? "" : eventData.meetingLink
  );
  const [disabledInputs, setDisabledInputs] = useState(false);
  const [person, setPerson] = useState("");

  useEffect(() => {
    if (eventData !== null) {
      if (eventData.email !== currentUser.email) {
        setDisabledInputs(true);
      }
    }
  }, []);

  const { dashboardState, updateData } = useDashboardContext();
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

  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

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
    if (eventData == null) {
      const response = firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid);
      response.get().then((snapshot) => {
        const newEvent = {
          id: uuid(),
          email: currentUser.email,
          title: title,
          desc: desc,
          start: start,
          end: end,
          date: date,
          color: color,
          people: people,
          meetingLink: meetingLink,
        };
        const today = getToday();
        const prev = snapshot.data().events;
        prev.push(newEvent);
        if (newEvent.date === today) {
          var updated = prev;
          updated = updated.filter((event) => event.date === today);
          updateData(dashboardState.data, updated);
        }
        response.update({
          events: prev,
        });

        const users = firebase.firestore().collection("users");
        var peopleMap = {};
        people.forEach((singlePerson) => {
          peopleMap[singlePerson] = 1;
        });
        users.get().then((response) => {
          response.docs.forEach((doc) => {
            const docRef = firebase.firestore().collection("users").doc(doc.id);
            if (peopleMap[doc.data().email] === 1) {
              var temp = doc.data().events;
              temp.push(newEvent);
              docRef.update({
                events: temp,
              });
              peopleMap[doc.data().email] = 0;
            }
          });
        });
        setEventData(null);
        toggleModal(false);
      });
    } else {
      const response = firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid);
      response.get().then((snapshot) => {
        const updatedEvent = {
          id: eventData.id,
          email: currentUser.email,
          title: title,
          desc: desc,
          start: start,
          end: end,
          date: date,
          color: color,
          people: people,
          meetingLink: meetingLink,
        };
        var eventList = snapshot.data().events;
        var updatedEventList = eventList.map((e) => {
          if (e.id === eventData.id) {
            return updatedEvent;
          }
          return e;
        });
        const today = getToday();
        if (updatedEvent.date === today) {
          console.log(updatedEvent.date + "gap" + today);
          var updated = updatedEventList.filter(
            (event) => event.date === today
          );
          updateData(dashboardState.data, updated);
        }
        response.update({
          events: updatedEventList,
        });

        if (updatedEvent.people.length > 0) {
          const users = firebase.firestore().collection("users");
          var peopleMap = {};
          people.forEach((singlePerson) => {
            peopleMap[singlePerson] = 1;
          });
          users.get().then((response) => {
            response.docs.forEach((doc) => {
              const docRef = firebase
                .firestore()
                .collection("users")
                .doc(doc.id);
              if (peopleMap[doc.data().email] === 1) {
                var temp = doc.data().events;
                var updated = temp.map((e) => {
                  if (e.id === eventData.id) {
                    return updatedEvent;
                  }
                  return e;
                });
                docRef.update({
                  events: updated,
                });
                peopleMap[doc.data().email] = 0;
              }
            });
          });
        }
        setEventData(null);
        toggleModal(false);
      });
    }
  }

  function addPeople(e) {
    e.preventDefault();
    var tempList = people;
    tempList.push(person);
    setPeople(people);

    setPerson("");
  }

  function closeModal() {
    toggleModal(false);
  }

  return (
    <div className="relative md:w-96 h-full">
      <div className="absolute w-full h-full bg-grey-900 -right-2 -bottom-2"></div>
      <div
        style={{ backgroundColor: color }}
        className="relative w-full border-2 border-black bg-white p-8 flex flex-col items-start"
      >
        <div className="flex flex-row w-full justify-between">
          <div className="text-xl font-bold">Add Event</div>
          <button
            onClick={closeModal}
            className="font-bold hover:bg-grey-200 focus:outline-none p-1 rounded-lg"
          >
            <GrClose />
          </button>
        </div>
        <div className="mt-4 w-full">
          <input
            style={{ backgroundColor: color }}
            className="focus:outline-none w-full text-sm"
            type="text"
            value={title}
            disabled={disabledInputs}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event Title"
          />
        </div>
        <div className="flex flex-col text-sm font-bold mt-4">
          <label>Pick Date</label>
          <input
            value={date}
            disabled={disabledInputs}
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
              disabled={disabledInputs}
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
              disabled={disabledInputs}
              onChange={(e) => setEnd(e.target.value)}
              style={{ backgroundColor: color }}
              className=""
              type="time"
              placeholder="Start"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col">
          <input
            type="text"
            value={meetingLink}
            disabled={disabledInputs}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="Add meeting link"
            className="text-sm py-1 focus:outline-none"
            style={{ backgroundColor: color }}
          />
        </div>
        <div className="mt-4 flex flex-col">
          <label className="font-bold text-sm">Add people</label>
          <form className="flex flex-row justify-between items-center">
            <input
              type="text"
              value={person}
              disabled={disabledInputs}
              onChange={(e) => setPerson(e.target.value)}
              placeholder="example@email.com"
              className="text-sm py-1 focus:outline-none"
              style={{ backgroundColor: color }}
            />
            <button
              disabled={disabledInputs}
              onClick={(e) => addPeople(e)}
              className="py-1 px-1 text-xl rounded rounded-lg focus:outline-none hover:bg-grey-200"
            >
              <RiAddCircleFill />
            </button>
          </form>
          {people.map((singlePerson) => {
            return (
              <div className="text-sm mt-1 bg-grey-200 px-1 border border-grey-400">
                {singlePerson}
              </div>
            );
          })}
        </div>
        <div className="mt-4 w-full">
          <textarea
            value={desc}
            disabled={disabledInputs}
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
                disabled={disabledInputs}
                className="focus:outline-none"
                onClick={() => updateColor(palette)}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: palette }}
                ></div>
              </button>
            );
          })}
        </div>
        <div className="flex flex-row mt-2 w-full justify-end">
          <button
            disabled={disabledInputs}
            onClick={addNewEvent}
            className="bg-grey-900 px-4 py-2 text-white font-bold outline-none border-none focus:outline-none"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEventPopup;
