import React from "react";
import ChatList from "./list/ChatList";
import Chat from "./chat/Chat";
import Detail from "./detail/Detail";

export interface ChatRoomProps {
	user_info: object;
}

export const ChatRoom: React.FC<ChatRoomProps> = (props: ChatRoomProps) => {
	const { user_info } = props;

	return (
		<div className="flex h-screen w-screen min-h-screen md:min-h-48 overflow-x-hidden">
				<ChatList user_info={user_info}/>
				<Chat />
				<Detail />
		</div>
	);
}
