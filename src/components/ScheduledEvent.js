import React from "react";

function ScheduledEvent() {
  return (
    <>
      <div className="relative w-full mt-4">
        <div className="absolute bg-grey-900 w-full h-full -right-2 -bottom-2"></div>
        <div className="relative bg-white h-full space-y-7 h-16 border-2 border-grey-900 px-2 py-2">
          <div className="flex flex-row justify-between items-center px-1 my-1 space-y-1 h-full">
              <div className="flex flex-col">
                <div className="font-bold text-md">Event Title</div>
                <div className="text-xs">Description of the event</div>
              </div>
              <div className="font-bold text-sm">12:00 PM - 3:30 PM </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ScheduledEvent;
