import React from "react";
import { Layout, Button } from "antd";
import Message from "../message/Message";
import FooterChat from "./FooterChat";

export default function BodyChat({ messages }) {
	return (
		<main className="flex flex-col h-[83vh] overflow-y-auto overflow-x-hidden p-5 border-t border-b" style={{ scrollbarWidth: 'thin'}}>
			{messages.map(message => (
				<Message key={message.id} message={message} />
			))}
		</main>
	);
}