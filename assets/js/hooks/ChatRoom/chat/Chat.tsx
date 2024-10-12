import React, { useState, useEffect, useRef } from "react";
import HeaderChat from "./header/HeaderChat";
import Message from "./message/Message"
import FooterChat from "./components/FooterChat";
import { useEventContext } from "../EventContext";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const { getEventData, removeEvent } = useEventContext();
  const messagesEndRef = useRef(null);
  const [userLogin, setUserLogin] = useState(null);

  useEffect(() => {
    const msgs = getEventData("show_list_messages");
    const msg = getEventData("show_message_to_send");
    const user = getEventData("show_user_info");

    if (msgs) {
      setMessages(msgs.messages);
      removeEvent("show_list_messages");
    }

    if (msg) {
      addMessage(msg.message);
      removeEvent("show_message_to_send");
    }

    if (user) {
      setUserLogin(user);
    }
  }, [getEventData]);

  const addMessage = (message) => {
    if (!message || !message.data || message.data.text.trim() === "") {
      return; // No añadir mensajes vacíos
    }
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col flex-grow w-full border-l border-r">
      <HeaderChat userLogin={userLogin} />
      <main
        className="flex flex-col h-[83vh] overflow-y-auto overflow-x-hidden p-5 border-t border-b"
        style={{ scrollbarWidth: "thin" }}
        ref={messagesEndRef}
      >
        {messages.length > 0 && messages.map((message) => (
          <Message key={message.data.msg_id} message={message} userLogin={userLogin} />
        ))}
        <div ref={messagesEndRef}></div>
      </main>
      <FooterChat addMessage={addMessage} />
    </div>
  );
}
