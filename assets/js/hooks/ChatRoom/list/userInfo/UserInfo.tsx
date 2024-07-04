import React, { useState } from "react";
import { Button } from "antd";
import { UserOutlined, MoreOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import AddGroup from "./AddGroup";
import AddContact from "./AddContact";

export default function UserInfo({ user_info }) {
	const [showModalContact, setShowModalContact] = useState(false);
	const [showModalGroup, setShowModalGroup] = useState(false);
	

	const showAddContactModal = () => {
		setShowModalContact(true)
	};

	const showAddGroupModal = () => {
		setShowModalGroup(true)
	};

	function handleDataFromChild1(showModal) {
    setShowModalContact(showModal);
  }

	function handleDataFromChild2(showModal) {
		setShowModalGroup(showModal);
  }

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
					<div className="flex gap-1">
						<Button className="rounded-md" icon={<UserOutlined/>} onClick={showAddContactModal}/>
						<Button className="rounded-md" icon={<UsergroupAddOutlined/>} onClick={showAddGroupModal}/>
						<Button className="rounded-md" icon={<MoreOutlined/>} />
					</div>
				</div>
			</div>
			<AddContact sendDataToParent={handleDataFromChild1} receiveDataFromParent={showModalContact}/>
			<AddGroup sendDataToParent={handleDataFromChild2} receiveDataFromParent={showModalGroup} />
		</div>
	);
}