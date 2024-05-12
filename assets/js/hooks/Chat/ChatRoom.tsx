import React from 'react';
import List from "./list/List";
import Chat from "./chat/Chat";
import Detail from "./detail/Detail";
import Navbar from '../../components/Navbar';

export interface ChatRoomProps {

}

export const ChatRoom: React.FC<ChatRoomProps> = (props: ChatRoomProps) => {

	return (
		<div className='h-full'>
			<Navbar />
			<div className="flex w-full">
				<List />
				<Chat />
				<Detail />
			</div>
		</div>
	);
}

