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
		const selectedPrivateChat = getEventData("selected_private_chat");
		const sendMessage = getEventData("send_message");
		const sendFriendRequest = getEventData("send_friend_request");
		const statusFriendRequest = getEventData("update_status_request");
		const visibility = getEventData("toggle_detail_visibility");
		const addGroup = getEventData("add_group");
		const selectedGroupChat = getEventData("selected_group_chat");
		const groupToDelete = getEventData("delete_group");
		const showMyContactsInGroup = getEventData("get_my_contacts");
		const addContactToGroup = getEventData("add_member");
		const deleteMember = getEventData("delete_member");
		const setAdmin = getEventData("set_admin");
		const startCall = getEventData("start_private_call");

		if (contactToDelete) {
			pushEventToLiveView("action.delete_contact", contactToDelete);
			setComponent("");
			if (isVisibleDetail) {
				setIsVisibleDetail(false);
			}
			setIsSelectedContact(false);
			removeEvent("delete_contact");
		}
		if (selectedPrivateChat) {
			setIsSelectedContact(true);
			pushEventToLiveView("action.selected_private_chat", selectedPrivateChat);
			removeEvent("selected_private_chat");
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
			setIsVisibleDetail(visibility.is_visible);
			if (visibility.is_group) {
				pushEventToLiveView("action.get_members", visibility);
			}
			removeEvent("toggle_detail_visibility");
		}
		if (addGroup) {
			pushEventToLiveView("action.add_group", addGroup);
			removeEvent("add_group");
		}
		if (selectedGroupChat) {
			setIsSelectedContact(true);
			pushEventToLiveView("action.selected_group_chat", selectedGroupChat);
			removeEvent("selected_group_chat");
		}
		if (groupToDelete) {
			pushEventToLiveView("action.delete_group", groupToDelete);
			setComponent("");
			if (isVisibleDetail) {
				setIsVisibleDetail(false);
			}
			setIsSelectedContact(false);
			removeEvent("delete_group");
		}
		if (showMyContactsInGroup) {
			pushEventToLiveView("action.get_my_contacts", showMyContactsInGroup);
			removeEvent("get_my_contacts");
		}
		if (addContactToGroup) {
			pushEventToLiveView("action.add_member", addContactToGroup);
			removeEvent("add_member");
		}
		if (deleteMember) {
			pushEventToLiveView("action.delete_member", deleteMember);
			removeEvent("delete_member");
		}
		if (setAdmin) {
			pushEventToLiveView("action.set_admin", setAdmin);
			removeEvent("set_admin");
		}
		if (startCall) {
			pushEventToLiveView("action.start_private_call", startCall);
			removeEvent("start_private_call");
		}
	}, [addEvent]);

	useEffect(() => {
		if (eventName === "show_user_info" && eventData.nickname) {
			setUserName(eventData.nickname);
			addEvent(eventName, eventData);
		}
	}, [eventData.nickname]);

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
		if (eventName === "show_list_contact" && eventData.all_contact_list) {
			addEvent(eventName, eventData.all_contact_list);
		}
	}, [eventData.all_contact_list]);

	useEffect(() => {
		if (eventName === "open_private_chat") {
			addEvent(eventName, eventData);
			addEvent("show_list_messages", eventData);
			if (isVisibleDetail) {
				if (userName === eventData.from_user_data.nickname) {
					addEvent("show_detail", { chat_name: eventData.to_user_data.nickname, image: eventData.to_user_data.image_profile, is_group: false })
				} else {
					addEvent("show_detail", { chat_name: eventData.from_user_data.nickname, image: eventData.from_user_data.image_profile, is_group: false })
				}
			}
			setComponent("Chat");
		}
	}, [eventData.from_user_data, eventData.to_user_data, eventData.messages]);

	useEffect(() => {
		if (eventName === "show_message_to_send") {
			addEvent(eventName, eventData);
		}
	}, [eventData.message]);

	useEffect(() => {
		if (eventName === "open_chat_request_send" && userName === eventData.request.from_user) {
			addEvent(eventName, eventData.request);
			setComponent("RequestSend");
		}
		if (eventName === "open_chat_request_received" && userName === eventData.request.to_user) {
			addEvent(eventName, eventData.request);
			setComponent("RequestReceived");
		}
	}, [eventData.request]);

	useEffect(() => {
		if (eventName === "open_rejected_request_send" && userName === eventData.rejected_request.to_user) {
			addEvent(eventName, eventData.rejected_request);
			setComponent("RejectedRequestSend");
		}
		if (eventName === "open_rejected_request_received" && userName === eventData.rejected_request.from_user) {
			addEvent(eventName, eventData.rejected_request);
			setComponent("RejectedRequestReceived");
		}
	}, [eventData.rejected_request]);

	useEffect(() => {
		if (eventName === "open_group_chat" && eventData.group_data) {
			addEvent(eventName, eventData);
			addEvent("check_admin", { is_admin: eventData.is_admin })
			addEvent("show_list_messages", eventData);
			if (isVisibleDetail) {
				addEvent("show_detail", { chat_name: eventData.group_data.name, image: eventData.group_data.image, is_group: true })
				addEvent("show_members", { members: eventData.members_data });
			}
			setComponent("Chat");
		}
	}, [eventData.is_admin, eventData.group_data, eventData.messages, eventData.members_data]);

	useEffect(() => {
		if (eventName === "show_my_contacts" && eventData.contact_list) {
			addEvent(eventName, eventData.contact_list);
		}
	}, [eventData.contact_list]);

	useEffect(() => {
		if (eventName === "show_members") {
			addEvent(eventName, { members: eventData.members_data });
		}
	}, [eventData.members_data]);

	useEffect(() => {
		if (eventName === "update_show_my_contacts_and_members") {
			addEvent("show_my_contacts", eventData.contact_list);
			addEvent("show_members", { members: eventData.members_data })
		}
	}, [eventData.contact_list, eventData.members_data]);

	useEffect(() => {
		if (eventName === "connected_users") {
			addEvent("connected_users", eventData.connected_users);
		}
	}, [eventData.connected_users]);

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
