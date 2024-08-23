import React, { useEffect, useState } from "react";
import { Button, Avatar, Flex } from "antd";
import { PhoneFilled, InfoOutlined } from '@ant-design/icons';
import { useEventContext } from "../../EventContext";

export default function HeaderChat() {
	const { addEvent, getEventData } = useEventContext();
	const [chatData, setChatData] = useState(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const chat = getEventData("open_chat");
		if (chat) {
			setChatData(chat);
		}
	}, [getEventData]);

	const toggleUserDetails = () => {
		setIsVisible(prevIsVisible => {
			const newIsVisible = !prevIsVisible;
			addEvent("toggle_detail_visibility", { isVisible: newIsVisible });
			return newIsVisible;
		});
	};

	return (
		<header className="flex h-[10vh] justify-between sm:items-center py-3 p-3">
			{chatData && (
				<div className="flex items-center space-x-3">
					<img
						className="h-10 w-10 rounded-full bg-pink-50 cursor-pointer"
						src={chatData.to_user_data.image_profile}
						alt="default"
						onClick={toggleUserDetails}
						style={{ cursor: 'pointer' }}
					/>
					<span className="text-grey-darkest ml-3">
						{chatData.to_user_data.nickname}
					</span>
				</div>
			)}
			<Flex gap={"small"} >
				<Button icon={<PhoneFilled />} />
				<Button className="rounded px-3 text-sm" icon={<InfoOutlined />} onClick={toggleUserDetails} />
			</Flex>
		</header>
	);
}