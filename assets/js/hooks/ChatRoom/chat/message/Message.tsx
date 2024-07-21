import { Avatar } from "antd";
import React from "react";

export default function Message({ message }) {
	const image = "/images/default_user/default_user-05.svg";

	return (
		<div className="chat chat-end">
			<div className="chat-image avatar">
				<Avatar className="bg-red-100" src={image} size={45}/>
			</div>
			<div className="chat-header">
				{message.name}
			</div>
			<div className="chat-bubble" style={{ maxWidth: "70%", wordWrap: "break-word" }}>
				{message.text}
				{/* <div>
					<time className="text-xs opacity-50">12:46</time>
				</div> */}
			</div>
		</div>
	);
}