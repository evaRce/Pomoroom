import React, { useState, useEffect } from "react";
import HeaderChat from "./components/HeaderChat";
import Message from "./message/Message";
import FooterChat from "./components/FooterChat";
import { useEventContext } from "../EventContext";

export default function Chat({}) {
  const [messages, setMessages] = useState([]);
  const { getEventData, removeEvent } = useEventContext();

	useEffect(() => {
		const msg = getEventData("show_message_to_send");
		if (msg) {
      addMessage(msg);
			removeEvent("show_message_to_send");
		}
	}, [getEventData]);

  const addMessage = (message) => {
    if (!message || !message.text || message.text.trim() === "") {
      return; // No añadir mensajes vacíos
    }
    setMessages(prevMessages => [...prevMessages, message]);
    console.log("mensajes: ", messages)
  };

  return(
    <div className="flex flex-col flex-grow w-full border-l border-r">
      <HeaderChat/>
      <main className="flex flex-col h-[83vh] overflow-y-auto overflow-x-hidden p-5 border-t border-b" style={{ scrollbarWidth: 'thin'}}>
        {messages.map(message => (
          <Message key={message.public_id_msg} message={message} />
        ))}
		  </main>
      <FooterChat addMessage={addMessage} />
    </div> 
  );
}