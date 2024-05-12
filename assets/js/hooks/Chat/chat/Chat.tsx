import React from "react";
import HeaderChat from "./HeaderChat";
import BodyChat from "./BodyChat";
import FooterChat from "./FooterChat";

export default function Chat({})  {
  return(
    <div className="flex-1 flex-col p:2 sm:pb-6 xl-flex border-l border-r">
      <HeaderChat/>
      <BodyChat/>
      <FooterChat/>
    </div> 
  );
}