import React from "react";
import UserInfo from "./userInfo/UserInfo";
import ContactList from "./contactList/ContactList";

export default function List({})  {
	return(
		<div className="hidden max-w-80 lg:block p-5">
			<UserInfo/>
			<ContactList/>
		</div>	
	);
}
