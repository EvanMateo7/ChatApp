import React, { useState, useEffect } from "react";
import { Message } from '../../model/models'

interface ChatRoomProps { roomID: string, socket: SocketIOClient.Socket, currentRoom, joinRoom: Function }

export const ChatRoom = (props: ChatRoomProps) => {

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
    <div className="chat_container">
      <div className="messageWall">{messages.map(m => <ChatMessage roomID={m.roomID} sender={m.sender} message={m.message} />)}</div>
      <form action="" role="form" className="my-3">
        <div className="form-group flex flex-row">
          <div className="input-group">
            <textarea id="message" className="form-control" cols={30} rows={2}></textarea>
          </div>
          <button type="submit" className="btn btn-primary btn-sm" onClick={sendMessage}>Send</button>
        </div>
      </form>
    </div>
  );
}

const ChatMessage = (props: Message) => (<div key={props.roomID} className="message">{props.sender}: {props.message}</div>);
