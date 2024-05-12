import React from "react";
import { Layout, Button } from "antd";
import Message from "./Messages/Message";

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
		}
	]

	return (
		<div className="flex flex-col space-y-4 overflow-y-auto p-5 border-t-4 border-b-4">
			{messages.map(message => (
				<Message key={message.id} message={message} />
			))}
		</div>
	);
}