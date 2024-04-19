import React from "react";
import { Button, Flex, Space } from "antd";
import UserInfo from "./userInfo/UserInfo";
import ChatList from "./chatList/ChatList";


export default function List({})  {
	return(
		<>
			<Space direction="vertical" size="middle" >
				<UserInfo/>
				<ChatList/>
			</Space>
		</>	
	);
}
