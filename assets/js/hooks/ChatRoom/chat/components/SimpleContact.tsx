import React from "react";
import { Button } from "antd";

export default function SimpleContact({ contact, onSelect }) {
  return (
    <div className="flex items-center justify-between p-2 border-b hover:bg-gray-300">
      <span>{contact.contact_data.nickname}</span>
      <Button className=" bg-lime-400" onClick={onSelect}>Invitar</Button>
    </div>
  );
}