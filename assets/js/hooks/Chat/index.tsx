import React from "react";
import {createRoot} from "react-dom/client";
import {ChatRoom, ChatRoomProps} from "./ChatRoom";

export default {
	mounted(){
		const chatDomNode = document.getElementById('chat_container') as Element;
		const rootElement3 = createRoot(chatDomNode);
		render(rootElement3, this.opts());
	},

	destroyed() {
		const chatDomNode = document.getElementById('chat_container') as Element;
		const rootElement3 = createRoot(chatDomNode);
		rootElement3.unmount()
	},

	opts(): ChatRoomProps {
		return {};
	},
}

function render(rootElement3: any, opts: ChatRoomProps) {
	rootElement3.render(
		<React.StrictMode>
			<ChatRoom {...opts}/>
		</React.StrictMode>
	);
}