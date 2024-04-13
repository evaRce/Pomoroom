import React from "react";
import { createRoot } from "react-dom/client";
import { Login, LoginProps } from "./login";

export default {
	
	mounted() {
		const loginDomNode = document.getElementById('login') as Element;
		const rootElement2 = createRoot(loginDomNode);

		render(rootElement2, this.opts());
		this.handleEvent("react.login", ({ user_log: user_log, passw_log: passw_log }) => {
			render(rootElement2, this.opts(user_log, passw_log));
		});
	},

	destroyed() {
		const loginDomNode = document.getElementById('login') as Element;
		const rootElement2 = createRoot(loginDomNode);
		rootElement2.unmount()
	},
  
	opts(user_log, pass_log): LoginProps {
		return {
			username: user_log,
			password: pass_log
		};
	},
}

function render(rootElement2: any, opts: LoginProps) {
	rootElement2.render(
		<React.StrictMode>
			<Login {...opts}/>
		</React.StrictMode>
	);
}