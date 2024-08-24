import React, { useEffect, useState } from "react";
import { Button, Avatar, Flex } from "antd";
import { PhoneFilled, InfoOutlined } from '@ant-design/icons';
import { useEventContext } from "../../EventContext";

export default function HeaderChat() {
	const { addEvent, getEventData } = useEventContext();
	const [chatData, setChatData] = useState(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const privateChat = getEventData("open_private_chat");
		const groupChat = getEventData("open_group_chat");

		if (privateChat) {
			setChatData(privateChat);
		}
		if (groupChat) {
			setChatData(groupChat);
		}
	}, [getEventData]);

	const showUserDetails = () => {
		addEvent("toggle_detail_visibility", { isVisible: true });
	};

	const setImageProfile = () => {
		if (chatData.group_data) {
			return chatData.group_data.image;
		} else {
			return chatData.to_user_data.image_profile;
		}
	};

	const setNamechat = () => {
		if (chatData.group_data) {
			return chatData.group_data.name;
		} else {
			return chatData.to_user_data.nickname;
		}
	};

	return (
		<header className="flex h-[10vh] justify-between sm:items-center py-3 p-3">
			{chatData && (
				<div className="flex items-center space-x-3">
					<img
						className="h-10 w-10 rounded-full bg-pink-50 cursor-pointer"
						src={setImageProfile()}
						alt="default"
						onClick={showUserDetails}
						style={{ cursor: 'pointer' }}
					/>
					<span className="text-grey-darkest ml-3">
						{setNamechat()}
					</span>
				</div>
			)}
			<Flex gap={"small"} >
				<Button icon={<PhoneFilled />} />
				<Button className="rounded px-3 text-sm" icon={<InfoOutlined />} onClick={showUserDetails} />
			</Flex>
		</header>
	);
}