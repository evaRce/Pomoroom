import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { ClockCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import AddContact from "./AddContact";
import { useEventContext } from "../../EventContext";
import CountdownTimer from "../../timer/CountdownTimer";

export default function UserInfo() {
	const [userLogin, setUserLogin] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const { getEventData, removeEvent } = useEventContext();
	const [showTimerModal, setShowTimerModal] = useState(false);

	useEffect(() => {
		const user = getEventData("show_user_info");
		if (user) {
			setUserLogin(user);
			// removeEvent("show_user_info");
		}
	}, [getEventData]);

	const showAddEntryModal = () => {
		setShowModal(true);
	};

	const handleDataFromChild = (showModal) => {
		setShowModal(showModal);
	};

	const showTimerModalHandler = () => {
		setShowTimerModal(true);
	};

	const closeTimerModalHandler = () => {
		setShowTimerModal(false);
	};


	return (
		<div className="flex h-[10vh] w-[20vw] justify-between sm:items-center py-7 px-2 gap-2 ">
			{userLogin && (
				<div className="flex relative rounded-lg items-center space-x-2 mb-1">
					<div className="flex-shrink-0">
						<img
							className="h-10 w-10 rounded-full bg-pink-50"
							src={userLogin.image_profile}
							alt="default" />
					</div>

					<div className="flex w-[18vw] items-center justify-between">
						<span className="overflow-ellipsis overflow-hidden whitespace-nowrap truncate" title={userLogin.nickname}>
							{userLogin.nickname}
						</span>
						<div className="flex gap-1">
							<Button icon={<UserAddOutlined />} onClick={showAddEntryModal} title="Añadir contacto/grupo" />
							<Button icon={<ClockCircleOutlined />} onClick={showTimerModalHandler} title="Temporizador Pomodoro"/>
						</div>
					</div>
				</div>)
			}
			<AddContact sendDataToParent={handleDataFromChild} receiveDataFromParent={showModal} />
			<Modal
				width="auto"
				open={showTimerModal}
				onCancel={closeTimerModalHandler}
				footer={null}
				centered
				className="m-5"
			>
				<CountdownTimer />
			</Modal>
		</div>
	);
}