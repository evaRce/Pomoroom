import React from "react";
import UserInfo from "./userInfo/UserInfo";
import ContactList from "./contactList/ContactList";

export default function List({})  {
	return(
		<div className="hidden min-w-[20vw] lg:block">
			<UserInfo/>
			<ContactList/>
		</div>	
	);
}