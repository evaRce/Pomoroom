import React, { useState, useEffect } from "react";
import ChatList from "./list/ChatList";
import Chat from "./chat/Chat";
import Detail from "./detail/Detail";
import BackGround from "./chat/BackGround";
import { useEventContext } from "./EventContext";

export interface ChatRoomProps {
	eventName: string;
	eventData: any;
	pushEventToLiveView(event: string, payload: object): any;
}

export const ChatRoom: React.FC<ChatRoomProps> = (props: ChatRoomProps) => {
	const { eventName, eventData, pushEventToLiveView } = props;
	const { addEvent, getEventData, removeEvent } = useEventContext();
	const [selectedContact, setSelectedContact] = useState(false);

  useEffect(() => {
		const contactInfo = getEventData("add_contact");
		const contactToDelete = getEventData("delete_contact");
		const selectedChat = getEventData("selected_chat");
		const sendMessage = getEventData("send_message");
	
		if (contactInfo) {
			pushEventToLiveView("action.add_contact", contactInfo);
			removeEvent("add_contact");
		}
		if (contactToDelete) {
			pushEventToLiveView("action.delete_contact", contactToDelete);
			removeEvent("delete_contact");
		}
		if (selectedChat) {
			setSelectedContact(true);
			pushEventToLiveView("action.selected_chat", selectedChat);
			removeEvent("selected_chat");
		}
		if (sendMessage) {
			pushEventToLiveView("action.send_message", sendMessage);
			removeEvent("send_message");
		}
  }, [addEvent]);


	useEffect(() => {
    if (eventName === "show_user_info" && eventData.nickname) {
			setSelectedContact(false);
      addEvent(eventName, eventData.nickname);
    }
  }, [eventData.nickname]);

	useEffect(() => {
		if (eventName === "add_contact_to_list" && eventData.name) {
      addEvent(eventName, eventData.name);
    }
	}, [eventData.name])

	useEffect(() => {
		if (eventName === "error_adding_contact" && eventData.error) {
      addEvent(eventName, eventData.error);
    }
  }, [eventData.error]);

	useEffect(() => {
		if (eventName === "show_list_contact" && eventData.contacts) {
      addEvent(eventName, eventData.contacts);
    }
  }, [eventData.contacts]);

	useEffect(() => {
		if (eventName === "open_chat" && eventData.chat_users) {
      addEvent(eventName, eventData);
    }
  }, [eventData.chat_users]);

	useEffect(() => {
		if (eventName === "show_message_to_send" && eventData.public_id_msg) {
			addEvent(eventName, eventData);
		}
	}, [eventData.public_id_msg])

	return (
		<div className="flex h-screen w-screen min-h-screen md:min-h-48 overflow-x-hidden">
				<ChatList />
				{selectedContact ? (<Chat />) : (<BackGround />)}
				<Detail />
		</div>
	);
}
