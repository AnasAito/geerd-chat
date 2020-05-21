import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import { Widget, addResponseMessage } from "react-chat-widget";

import "react-chat-widget/lib/styles.css";
import "./Chat.css";

let socket;

const Chat = ({ location }) => {
  const [message, setMessage] = useState("");

  const [filter, setFilter] = useState([]);
  const ENDPOINT = "http://localhost:5000/";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    setFilter(["master", name]);
    socket = io(ENDPOINT);

    socket.emit("join", { name, room }, error => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", message => {
      if (message.user === "master") {
        addResponseMessage(message.text);
      }
    });
  }, []);

  const handleNewUserMessage = newMessage => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
    if (newMessage) {
      socket.emit("sendMessage", newMessage, filter[1], () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Support chat room"
        subtitle="send us message in cas of a problem"
      />
    </div>
  );
};

export default Chat;
