import React from "react";
import { Avatar, Button, Typography } from "antd";
import { UserOutlined, MoreOutlined, UsergroupAddOutlined, SettingOutlined} from '@ant-design/icons';

const { Text } = Typography;

export default function UserInfo({ user_info })  {
	return(
		<div className="flex h-[10vh] w-[20vw] gap-2 justify-between items-center">
			<div className="flex relative p-1 rounded-lg items-center space-x-2 mb-1">
				<div className="flex-shrink-0"> 
					<img 
						className="h-10 w-10 rounded-full"
						src="https://upload.wikimedia.org/wikipedia/en/9/99/Dr_carter.jpg"/> 
				</div>
				<div className="flex w-[18vw] items-center justify-between">
					<span className="text-sm max-h-[8vh] max-w-[7vw]">
					{user_info.nickname}
					</span>
					<div className="flex gap-1 ">
						<Button className="rounded-md" icon={<UsergroupAddOutlined/>} />
						<Button className="rounded-md" icon={<MoreOutlined/>} />
					</div>
				</div>
			</div>
			
		</div>
	);
}