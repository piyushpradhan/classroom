import React from "react";

function AddEventPopup() {
  return (
    <div className="relative md:w-96 h-full">
      <div className="absolute w-full h-full bg-grey-900 -right-2 -bottom-2"></div>
      <div className="relative w-full border-2 border-black bg-white p-8 flex flex-col items-start">
        <div className="text-xl font-bold">Add Event</div>
        <div className="mt-4 w-full">
          <input
            className="focus:outline-none w-full text-sm"
            type="text"
            placeholder="Enter event Title"
          />
        </div>
        <div className="flex flex-row justify-between space-x-14">
          <div className="flex flex-col text-sm font-bold mt-4">
            <label>Start</label>
            <input className="" type="time" placeholder="Start" />
          </div>
          <div className="flex flex-col text-sm font-bold mt-4">
            <label>End</label>
            <input className="" type="time" placeholder="Start" />
          </div>
        </div>
        <div className="mt-4 w-full">
          <textarea
            className="text-sm w-full w-max-full focus:outline-none"
            placeholder="Add event description..."
          ></textarea>
        </div>
        <div className="flex flex-row mt-2 w-full justify-end">
          <button className="bg-grey-900 px-4 py-2 text-white font-bold outline-none border-none focus:outline-none">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEventPopup;
