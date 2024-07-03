import React from "react";
import {createRoot} from "react-dom/client";
import {ChatRoom, ChatRoomProps } from "./ChatRoom";

export default {
	mounted(){
		const chatDomNode = document.getElementById('chat_container') as Element;
		const rootElementChat = createRoot(chatDomNode);
		
		render(rootElementChat, this.opts());
		this.pushEventTo(this.el, "action.initialize_user_info")
    this.handleEvent("react.initialize_user_info", ({user_info}) => {
			render(rootElementChat, this.opts(user_info))
		});
	},

	destroyed() {
		const chatDomNode = document.getElementById('chat_container') as Element;
		const rootElementChat = createRoot(chatDomNode);
		rootElementChat.unmount()
	},

	opts(user_info = {}) {
		return { 
			user_info: user_info
		};
	},
}

function render(rootElement3: any, opts: ChatRoomProps) {
	rootElement3.render(
		<React.StrictMode>
			<ChatRoom {...opts}/>
		</React.StrictMode>
	);
}