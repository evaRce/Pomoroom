import React from "react";
import { Layout, Button } from "antd";
import Message from "../message/Message";

export default function BodyChat({})  {
	const messages = [
		{
			id:1,
			text:"Message1!",
			name: "user1"
		},
		{
			id: 2,
			text: "Message2!",
			name: "user2"
		},
		{
			id: 3,
			text: "Message3!",
			name: "user3"
		},
		{
			id: 4,
			text: "Message4!",
			name: "user4"
		}
	]

	return (
		<main className="flex flex-col h-[83vh] overflow-y-auto p-5 border-t border-b" style={{ scrollbarWidth: 'thin'}}>
			{messages.map(message => (
				<Message key={message.id+1} message={message} />
			))}
		</main>
	);
}