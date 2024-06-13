import React, { useState } from "react";
import { Button } from "antd";
import { SearchOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Contact from "./Contact";

export default function ChatList({ }) {
	const [addMode, setAddMode] = useState(false);

	const contacts = [
		{	id: 1,
			group: true,
			text: "Message1!",
			name: "Group1",
			image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" },
		{	id: 2,
			group: false,
			text: "Message2!",
			name: "user2",
			image: "https://i.pravatar.cc/150?u=1" },
		{	id: 3,
			group: false,
			text: "Message3!",
			name: "user3",
			image: "https://i.pravatar.cc/150?u=2" },
		{	id: 4,
			group: false,
			text: "Message4!",
			name: "user4",
			image: "https://i.pravatar.cc/150?u=3" },
		{	id: 5,
			group: false,
			text: "Message5",
			name: "user5",
			image: "https://i.pravatar.cc/150?u=4" },
		{	id: 6,
			group: false,
			text: "Message6!",
			name: "user6",
			image: "https://i.pravatar.cc/150?u=5"	},
		{	id: 7,
			group: false,
			text: "Message7!",
			name: "user7",
			image: "https://i.pravatar.cc/150?u=6" },
		{	id: 8,
			group: false,
			text: "Message4!",
			name: "user8",
			image: "https://i.pravatar.cc/150?u=7" },
		{	id: 9,
			group: false,
			text: "Message5wqfqfgggggeeddddddddeeeeeeeeeeeeeee", 
			name: "user9",
			image: "https://i.pravatar.cc/150?u=8" },
		{	id: 10,
			group: true,
			text: "Message6!",
			name: "Group10",
			image: "https://i.pravatar.cc/150?u=9" },
		{	id: 11,
			group: false,
			text: "Message7!",
			name: "user11",
			image: "https://i.pravatar.cc/150?u=10" },
		{	id: 12,
			group: false,
			text: "Message4!",
			name: "user12",
			image: "https://i.pravatar.cc/150?u=11" },
		{	id: 13,
			group: false,
			text: "Message4!",
			name: "user13",
			image: "https://i.pravatar.cc/150?u=12" },
		{	id: 8,
			group: false,
			text: "Message4!",
			name: "user13" ,
			image: "https://i.pravatar.cc/150?u=13" },
		{	id: 9,
			group: false,
			text: "Message5wqfqfgggggeeddddddddeeeeeeeeeeeeeee", 
			name: "user14",
			image: "https://i.pravatar.cc/150?u=14" },
		{	id: 10,
			group: true,
			text: "Message6!",
			name: "Group15",
			image: "https://i.pravatar.cc/150?u=15" },
		{	id: 11,
			group: false,
			text: "Message7!",
			name: "user16",
			image: "https://i.pravatar.cc/150?u=16" },
		{	id: 12,
			group: false,
			text: "Message4!",
			name: "user17",
			image: "https://i.pravatar.cc/150?u=17" },
		{	id: 13,
			group: false,
			text: "Message4!",
			name: "user18",
			image: "https://i.pravatar.cc/150?u=18" }
	]

	return (
		<div className="flex flex-col h-[90vh] w-[20vw]">
			<div className="flex py-2 px-1 w-[20vw] justify-center">
				<input
					className="input h-auto w-[17vw] focus:outline-none bg-gray-100 rounded-r-none"
					type="text"
					placeholder="Search"
				/>
				<Button
					className=" bg-gray-100 h-auto w-[3vw] rounded-l-none rounded-r-lg px-3 text-sm"
					icon={<SearchOutlined />}
				/>
			</div>
			<div className="overflow-auto w-[20vw] p-1" style={{ scrollbarWidth: 'thin'}}>
				{contacts.map(contact => (
					<>
						<Contact key={contact.id} contact={contact} />
						<div className='border-t-2 mb-1'></div>
					</>
				))}
			</div>
		</div>
	);
}