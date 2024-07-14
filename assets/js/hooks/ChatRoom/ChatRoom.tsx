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
    switch (eventName) {
      case "show_user_info":
        if (eventData.nickname) {
          addEvent(eventName, eventData.nickname);
        }
        break;
      case "add_contact_to_list":
        if (eventData.name) {
          addEvent(eventName, eventData.name);
        }
        break;
      case "error_adding_contact":
        if (eventData.error) {
          addEvent(eventName, eventData.error);
        }
        break;
			case "show_list_contact":
				if (eventData.contacts) {
					addEvent(eventName, eventData.contacts);
				}
				break;
      default:
        break;
    }
  }, [eventName, eventData]);

	return (
		<div className="flex h-screen w-screen min-h-screen md:min-h-48 overflow-x-hidden">
				<ChatList />
				<Chat />
				<Detail />
		</div>
	);
}
