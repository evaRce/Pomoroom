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

	useEffect(() => {
		const randomImageNumber = Math.floor(Math.random() * 5) + 1;
		setImageNumber(randomImageNumber);
		pushEventToLiveView("action.get_user_info", {});
	}, []);

	useEffect(() => {
		const contactInfo = getEventData("add_contact");
		const contactToDelete = getEventData("delete_contact");
		const selectedChat = getEventData("selected_chat");
		const sendMessage = getEventData("send_message");
		const sendFriendRequest = getEventData("send_friend_request");
		const statusFriendRequest = getEventData("send_status_request");

		// if (contactInfo) {
		// 	pushEventToLiveView("action.add_contact", contactInfo);
		// 	removeEvent("add_contact");
		// }
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
			pushEventToLiveView("action.send_status_request", statusFriendRequest);
			removeEvent("send_status_request");
		}
	}, [addEvent]);


	useEffect(() => {
		if (eventName === "show_user_info" && eventData.nickname) {
			setUserName(eventData.nickname);
			addEvent(eventName, eventData);
		}
	}, [eventData.nickname]);

	useEffect(() => {
		if (eventName === "add_contact_to_list" && eventData.contact) {
			addEvent(eventName, eventData);
		}
	}, [eventData.contact])

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
		if (eventName === "open_chat" && eventData.contact_name) {
			addEvent(eventName, eventData);
			addEvent("show_list_messages", eventData.messages);
			setComponent("Chat");
		}
	}, [eventData.contact_name, eventData.messages]);

	useEffect(() => {
		if (eventName === "show_message_to_send" && eventData.public_id_msg) {
			addEvent(eventName, eventData);
		}
	}, [eventData.public_id_msg, eventData.contact_name]);

	useEffect(() => {
		if (eventName === "open_rejected_request_send" && userName == eventData.contact_name) {
			addEvent("rejected_request", { status: "rejected", contact_name: eventData.contact_name, owner_name: eventData.owner_name });
			addEvent(eventName, eventData);
			setComponent("RejectedRequestSend");
		}
		if (eventName === "open_rejected_request_received" && userName == eventData.owner_name) {
			addEvent("rejected_request", { status: "rejected", contact_name: eventData.contact_name, owner_name: eventData.owner_name });
			addEvent(eventName, eventData);
			setComponent("RejectedRequestReceived");
		}
		if (eventName === "open_chat_request_send") {
			addEvent(eventName, eventData);
			setComponent("RequestSend");
		}
		if (eventName === "open_chat_request_received") {
			addEvent(eventName, eventData);
			setComponent("RequestReceived");
		}
	}, [eventName]);

	return (
		<div className="flex h-screen w-screen min-h-screen md:min-h-48 overflow-x-hidden">
			<ChatList />
			{component === "Chat" && <Chat />}
			{component === "RequestSend" && <RequestSend imageNumber={imageNumber} />}
			{component === "RequestReceived" && <RequestReceived imageNumber={imageNumber} />}
			{component === "RejectedRequestSend" && <RejectedRequestSend imageNumber={imageNumber} />}
			{component === "RejectedRequestReceived" && <RejectedRequestReceived imageNumber={imageNumber} />}
			{!isSelectedContact && <BackGround imageNumber={imageNumber} />}
			<Detail />
		</div>
	);
}
