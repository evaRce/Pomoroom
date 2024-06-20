import { Avatar } from "antd";
import React from "react";

export default function Message({ message }) {
	const imSender = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";
	const imReceiver = "https://upload.wikimedia.org/wikipedia/en/9/99/Dr_carter.jpg";

	return (
		<>
			<div className="chat chat-start">
				<div className="chat-image avatar">
					<Avatar src={imSender} size={45}/>
				</div>
				<div className="chat-header">
					{message.name}
				</div>
				<div className="chat-bubble" style={{ maxWidth: "70%", wordWrap: "break-word" }}>
					{message.text}
					{/* <div>
						<time className="text-xs opacity-50">12:45</time>
					</div> */}
				</div>
			</div>
			<div className="chat chat-end">
				<div className="chat-image avatar">
					<Avatar src={imReceiver} size={45}/>
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
		</>
	);
}