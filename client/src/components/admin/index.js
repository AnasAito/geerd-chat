import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { isEmpty } from "lodash";

import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import "./Chat.css";
let socket;

const Admin = ({ name = "master", room = "support" }) => {
  //const [name, setName] = useState("");
  //const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState([name]);
  const ENDPOINT = "http://localhost:5000/";

  useEffect(() => {
    // const { name, room } = props

    socket = io(ENDPOINT);

    //setRoom(room);
    //setName(name);

    socket.emit("join", { name, room }, error => {
      //console.log(room);
      if (error) {
        //  console.log(room);
        alert(error);
      }
    });
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("message", message => {
      setMessages(messages => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = event => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, filter[1], () => setMessage(""));
    }
  };
  console.log(users);
  return (
    <div>
      {isEmpty(users) ? (
        <></>
      ) : (
        <>
          {users.map(user => (
            <button onClick={() => setFilter(["master", user.name])}>
              {user.name}
            </button>
          ))}
        </>
      )}
      <div>
        messages :
        <div>
          <div className="container">
            <InfoBar room={room} />
            <Messages messages={messages} name={name} see={filter} />
            <Input
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
