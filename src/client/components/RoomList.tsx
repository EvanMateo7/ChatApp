import React, { useContext } from "react";
import { RoomJoin } from "../../model/models";
import { UserContext } from "./App";

interface RoomListProps {
  socket: SocketIOClient.Socket, 
  rooms: string[], 
  currentRoom: string, 
  setCurrentRoom: Function
}

export const RoomList = (props: RoomListProps) => {

  const user = useContext(UserContext);

  const joinRoom = (e) => {
    const roomID = (document.getElementById('roomID') as HTMLInputElement).value;
    const roomJoin: RoomJoin = {
      roomID: roomID,
      name: user.displayName
    }

    if (roomID.trim() == "") {
      alert("Room ID or Name is empty")
      return;
    }
    props.socket.emit('joinRoom', roomJoin);
  }

  return (
    <div className="room_container">
      {"Hello, " + user.displayName}
      <form className="my-3">
        <div className="form-group">
          <label htmlFor="roomID">Room ID</label>
          <input type="text" className="form-control" id="roomID"></input>
        </div>
      <button className="btn btn-primary btn-sm w-100" onClick={joinRoom}>Join</button>
      </form>
      {props.rooms && props.rooms.length > 0 &&
        <div id="room_list" className="list-group">
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
