import { Avatar } from "antd";
import React, { useState, useEffect } from "react";
import { useEventContext } from "../../EventContext";

export default function Message({ message }) {
	const [userName, setUserName] = useState("");
	const image = "/images/default_user/default_user-05.svg";
	const { getEventData, removeEvent } = useEventContext();

	useEffect(() => {
		const user = getEventData("show_user_info");
		if (user) {
			setUserName(user.nickname);
			// removeEvent("show_user_info");
		}
	}, [getEventData]);


	const setTime = (dateTime) => {
		const date = new Date(dateTime);
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${hours}:${minutes}`;
	};

	const messagePosition = message.belongs_to_user === userName ? "chat-end" : "chat-start";

	return (
		<div className={`chat ${messagePosition}`}>
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