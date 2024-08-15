import React, { useEffect, useState } from "react";
import { Button, Avatar, Flex } from "antd";
import { PhoneFilled, InfoOutlined } from '@ant-design/icons';
import { useEventContext } from "../../EventContext";

export default function HeaderChat() {
	const { getEventData } = useEventContext();
	const [contactData, setContactData] = useState(null);

	useEffect(() => {
		const contact = getEventData("open_chat");
		if (contact) {
			setContactData(contact);
		}
	}, [getEventData]);

	return (
		<header className="flex h-[10vh] justify-between sm:items-center py-3 p-3">
			{contactData && (
				<div className="flex items-center space-x-3">
					<img
						className="h-10 w-10 rounded-full bg-pink-50"
						src={contactData.image_profile}
						alt="default"
					/>
					<span className="text-grey-darkest ml-3">
						{contactData.contact_name}
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