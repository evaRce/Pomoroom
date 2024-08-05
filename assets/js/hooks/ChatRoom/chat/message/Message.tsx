import { Avatar } from "antd";
import React from "react";

export default function Message({ message }) {
	const image = "/images/default_user/default_user-05.svg";

	const setTime = (dateTime) => {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

	return (
		<div className="chat chat-end">
			<div className="chat-image avatar">
				<Avatar className="bg-red-100" src={image} size={45} />
			</div>
			<div className="chat-header">
				{message.belongs_to_user}
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