import React from "react";

function ScheduledEvent({ popupColor, event, setEventData, toggleModal }) {
  function eventClickHandler() {
    setEventData(event);
    toggleModal(true);
  }

  return (
    <a href="#" onClick={eventClickHandler} className="block">
      <div className="relative w-full mt-4">
        <div className="absolute bg-grey-900 w-full h-full -right-2 -bottom-2"></div>
        <div
          className="relative h-full space-y-7 border-2 border-grey-900 px-2 py-2"
          style={{ backgroundColor: popupColor }}
        >
          <div className="flex flex-row justify-between items-center px-1 my-1 space-y-1 h-full">
            <div className="flex flex-col w-full">
              <div className="font-bold text-md">{event.title}</div>
              <div className="text-xs">{event.desc}</div>
            </div>
            <div className="flex flex-col w-full max-w-max">
              <div className="font-bold text-sm">Date: {event.date}</div>
              <div className="font-bold text-sm">
                {event.start} {" - "} {event.end}
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default ScheduledEvent;
