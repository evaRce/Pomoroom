import React from "react";
import { createRoot } from "react-dom/client";
import { Login, LoginProps } from "./login";

export default {
	
	mounted() {
		const loginDomNode = document.getElementById('login') as Element;
		const rootElement2 = createRoot(loginDomNode);

		render(rootElement2, this.opts());
		// this.handleEvent("react.login_error", ({ email: email, password: password }) => {
		// 	render(rootElement2, this.opts(email, password));
		// });
	},

	destroyed() {
		const loginDomNode = document.getElementById('login') as Element;
		const rootElement2 = createRoot(loginDomNode);
		rootElement2.unmount()
	},

	searchUser(email, password) {
		this.pushEventTo(this.el, "action.log_user", {email: email, password: password})
	},
  
	opts(): LoginProps {
		return {
			searchUser: this.searchUser.bind(this)
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