import React from "react";
import { Button, Avatar, Flex } from "antd";
import {
	UserOutlined,
	PhoneFilled,
	InfoOutlined
} from '@ant-design/icons';

export default function HeaderChat({ }) {
	return (
		<div className="flex px-5 pt-5 justify-between sm:items-center py-3 p-3">
			<div className="flex justify-between">
				<Avatar size={"large"} icon={<UserOutlined />} />
				<div className="ml-4 items-center">
					<span className="text-grey-darkest">user2</span>
					<p className="text-sm">Lorem ipsum dolor</p>
				</div>
			</div>
			<Flex gap={"small"} >
				<Button icon={<PhoneFilled />} />
				<Button className="rounded px-3 text-sm" icon={<InfoOutlined />} />
			</Flex>
		</div>
	);
}