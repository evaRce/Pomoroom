import React, { useRef, useEffect } from "react";
import ChatList from "./list/ChatList";
import Chat from "./chat/Chat";
import Detail from "./detail/Detail";
import { useEventContext } from "./EventContext";

export interface ChatRoomProps {
	eventName: string;
	eventData: any;
	pushEventToLiveView(event: string, payload: object): any;
}

export const ChatRoom: React.FC<ChatRoomProps> = (props: ChatRoomProps) => {
	const { eventName, eventData, pushEventToLiveView } = props;
	const { addEvent, getEventData, removeEvent } = useEventContext();

  useEffect(() => {
		const contactInfo = getEventData("add_contact");
		if (contactInfo) {
			pushEventToLiveView("action.add_contact", contactInfo);
			removeEvent("add_contact");
		}
  }, [addEvent]);

	useEffect(() => {
    if (eventName === "show_user_info" && eventData.nickname) {
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

	return (
		<div className="flex h-screen w-screen min-h-screen md:min-h-48 overflow-x-hidden">
				<ChatList />
				<Chat />
				<Detail />
		</div>
	);
}
