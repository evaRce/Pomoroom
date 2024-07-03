import React from "react";
import UserInfo from "./userInfo/UserInfo";
import ContactList from "./contactList/ContactList";

export default function ChatList({ user_info })  {
	return(
		<div className="hidden min-w-[20vw] lg:block">
			<UserInfo user_info={user_info}/>
			<ContactList/>
		</div>	
	);
}