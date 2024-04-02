import React from "react";
import { createRoot } from "react-dom/client";
import { SignUp, SignUpProps} from "./signup"

const domNode = document.getElementById('signup') as HTMLElement;
const rootElement = createRoot(domNode);

export default{
    mounted() {
		render(rootElement, this.opts());
        this.handleEvent("react.error_save_user", ({errors}) => {
			render(rootElement, this.opts(errors))
		});
	},
      
	destroyed() {
		rootElement.unmount()
	},

	submitUser(email_, password_, nickname_) {
		this.pushEventTo(this.el, "action.save_user", { email: email_, password: password_, nickname: nickname_ })
	},

	opts(error_save_user = {}): SignUpProps {
		return {
			submitUser: this.submitUser.bind(this),
			errors: error_save_user
		}
	},
}

function render(rootElement: any, opts: SignUpProps) {
	rootElement.render(
		<React.StrictMode>
			<SignUp {...opts}/>
		</React.StrictMode>
	);
}