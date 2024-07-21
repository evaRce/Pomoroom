import React, { useState, useEffect, Fragment } from "react";
import { Button } from "antd";
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import Contact from "./Contact";
import { useEventContext } from "../../EventContext";

export default function ContactList({ }) {
	const { addEvent, getEventData, removeEvent } = useEventContext();
	const [contacts, setContacts] = useState([]);
	const [filteredContacts, setFilteredContacts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, contact: null });
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, contact: null });

	useEffect(() => {
    const nameContact = getEventData("add_contact_to_list");
		if (nameContact) {
			addContact(nameContact);
			removeEvent("add_contact_to_list");
		}

		const contactList = getEventData("show_list_contact");
    if (contactList) {
      contactList.map(name => 
        addContact(name)
      );
      removeEvent("show_list_contact");
    }
  }, [getEventData]);

	useEffect(() => {
		const results = contacts.filter(contact =>
			contact.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredContacts(results);
	}, [searchTerm, contacts]);

	const addContact = (nameContact) => {
    const newContact = {
      name: nameContact,
      text: "hola",
      image: "/images/default_user/default_user-02.svg"
    };
    setContacts(prevContacts => [...prevContacts, newContact]);
  };

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};

  const handleContextMenu = (event, contact) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      contact: contact
    });
  };

  const handleMenuClick = (action) => {
    if (action === "delete") {
      deleteContact(contextMenu.contact.name);
    }
    setContextMenu({ visible: false, x: 0, y: 0, contact: null });
  };

  const deleteContact = (contactName) => {
    const index = contacts.findIndex(contact => contact.name === contactName);
    if (index !== -1) {
      addEvent("delete_contact", contactName);
      setContacts(prevContacts => {
        const newContacts = [...prevContacts];
        newContacts.splice(index, 1);
        return newContacts;
      });
    }
  };

  return (
    <div className="flex flex-col h-[90vh] w-[20vw]" onClick={() => setContextMenu({ visible: false, x: 0, y: 0, contact: null })}>
      <div className="flex py-2 px-1 w-[20vw] justify-center">
        <input
          className="input h-auto w-[20vw] focus:outline-none bg-gray-100"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="overflow-auto w-[20vw] p-1" style={{ scrollbarWidth: 'thin' }}>
        {filteredContacts.map(contact => (
          <Fragment key={contact.name}>
            <div onContextMenu={(event) => handleContextMenu(event, contact)}>
              <Contact contact={contact} />
            </div>
            <div className='border-t-2 mb-1'></div>
          </Fragment>
        ))}
      </div>
      {contextMenu.visible && (
        <div 
          style={{ 
            position: 'absolute', 
            top: contextMenu.y, 
            left: contextMenu.x, 
            background: 'white', 
            // boxShadow: '0px 0px 5px rgba(0,0,0,0.3)',
            zIndex: 1000 
          }}
        >
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleMenuClick("delete")}
            style={{ width: '100%' }}
          >
            Eliminar contacto
          </Button>
        </div>
      )}
    </div>
  );
}