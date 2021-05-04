import React, { useState } from "react";

export const RoomList = (props) => {
  return (
    <div className="room_container">
      {props.rooms &&
        <div id="roomNav" className="list-group">
          {props.rooms.map(roomID => 
            <a 
              href="#"
              id={roomID} 
              className={"list-group-item list-group-item-action text-center " + (props.currentRoom == roomID ? 'selectedRoom' : '')} 
              onClick={() => props.setCurrentRoom(roomID)}>
                {roomID}
            </a>)}
        </div>
      }
    </div>
  );
}
