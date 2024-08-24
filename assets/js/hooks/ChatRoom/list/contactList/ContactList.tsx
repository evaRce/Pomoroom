import React, { useState, useEffect, Fragment } from "react";
import { Button } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import Contact from "./Contact";
import { useEventContext } from "../../EventContext";

export default function ContactList({ }) {
  const { addEvent, getEventData, removeEvent } = useEventContext();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, contact: null });
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const contact = getEventData("add_contact_to_list");
    if (contact) {
      addContact(contact);
      removeEvent("add_contact_to_list");
    }

    const contactList = getEventData("show_list_contact");
    if (contactList) {
      contactList.map(contact =>
        addContact(contact)
      );
      removeEvent("show_list_contact");
    }

    const contactToDelete = getEventData("delete_contact_from_list");
    if (contactToDelete) {
      deleteContact(contactToDelete);
      removeEvent("delete_contact_from_list");
    }

    const requestRejected = getEventData("rejected_request");
    if (requestRejected) {
      updateContactStatusOnRejection(requestRejected.request);
      removeEvent("rejected_request");
    }

    const group = getEventData("add_group_to_list");
    if (group) {
      addContact(group);
      removeEvent("add_group_to_list");
    }
  }, [getEventData]);

  useEffect(() => {
    const results = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(results);
  }, [searchTerm, contacts]);

  const addContact = (contact) => {
    const newContact = {
      name: contact.contact_data?.nickname || contact.group_data?.name,
      image: contact.contact_data?.image_profile || contact.group_data?.image,
      status_request: contact.request?.status || contact.status,
      is_group: contact.is_group
    };
    setContacts(prevContacts => [...prevContacts, newContact]);
  };

  const updateContactStatusOnRejection = (requestRejected) => {
    setContacts(prevContacts =>
      prevContacts.map(contact => {
        const isInvolvedReceived = (contact.name === requestRejected.to_user && userLogin.nickname === requestRejected.from_user);
        const isInvolvedSend = (contact.name === requestRejected.from_user && userLogin.nickname === requestRejected.to_user);

        if ((isInvolvedReceived || isInvolvedSend) && contact.status_request !== "accepted") {
          if (contact.status_request === "pending") {
            return { ...contact, status_request: "rejected" };
          }
        }

        return contact;
      })
    );
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
        // Restablece la selección si se eliminó el contacto seleccionado
        if (selectedContact === contactName) {
          setSelectedContact(null);
        }
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
              <Contact
                contact={contact}
                isSelected={selectedContact === contact.name}
                onSelect={() => setSelectedContact(contact.name)}
              />
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