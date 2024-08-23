import React, { useState, useEffect, useRef } from "react";
import HeaderChat from "./components/HeaderChat";
import Message from "./message/Message";
import FooterChat from "./components/FooterChat";
import { useEventContext } from "../EventContext";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const { getEventData, removeEvent } = useEventContext();
  const [fromUser, setFromUser] = useState({});
  const [toUser, setToUser] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const msgs = getEventData("show_list_messages");
    if (msgs) {
      setFromUser(msgs.from_user_data);
      setToUser(msgs.to_user_data);
      setMessages(msgs.messages);
      removeEvent("show_list_messages");
    }

    const msg = getEventData("show_message_to_send");
    if (msg) {
      setFromUser(msg.from_user_data);
      setToUser(msg.to_user_data);
      addMessage(msg.message_data);
      removeEvent("show_message_to_send");
    }
  }, [getEventData]);

  const addMessage = (message) => {
    if (!message || !message.text || message.text.trim() === "") {
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
      <HeaderChat />
      <main
        className="flex flex-col h-[83vh] overflow-y-auto overflow-x-hidden p-5 border-t border-b"
        style={{ scrollbarWidth: "thin" }}
        ref={messagesEndRef}
      >
        {messages.length > 0 && messages.map((message) => (
          <Message key={message.msg_id} message={message} fromUser={fromUser} toUser={toUser} />
        ))}
        <div ref={messagesEndRef}></div>
      </main>
      <FooterChat addMessage={addMessage} />
    </div>
  );
}
