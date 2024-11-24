import React from "react";
import UserInfo from "./userInfo/UserInfo";
import ContactList from "./contactList/ContactList";

export default function ChatList({ }) {
	return (
		<div className="hidden min-w-[20vw] sm:block">
			<UserInfo />
			<ContactList />
		</div>
	);
}