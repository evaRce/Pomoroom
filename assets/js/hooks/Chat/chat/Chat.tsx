import React from "react";
import HeaderChat from "./HeaderChat";
import BodyChat from "./BodyChat";
import FooterChat from "./FooterChat";

export default function Chat({})  {
  return(
    <div className="flex flex-col flex-grow w-full border-l border-r">
      <HeaderChat/>
      <BodyChat/>
      <FooterChat/>
    </div> 
  );
}