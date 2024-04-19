import React from "react";
import {createRoot} from "react-dom/client";
import {Main, MainProps} from "./Main";

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

	opts(): MainProps {
		return {};
	},
}

function render(rootElement3: any, opts: MainProps) {
	rootElement3.render(
		<React.StrictMode>
			<Main {...opts}/>
		</React.StrictMode>
	);
}