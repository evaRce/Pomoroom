import React, { useState, useEffect } from "react";
import { Avatar, Button } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import { useEventContext } from "../EventContext";

export default function Detail() {
	const { addEvent, getEventData, removeEvent } = useEventContext();
	const [chatData, setChatData] = useState(null);
	const [userLogin, setUserLogin] = useState({});

	useEffect(() => {
		const chat = getEventData("show_detail");
		const userInfo = getEventData("show_user_info");

		if (chat) {
			setChatData(chat);
		}

		if (userInfo) {
			setUserLogin(userInfo);
		}
	}, [getEventData]);

	const hideUserDetails = () => {
		addEvent("toggle_detail_visibility", { isVisible: false });
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
		<div className="hidden overflow-y-auto lg:pr-8 lg:flex-shrink-0 xl:pr-0 xl:block bg-gray-100 p-3">
			<div className="min-w-[20vw]">
				<Button
					className=" top-0 left-0 bg-white"
					icon={<CloseOutlined />}
					onClick={hideUserDetails}
				/>
				{chatData &&
					(<div className="text-center w-[19vw] mb-10">
						<Avatar
							src={setImageProfile()}
							size={150} alt="defualt" className="bg-white"
						/>
						<h2 className="text-2xl mt-2">
							{setNamechat()}
						</h2>
					</div>)
				}
				<div className="mb-2 text-center">
					<h4>Archivos, documentos, etc</h4>
				</div>
				<div className="grid justify-items-center grid-cols-2 w-[19vw] gap-2 ">
					{[...Array(10)].map((_, index) => (
						<div key={index}>
							<div className="cursor-pointer bg-gray-300 hover:bg-gray-400 h-[10vh] w-[8vw]"></div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}