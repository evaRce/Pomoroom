import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Login, LoginProps } from "./login";

export default {
  mounted() {
    this.handleEvent("react.login", ({ user_log: user_log, passw_log: passw_log }) => {
      mount(this.el.id, this.opts(user_log, passw_log));
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
  

  opts(): LoginProps {
    return {
      username: "Counters",
      password: "1"
    };
  },
}

export function mount(id: string, opts: LoginProps) {
  const rootElement = document.getElementById(id);

  render(
    <React.StrictMode>
      <Login {...opts} />
    </React.StrictMode>,
    rootElement
  );

  return (el: Element) => {
    if (!unmountComponentAtNode(el)) {
      console.warn("unmount failed", el);
    }
  };
}