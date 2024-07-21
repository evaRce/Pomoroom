import React, { useEffect, useState } from "react";
import { Button, Avatar, Flex } from "antd";
import {
	PhoneFilled,
	InfoOutlined
} from '@ant-design/icons';
import { useEventContext } from "../../EventContext";

export default function HeaderChat({ }) {
	const imSender = "/images/default_user/default_user-02.svg";
	const { getEventData, removeEvent } = useEventContext();
	const [nickname, setNickname] = useState("");

	useEffect(() => {
		const show = getEventData("show_chat");
		if (show) {
			setNickname(show);
			removeEvent("show_chat")
		}
	}, [getEventData]);

	return (
		<header className="flex h-[10vh] justify-between sm:items-center py-3 p-3">
			<div className="flex items-center space-x-3">
        <Avatar src={imSender} size={"large"} />
        <span className="text-grey-darkest ml-3">
					{nickname}
				</span>
			</div>
			<Flex gap={"small"} >
				<Button icon={<PhoneFilled />} />
				<Button className="rounded px-3 text-sm" icon={<InfoOutlined />} />
			</Flex>
		</header>
	);
}