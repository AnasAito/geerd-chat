import React from "react";

import ScrollToBottom from "react-scroll-to-bottom";

import Message from "./Message/Message";

import "./Messages.css";

const Messages = ({ messages, name, see }) => {
  return (
    <>
      {name === "master" ? (
        <ScrollToBottom className="messages">
          {messages

            .filter(message => see.includes(message.user))

            .map((message, i) => (
              <div key={i}>
                <Message message={message} name={name} />
              </div>
            ))}
        </ScrollToBottom>
      ) : (
        <ScrollToBottom className="messages">
          {messages
            .filter(message => message.to === name)
            .filter(message => see.includes(message.user))

            .map((message, i) => (
              <div key={i}>
                <Message message={message} name={name} />
              </div>
            ))}
        </ScrollToBottom>
      )}
    </>
  );
};

export default Messages;
