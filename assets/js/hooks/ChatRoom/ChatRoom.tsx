import React from "react";
import List from "./list/List";
import Chat from "./chat/Chat";
import Detail from "./detail/Detail";

export interface ChatRoomProps {

}

export const ChatRoom: React.FC<ChatRoomProps> = (props: ChatRoomProps) => {
	return (
		<div className="flex h-screen w-screen min-h-screen md:min-h-48 overflow-x-hidden">
				<List />
				<Chat />
				<Detail />
		</div>
	);
}
