import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { UserOutlined, MoreOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import AddContact from "./AddContact";
import { useEventContext } from "../../EventContext";

export default function UserInfo({ }) {
	const [nickname, setNickname] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { getEventData, removeEvent } = useEventContext();

	useEffect(() => {
    const user_nickname = getEventData("show_user_info");
    if (user_nickname) {
      setNickname(user_nickname);
			removeEvent("show_user_info");
    }
  }, [getEventData]);

  const showAddEntryModal = () => {
    setShowModal(true);
  };

  const handleDataFromChild = (showModal) => {
    setShowModal(showModal);
  };

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
					{nickname}
					</span>
					<div className="flex gap-1">
						<Button className="rounded-md" icon={<UsergroupAddOutlined/>} onClick={showAddEntryModal}/>
						<Button className="rounded-md" icon={<MoreOutlined/>} />
					</div>
				</div>
			</div>
			<AddContact sendDataToParent={handleDataFromChild} receiveDataFromParent={showModal} />
		</div>
	);
}