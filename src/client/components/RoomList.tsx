import React, { useState } from "react";

export const RoomList = (props) => {
  return (
    <div className="room_container">
      {props.rooms &&
        <div id="roomNav">
          {props.rooms.map(roomID => <div id={roomID} className={props.currentRoom == roomID ? 'selectedRoom' : null} onClick={() => props.setCurrentRoom(roomID)}>{roomID}</div>)}
        </div>
      }
    </div>
  );
}
