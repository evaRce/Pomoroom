import React from "react";
import { Button } from "antd";

export default function SimpleContact({ contact, onSelect }) {
  return (
    <div className="flex items-center justify-between p-2 border-b hover:bg-gray-300">
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <img
            className="h-10 w-10 rounded-full bg-white"
            src={contact.contact_data.image_profile}
          />
        </div>
        <span>{contact.contact_data.nickname}</span>
      </div>
      <Button className="bg-lime-400" onClick={onSelect}>Invitar</Button>
    </div>

  );
}