import React from "react";
import { Avatar } from "antd";
import { useEventContext } from "../../EventContext";

export default function Contact ({ contact, isSelected, onSelect }) {
  const { addEvent } = useEventContext();

  const handleChat = () => {
    if (!isSelected) {
      addEvent("selected_chat", { contact_name: contact.name });
      onSelect();
    }
  };

  return (
    <div 
      className={`relative rounded-lg p-2 flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 mb-1 hover:bg-gray-200 ${isSelected ? 'bg-gray-300' : ''}`} 
      onClick={handleChat}
    >
      <div className="flex-shrink-0"> 
        <img 
          className="h-10 w-10 rounded-full"
          src={contact.image}/> 
      </div>
      <div className="flex-1 min-w-20">
        <a className="focus:outline-none" onClick={handleChat}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-red-600 pb-0">
              {contact.name}
            </span>
            <span className="text-gray-400 text-xs">
              12:35 AM
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-500 truncate">
              {contact.text}
            </span>
            <span className="text-white text-xs bg-red-400 rounded-full px-1 py-0">
              2
            </span>
          </div>
        </a>

      </div>
    </div>
  )
}