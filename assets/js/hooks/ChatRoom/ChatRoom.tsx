import React, { useContext, useEffect } from "react";
import ChatList from "./list/ChatList";
import Chat from "./chat/Chat";
import Detail from "./detail/Detail";
import { useEventContext } from "./EventContext";

export interface ChatRoomProps {
	user_email: string;
	user_nickname: string;
	pushEventToLiveView(event: string, payload: object): any;
}

export const ChatRoom: React.FC<ChatRoomProps> = (props: ChatRoomProps) => {
	const { user_nickname, pushEventToLiveView } = props;
	const { addEvent, getEventData } = useEventContext();

  useEffect(() => {
    const contactInfo = getEventData("add_contact");
    if (contactInfo) {
      pushEventToLiveView("action.add_contact", contactInfo);
    }
  }, [getEventData]);

	useEffect(() => {
    addEvent("react.show_user_info", user_nickname);
  }, [user_nickname]);

	return (
		<div className="flex h-screen w-screen min-h-screen md:min-h-48 overflow-x-hidden">
				<ChatList />
				<Chat />
				<Detail />
		</div>
	);
}
