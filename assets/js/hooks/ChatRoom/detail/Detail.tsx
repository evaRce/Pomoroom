import React, { useState, useEffect } from "react";
import { Avatar } from "antd";
import { useEventContext } from "../EventContext";

export default function Detail() {
	const { getEventData, removeEvent } = useEventContext();
	const [chatData, setChatData] = useState(null);

	useEffect(() => {
		const chat = getEventData("show_detail");
		if (chat) {
			setChatData(chat);
		}
	}, [getEventData]);

	return (
		<div className="hidden overflow-y-auto lg:pr-8 lg:flex-shrink-0 xl:pr-0 xl:block bg-gray-100 p-3">
			<div className="min-w-[20vw]">
				{chatData &&
					(<div className="text-center w-[19vw] mb-10">
						<Avatar
							src={chatData.group_data ? chatData.group_data.image : chatData.to_user_data.image_profile}
							size={150} alt="defualt" className="bg-white"
						/>
						<h2 className="text-2xl mt-2">
							{chatData.group_data ? chatData.group_data.name : chatData.to_user_data.nickname}
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