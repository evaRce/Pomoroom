import React from "react";
import HeaderChat from "./components/HeaderChat";
import BodyChat from "./components/BodyChat";
import FooterChat from "./components/FooterChat";

export default function Chat({})  {
  return(
    <div className="flex flex-col flex-grow w-full border-l border-r">
      <HeaderChat/>
      <BodyChat/>
      <FooterChat/>
    </div> 
  );
}