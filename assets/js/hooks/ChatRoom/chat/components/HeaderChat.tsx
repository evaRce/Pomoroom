import React, { useEffect, useState } from "react";
import { Button, Flex } from "antd";
import { PhoneFilled, InfoOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useEventContext } from "../../EventContext";
import AddMembersToGroup from "./AddMembersToGroup";

export default function HeaderChat({ userLogin }) {
	const { addEvent, getEventData, removeEvent } = useEventContext();
	const [chatData, setChatData] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isGroup, setIsGroup] = useState(false);
	const [checkAdmin,  setCheckAdmin] = useState({});

	useEffect(() => {
		const privateChat = getEventData("open_private_chat");
		const groupChat = getEventData("open_group_chat");
		const adminData = getEventData("check_admin");

		if (privateChat) {
			setIsGroup(false);
			setChatData(privateChat);
		}
		if (groupChat) {
			setIsGroup(true);
			setChatData(groupChat);
		}
		if (adminData) {
			setCheckAdmin(adminData);
		}
	}, [getEventData]);

	const showUserDetails = () => {
		addEvent("toggle_detail_visibility", { is_visible: true, is_group: isGroup, group_name: setNamechat() });
		addEvent("show_detail", { chat_name: setNamechat(), image: setImageProfile(), is_group: isGroup })
	};

	const setImageProfile = () => {
		if (chatData.group_data) {
			return chatData.group_data.image;
		} else {
			if (userLogin.nickname == chatData.from_user_data.nickname) {
				return chatData.to_user_data.image_profile;
			} else if (userLogin.nickname == chatData.to_user_data.nickname) {
				return chatData.from_user_data.image_profile;
			}
		}
	};

	const setNamechat = () => {
		if (chatData.group_data) {
			return chatData.group_data.name;
		} else {
			if (userLogin.nickname == chatData.from_user_data.nickname) {
				return chatData.to_user_data.nickname;
			} else if (userLogin.nickname == chatData.to_user_data.nickname) {
				return chatData.from_user_data.nickname;
			}
		}
	};

	const addMembersToGroup = () => {
		addEvent("get_my_contacts", { group_name: chatData.group_data.name });
		setIsModalVisible(true);
	};

	const handleModalVisible = (isModalVisible) => {
		setIsModalVisible(isModalVisible);
	}

	return (
		<header className="flex h-[10vh] justify-between items-center py-7 px-3 bg-gray-100 ">
			{chatData && (
				<div className="flex items-center space-x-3">
					<img
						className="h-10 w-10 rounded-full bg-white cursor-pointer"
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
			<div className="flex items-center gap-2">
				{chatData?.group_data && checkAdmin.is_admin && (
					<Button className="bg-white" icon={<UsergroupAddOutlined />} onClick={addMembersToGroup} title="Añadir miembros" />
				)}
				<Button className="bg-white" icon={<PhoneFilled />} title="LLamar" />
				<Button className="bg-white" icon={<InfoOutlined />} onClick={showUserDetails} title="Detalles del contacto" />
			</div>
			{chatData?.group_data && (
				<AddMembersToGroup chatData={chatData} isModalVisibleFromAddContacts={handleModalVisible} isModalVisibleFromHeader={isModalVisible} />
			)}
		</header>
	);
}