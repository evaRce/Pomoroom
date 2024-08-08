import React, { useEffect, useState } from "react";
import { Button, Avatar, Flex } from "antd";
import { PhoneFilled, InfoOutlined } from '@ant-design/icons';
import { useEventContext } from "../../EventContext";

export default function HeaderChat({ }) {
	const imSender = "/images/default_user/default_user-02.svg";
	const { getEventData } = useEventContext();
	const [contactName, setContactName] = useState("");

	useEffect(() => {
		const contactData = getEventData("open_chat");
		if (contactData) {
			setContactName(contactData);
		}
	}, [getEventData]);

	return (
		<header className="flex h-[10vh] justify-between sm:items-center py-3 p-3">
			<div className="flex items-center space-x-3">
				<Avatar src={imSender} size={"large"} />
				<span className="text-grey-darkest ml-3">
					{contactName}
				</span>
			</div>
			<Flex gap={"small"} >
				<Button icon={<PhoneFilled />} />
				<Button className="rounded px-3 text-sm" icon={<InfoOutlined />} />
			</Flex>
		</header>
	);
}