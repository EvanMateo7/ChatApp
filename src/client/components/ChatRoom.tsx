import React, { useState, useEffect } from "react";
import { Message, RoomJoin } from '../../model/models'

export interface ChatRoomsProps { rooms: string[], socket: SocketIOClient.Socket, currentRoom, joinRoom: Function }
interface ChatRoomProps { roomID: string, socket: SocketIOClient.Socket }

export const ChatRooms = (props: ChatRoomsProps) => {

  const joinRoom = (e) => {
    const roomID = (document.getElementById('roomID') as HTMLInputElement).value;
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const roomJoin: RoomJoin = {
      roomID: roomID,
      name: name
    }

    if (roomID.trim() == "" || name.trim() == "") {
      alert("Room ID or Name is empty")
      return;
    }
    props.socket.emit('joinRoom', roomJoin);
  }

  return (
    <div className="chat_container">
      <div id="joinContainer">
        <div>
          <label htmlFor="roomID">Room ID</label>
          <input type="text" id="roomID"></input>
        </div>

        <div>
          <label htmlFor="name">Your Name</label>
          <input type="text" id="name"></input>
        </div>

        <button className="btn btn-primary btn-sm" id="joinButton" onClick={joinRoom}>Join</button>
      </div>
      <div id="canvas" className="flexRowCenter"></div>
      <ChatRoom key={props.currentRoom} roomID={props.currentRoom} socket={props.socket} />
    </div>
  );
}

const ChatRoom = (props: ChatRoomProps) => {

  const [messages, addMessages] = useState<Message[]>([]);

  useEffect(() => {
    props.socket.on('newMessage', (message: Message) => {
      addMessages((messages) => [...messages, message]);
      console.error("new message received", message, messages)
    });

    return () => props.socket.off('newMessage');
  }, [props.roomID])

  const sendMessage = () => {
    const message = (document.getElementById('message') as HTMLInputElement);
    if (message.value.trim() == '') {
      alert("message is empty")
      return;
    }
    if (props.roomID == null) {
      console.error("Error: currentRoomID is null");
      return;
    }
    const newMessage: Message = {
      sender: null,
      message: message.value,
      roomID: props.roomID
    }

    props.socket.emit('message', newMessage);
    message.value = '';
  }

  return (
    <div id="messageWallContainer" >
      <div id="messageForm" className="flexRowCenter">
        <textarea id="message" cols={30} rows={3}></textarea>
        <div className="flexRowCenter">
          <button id="sendButton" className="btn btn-primary btn-sm" onClick={sendMessage}>Send</button>
        </div>
      </div>
      <div className="messageWall">{messages.map(m => <ChatMessage roomID={m.roomID} sender={m.sender} message={m.message} />)}</div>
    </div>
  );
}

const ChatMessage = (props: Message) => (<div key={props.roomID} className="message">{props.sender}: {props.message}</div>);
