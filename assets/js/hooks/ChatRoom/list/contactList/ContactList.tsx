import React, { useState, useEffect, Fragment } from "react";
import { Button } from "antd";
import { SearchOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Contact from "./Contact";
import { useEventContext } from "../../EventContext";

export default function ContactList({ }) {
	const { getEventData, removeEvent } = useEventContext();
	const [contacts, setContacts] = useState([]);
	const [filteredContacts, setFilteredContacts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

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
      image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
    };
    setContacts(prevContacts => [...prevContacts, newContact]);
  };

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};

	return (
		<div className="flex flex-col h-[90vh] w-[20vw]">
			<div className="flex py-2 px-1 w-[20vw] justify-center">
				<input
					className="input h-auto w-[20vw] focus:outline-none bg-gray-100"
					type="text"
					placeholder="Search"
					value={searchTerm}
					onChange={handleSearch}
				/>
			</div>
			<div className="overflow-auto w-[20vw] p-1" style={{ scrollbarWidth: 'thin'}}>
				{filteredContacts.map(contact => (
					<Fragment key={contact.name}>
						<Contact contact={contact} />
						<div className='border-t-2 mb-1'></div>
					</Fragment>
				))}
			</div>
		</div>
	);
}