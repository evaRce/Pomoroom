import React, { useState } from "react";
import HeaderChat from "./components/HeaderChat";
import BodyChat from "./components/BodyChat";
import FooterChat from "./components/FooterChat";

export default function Chat({}) {
  const [messages, setMessages] = useState([]);

  const addMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      text: text,
      name: "currentUser"
    };
    setMessages([...messages, newMessage]);
  };
  return(
    <div className="flex flex-col flex-grow w-full border-l border-r">
      <HeaderChat/>
      <BodyChat messages={messages} />
      <FooterChat addMessage={addMessage} />
    </div> 
  );
}