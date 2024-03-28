import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { SignUp, SignUpProps } from "./signup"

export default{
    mounted() {
        this.handleEvent("react.signup", ({email: email_,
											password: password_,
											nickname: nickname_}) => {
            mount(this.el.id, this.opts(email_, password_, nickname_));
		});
		this.unmountComponent = mount(this.el.id, this.opts());
	},
      
	destroyed() {
		if (!this.unmountComponent) {
			console.error("Login unmountComponent not set");
			return;
		}
		this.unmountComponent(this.el);
	},

	// updateCount(newCount) {
	//   this.pushEventTo(this.el, "log", { newCount: newCount });
	// },

	submitUser(email_, password_, nickname_) {
		this.pushEventTo(this.el, "action.save", { email: email_, password: password_, nickname: nickname_ })
	},

	opts(): SignUpProps {
		return {
			email: "defemail",
			password: "defpassw",
			nickname: "defnick",
			submitUser: this.submitUser.bind(this),
		}
	},
}
	

export function mount(id: string, opts: SignUpProps) {
	const rootElement = document.getElementById(id);

	render(
		<React.StrictMode>
		<SignUp {...opts}/>
		</React.StrictMode>,
		rootElement
	);

	return (el: Element) => {
		if (!unmountComponentAtNode(el)) {
		console.warn("unmount failed", el);
		}
	};
}