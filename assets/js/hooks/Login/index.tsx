import React from "react";
import { createRoot } from "react-dom/client";
import { Login, LoginProps } from "./login";

// const domNode = document.getElementById('login') as HTMLElement;
// const rootElement = createRoot(domNode);

export default {
	mounted() {
		render(rootElement, this.opts());
		this.handleEvent("react.login", ({ user_log: user_log, passw_log: passw_log }) => {
			render(rootElement, this.opts(user_log, passw_log));
		});
	},

	destroyed() {
		rootElement.unmount()
	},
  
	opts(user_log, pass_log): LoginProps {
		return {
			username: user_log,
			password: pass_log
		};
	},
}

function render(rootElement: any, opts: LoginProps) {
	rootElement.render(
		<React.StrictMode>
			<Login {...opts}/>
		</React.StrictMode>
	);
}