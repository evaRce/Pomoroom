import React from "react";
import { Avatar, Button, Typography } from "antd";
import { UserOutlined, MoreOutlined, UsergroupAddOutlined, SettingOutlined} from '@ant-design/icons';

const { Text } = Typography;

export default function UserInfo({})  {
	return(
		<div className="flex pb-3 justify-between items-center">
			<Avatar src="https://upload.wikimedia.org/wikipedia/en/9/99/Dr_carter.jpg" size={50}/>
			<p> John Carter</p>
			<div className="flex gap-2">
				{/* <Button className=" bg-pink-500 text-white rounded-md px-3" icon={<SettingOutlined/>} /> */}
				<Button className="rounded-md px-3" icon={<UsergroupAddOutlined/>} />
				<Button className="rounded-md px-3" icon={<MoreOutlined/>} />
				
			</div>
		</div>
	);
}