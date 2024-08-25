import React, { useEffect, useState } from "react";
import { Button, Flex } from "antd";
import { PhoneFilled, InfoOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useEventContext } from "../../EventContext";
import AddContactsToGroup from "./AddContactsToGroup";

export default function HeaderChat() {
	const { addEvent, getEventData } = useEventContext();
	const [chatData, setChatData] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);


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

	const addContactsToGroup = () => {
		addEvent("get_my_contacts_in_group", {});
		setIsModalVisible(true);
	};

	const handleModalVisible = (isModalVisible) => {
		setIsModalVisible(isModalVisible);
	}

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
				{chatData?.group_data && (
					<Button className="rounded-md" icon={<UsergroupAddOutlined />} onClick={addContactsToGroup} title="Añadir miembros" />
				)}
				<Button icon={<PhoneFilled />} title="LLamar" />
				<Button className="rounded px-3 text-sm" icon={<InfoOutlined />} onClick={showUserDetails} title="Detalles del contacto" />
			</Flex>
			{chatData?.group_data && (
				<AddContactsToGroup chatData={chatData} isModalVisibleFromAddContacts={handleModalVisible} isModalVisibleFromHeader={isModalVisible} />
			)}
		</header>
	);
}