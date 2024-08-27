import React, { useState, useEffect } from "react";
import { Avatar, Button, List } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import { useEventContext } from "../EventContext";
import SimpleContact from "../chat/components/SimpleContact";

export default function Detail() {
	const { addEvent, getEventData, removeEvent } = useEventContext();
	const [chatData, setChatData] = useState(null);
	const [userLogin, setUserLogin] = useState({});
	const [members, setMembers] = useState([]);

	useEffect(() => {
		const chat = getEventData("show_detail");
		const userInfo = getEventData("show_user_info");
		const membersData = getEventData("show_members_in_group");

		if (chat) {
			setChatData(chat);
			removeEvent("show_detail")
		}

		if (userInfo) {
			setUserLogin(userInfo);
		}

		if (membersData) {
			console.log("MIEMBROS: ", membersData);
			setMembers(membersData.members_data);
		}
	}, [getEventData]);

	const hideUserDetails = () => {
		addEvent("toggle_detail_visibility", { isVisible: false, is_group: false, group_name: setNamechat() });
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

	return (
		<div className="hidden overflow-y-auto lg:pr-8 lg:flex-shrink-0 xl:pr-0 xl:block bg-gray-100 p-3" style={{ scrollbarWidth: "thin" }}>
			<div className="min-w-[28vw]">
				<Button
					className=" top-0 left-0 bg-white"
					icon={<CloseOutlined />}
					onClick={hideUserDetails}
				/>
				{chatData &&
					(<div className="text-center w-[27vw] mb-10">
						<Avatar
							src={setImageProfile()}
							size={150} alt="defualt" className="bg-white"
						/>
						<h2 className="text-2xl mt-2">
							{setNamechat()}
						</h2>
					</div>)
				}
				<div className="mb-2">
					<h4>Archivos, documentos, etc</h4>
				</div>
				<div className="grid h-[26vh] w-[27vw] overflow-y-auto justify-items-center grid-cols-3 gap-2" style={{ scrollbarWidth: "thin" }}>
					{[...Array(4)].map((_, index) => (
						<div key={index}>
							<div className="cursor-pointer bg-gray-300 hover:bg-gray-400 h-[12vh] w-[8vw]"></div>
						</div>
					))}
				</div>
				{chatData?.group_data && (
					<div className="h-[26vh] w-[27vw] overflow-y-auto bg-gray-100 mt-4" style={{ scrollbarWidth: "thin" }}>
						<div className="mb-2">
							<h4>Miembros</h4>
						</div>
						<List
							bordered
							dataSource={members}
							renderItem={item => (
								<SimpleContact
									contact={item}
									onSelect={() => console.log("Miembro ", item.nickname)}
								/>
							)}
						/>
					</div>
				)}
			</div>
		</div>
	);
}