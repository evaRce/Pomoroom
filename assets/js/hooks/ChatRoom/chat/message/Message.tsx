import { Avatar } from "antd";
import React from "react";

export default function Message({ message, fromUser, toUser}) {
	const setTime = (dateTime) => {
		const date = new Date(dateTime);
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${hours}:${minutes}`;
	};

	const messagePosition = message.from_user === fromUser.nickname ? "chat-end" : "chat-start";
	const image_profile = message.from_user === fromUser.nickname ? fromUser.image_profile : toUser.image_profile;

	return (
		<div className={`chat ${messagePosition}`}>
			<div className="chat-image avatar">
				<Avatar className="bg-red-50" src={image_profile} size={45} />
			</div>
			<div className="chat-header">
				{message.from_user}
			</div>
			<div className="chat-bubble" style={{ maxWidth: "70%", wordWrap: "break-word" }}>
				{message.text}
				<div style={{ textAlign: "right" }}>
					<time className="text-xs opacity-50">{setTime(message.inserted_at)}</time>
				</div>
			</div>
		</div>
	);
}