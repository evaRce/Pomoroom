import React from "react";
import { Flex, Avatar, Button, Typography } from "antd";
import { UserOutlined, MoreOutlined, AudioFilled, FormOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function UserInfo({})  {
	return(
		<>
			<Flex gap="large">
				<Flex align="center" gap="small">
					<Avatar icon={<UserOutlined/>} />
					<Text strong>John Carter</Text>
				</Flex>
				<Flex align="center" gap="small">
					<Button size="small" shape="circle" icon={<MoreOutlined/>} />
					<Button size="small" shape="circle" icon={<AudioFilled/>} />
					<Button size="small" shape="circle" icon={<FormOutlined/>} />
				</Flex>
			</Flex>
		</>	
	);
}
