import React, { useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import { DownOutlined, ThunderboltOutlined, DeleteOutlined } from "@ant-design/icons";

export default function SimpleContact({ contact, onSelect, onSetAdmin, onDelete, isInModal = false }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleMenuClick = (key) => {
    if (key === "setAdmin") {
      onSetAdmin(contact.nickname);
    } else if (key === "deleteMember") {
      onDelete(contact.nickname);
    }
    setDropdownVisible(false);
  };

  const items = [
    {
      label: 'Establecer como admin',
      key: 'setAdmin',
      icon: <ThunderboltOutlined />
    },
    {
      label: 'Eliminar miembro',
      key: 'deleteMember',
      icon: <DeleteOutlined />
    },
  ];

  const menuProps = {
    items,
    onClick: (e) => handleMenuClick(e.key) // Corrected to pass the key correctly
  };

  return (
    <div className="relative flex items-center justify-between p-2 border-b hover:bg-gray-300">
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <img
            className="h-10 w-10 rounded-full bg-white"
            src={contact.image_profile}
            alt={contact.nickname}
          />
        </div>
        <span>{contact.nickname}</span>
      </div>
      {isInModal && (
        <Button className="bg-lime-400" onClick={onSelect}>
          Invitar
        </Button>
      )}
      {(!isInModal &&
        <Dropdown
          menu={menuProps}
          trigger={['click']}
          open={dropdownVisible}
          onOpenChange={(visible) => setDropdownVisible(visible)}
        >
          <Button icon={<DownOutlined />} onClick={() => setDropdownVisible(!dropdownVisible)} />
        </Dropdown>
      )}
    </div>
  );
}