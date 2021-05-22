import React from "react";

const AnnouncementTile = ({ announcement }) => {
  return (
    <div className="mx-4 my-2 flex flex-col">
      <div className="font-bold text-xs">{announcement.author}</div>
      <div className="text-sm">{announcement.text}</div>
    </div>
  );
};

export default AnnouncementTile;
