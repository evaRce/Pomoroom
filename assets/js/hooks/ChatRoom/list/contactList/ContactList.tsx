import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { SearchOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Contact from "./Contact";
import { useEventContext } from "../../EventContext";

export default function ContactList({ }) {
	const { getEventData, removeEvent } = useEventContext();
	const [contacts, setContacts] = useState([]);

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

	const addContact = (nameContact) => {
    const newContact = {
      name: nameContact,
      text: "hola",
      image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
    };
    setContacts(prevContacts => [...prevContacts, newContact]);
  };

	return (
		<div className="flex flex-col h-[90vh] w-[20vw]">
			<div className="flex py-2 px-1 w-[20vw] justify-center">
				<input
					className="input h-auto w-[17vw] focus:outline-none bg-gray-100 rounded-r-none"
					type="text"
					placeholder="Search"
				/>
				<Button
					className=" bg-gray-100 h-auto w-[3vw] rounded-l-none rounded-r-lg px-3 text-sm"
					icon={<SearchOutlined />}
				/>
			</div>
			<div className="overflow-auto w-[20vw] p-1" style={{ scrollbarWidth: 'thin'}}>
				{contacts.map(contact => (
					<>
						<Contact key={contact.name} contact={contact} />
						<div className='border-t-2 mb-1'></div>
					</>
				))}
			</div>
		</div>
	);
}