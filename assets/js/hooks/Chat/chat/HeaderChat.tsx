import React from "react";
import { Button, Avatar, Flex } from "antd";
import {
	UserOutlined,
	PhoneFilled,
	InfoOutlined
} from '@ant-design/icons';

export default function HeaderChat({ }) {
	const imSender = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";

	return (
		<header className="flex h-[10vh] justify-between sm:items-center py-3 p-3">
			<div className="flex justify-between">
				<Avatar src={imSender} size={50} />
				<div className="ml-4 items-center">
					<span className="text-grey-darkest">user2</span>
					<p className="text-sm">Lorem ipsum dolor</p>
				</div>
			</div>
			<Flex gap={"small"} >
				<Button icon={<PhoneFilled />} />
				<Button className="rounded px-3 text-sm" icon={<InfoOutlined />} />
			</Flex>
		</header>
	);
}