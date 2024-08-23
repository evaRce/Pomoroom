import React, { useState, useEffect } from "react";
import ChatList from "./list/ChatList";
import Chat from "./chat/Chat";
import Detail from "./detail/Detail";
import BackGround from "./chat/BackGround";
import { useEventContext } from "./EventContext";
import RequestReceived from "./friend_request/RequestReceived";
import RequestSend from "./friend_request/RequestSend";
import RejectedRequestSend from "./friend_request/RejectedRequestSend";
import RejectedRequestReceived from "./friend_request/RejectedRequestReceived";
export interface ChatRoomProps {
	eventName: string;
	eventData: any;
	pushEventToLiveView(event: string, payload: object): any;
}

export const ChatRoom: React.FC<ChatRoomProps> = (props: ChatRoomProps) => {
	const { eventName, eventData, pushEventToLiveView } = props;
	const { addEvent, getEventData, removeEvent } = useEventContext();
	const [isSelectedContact, setIsSelectedContact] = useState(false);
	const [component, setComponent] = useState("");
	const [imageNumber, setImageNumber] = useState(1);
	const [userName, setUserName] = useState("");
	const [isVisibleDetail, setIsVisibleDetail] = useState(false);

	useEffect(() => {
		const randomImageNumber = Math.floor(Math.random() * 5) + 1;
		setImageNumber(randomImageNumber);
		pushEventToLiveView("action.get_user_info", {});
	}, []);

	useEffect(() => {
		const contactToDelete = getEventData("delete_contact");
		const selectedChat = getEventData("selected_chat");
		const sendMessage = getEventData("send_message");
		const sendFriendRequest = getEventData("send_friend_request");
		const statusFriendRequest = getEventData("update_status_request");
		const visibility = getEventData("toggle_detail_visibility");
		const addGroup = getEventData("add_group");

		if (addGroup) {
			pushEventToLiveView("action.add_group", addGroup);
			removeEvent("add_group");
		}
		if (contactToDelete) {
			pushEventToLiveView("action.delete_contact", contactToDelete);
			setComponent("");
			setIsSelectedContact(false);
			removeEvent("delete_contact");
		}
		if (selectedChat) {
			setIsSelectedContact(true);
			pushEventToLiveView("action.selected_chat", selectedChat);
			removeEvent("selected_chat");
		}
		if (sendMessage) {
			pushEventToLiveView("action.send_message", sendMessage);
			removeEvent("send_message");
		}
		if (sendFriendRequest) {
			pushEventToLiveView("action.send_friend_request", sendFriendRequest);
			removeEvent("send_friend_request");
		}
		if (statusFriendRequest) {
			pushEventToLiveView("action.update_status_request", statusFriendRequest);
			removeEvent("update_status_request");
		}
		if (visibility) {
			setIsVisibleDetail(visibility.isVisible);
			removeEvent("toggle_detail_visibility");
		}
	}, [addEvent]);

	useEffect(() => {
		if (eventName === "show_user_info" && eventData.email) {
			setUserName(eventData.nickname);
			addEvent(eventName, eventData);
		}
	}, [eventData.email]);

	useEffect(() => {
		if (eventName === "add_contact_to_list" && eventData.contact_data) {
			addEvent(eventName, eventData);
		}
	}, [eventData.contact_data, eventData.request])

	useEffect(() => {
		if (eventName === "add_group_to_list" && eventData.group_data) {
			addEvent(eventName, eventData);
		}
	}, [eventData.group_data, eventData.status])

	useEffect(() => {
		if (eventName === "error_adding_contact" && eventData.error) {
			addEvent(eventName, eventData.error);
		}
	}, [eventData.error]);

	useEffect(() => {
		if (eventName === "show_list_contact" && eventData.contact_list) {
			addEvent(eventName, eventData.contact_list);
		}
	}, [eventData.contact_list]);

	useEffect(() => {
		if (eventName === "open_chat" && eventData.to_user_data) {
			addEvent(eventName, eventData);
			addEvent("show_list_messages", eventData);
			addEvent("show_detail", eventData);
			setComponent("Chat");
		}
	}, [eventData.from_user_data, eventData.messages]);

	useEffect(() => {
		if (eventName === "show_message_to_send" && eventData.from_user_data) {
			addEvent(eventName, eventData);
		}
	}, [eventData.from_user_data, eventData.message_data]);

	useEffect(() => {
		if (eventName === "open_chat_request_send" && userName == eventData.request.from_user) {
			addEvent(eventName, eventData.request);
			setComponent("RequestSend");
		}
		if (eventName === "open_chat_request_received" && userName == eventData.request.to_user) {
			addEvent(eventName, eventData.request);
			setComponent("RequestReceived");
		}
	}, [eventData.request]);

	useEffect(() => {
		if (eventName === "open_rejected_request_send" && userName == eventData.request.to_user) {
			addEvent(eventName, eventData);
			setComponent("RejectedRequestSend");
		}
		if (eventName === "open_rejected_request_received" && userName == eventData.request.from_user) {
			addEvent(eventName, eventData);
			setComponent("RejectedRequestReceived");
		}
	}, [eventData.to_user_data, eventData.from_user_data, eventData.request]);

	return (
		<div className="flex h-screen w-screen min-h-screen md:min-h-48 overflow-x-hidden">
			<ChatList />
			{component === "Chat" && <Chat />}
			{component === "RequestSend" && <RequestSend imageNumber={imageNumber} />}
			{component === "RequestReceived" && <RequestReceived imageNumber={imageNumber} />}
			{component === "RejectedRequestSend" && <RejectedRequestSend imageNumber={imageNumber} />}
			{component === "RejectedRequestReceived" && <RejectedRequestReceived imageNumber={imageNumber} />}
			{!isSelectedContact && <BackGround imageNumber={imageNumber} />}
			{isVisibleDetail === true && <Detail />}
		</div>
	);
}
