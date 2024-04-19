import React, { useState } from "react";
import { Button, Input, Flex, Avatar, Typography, Space } from "antd";
import { SearchOutlined, PlusOutlined, MinusOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function ChatList({})  {
	const [addMode, setAddMode] = useState(false)
  return (
    <>
			<Space direction="vertical" size="middle" >
				<Flex gap="small">
					<Input
						size="small"
						prefix={<SearchOutlined />}
						placeholder="Search"
					/>
					<Button 
						style={{ height: "auto" }} 
						size="small" 
						icon={addMode ? <PlusOutlined/> : <MinusOutlined />} 
						onClick={() => setAddMode((prev) => !prev)}
					/>
				</Flex>
				<Flex align="center" gap="small">
					<Avatar icon={<UserOutlined/>} />
					<Text strong>Elena Perez</Text>
				</Flex>
			</Space>
		</>
  );
}
