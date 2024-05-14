import React from 'react';
import List from "./list/List";
import Chat from "./chat/Chat";
import Detail from "./detail/Detail";
import Navbar from '../../components/Navbar';

export interface ChatRoomProps {

}

export const ChatRoom: React.FC<ChatRoomProps> = (props: ChatRoomProps) => {
	const isChatAlone = true;
	return (
		<div className="flex h-screen w-screen min-h-screen md:min-h-48">
				<List />
				<Chat />
				<Detail />
		</div>
	);
}

