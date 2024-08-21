import React, { useEffect, useState } from "react";
import { Button, Avatar, Flex } from "antd";
import { PhoneFilled, InfoOutlined } from '@ant-design/icons';
import { useEventContext } from "../../EventContext";

export default function HeaderChat() {
	const { getEventData } = useEventContext();
  const [chatData, setChatData] = useState(null);

	useEffect(() => {
		const chat = getEventData("open_chat");
		if (chat) {
			setChatData(chat);
		}
	}, [getEventData]);

	return (
		<header className="flex h-[10vh] justify-between sm:items-center py-3 p-3">
			{chatData && (
				<div className="flex items-center space-x-3">
					<img
						className="h-10 w-10 rounded-full bg-pink-50"
						src={chatData.to_user_data.image_profile}
						alt="default"
					/>
					<span className="text-grey-darkest ml-3">
						{chatData.to_user_data.nickname}
					</span>
				</div>
			)}
			<Flex gap={"small"} >
				<Button icon={<PhoneFilled />} />
				<Button className="rounded px-3 text-sm" icon={<InfoOutlined />} />
			</Flex>
		</header>
	);
}