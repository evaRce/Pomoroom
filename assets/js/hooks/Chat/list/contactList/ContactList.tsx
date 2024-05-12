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
			name: "Group1" },
		{	id: 2,
			group: false,
			text: "Message2!",
			name: "user2" },
		{	id: 3,
			group: false,
			text: "Message3!",
			name: "user3"	},
		{	id: 4,
			group: false,
			text: "Message4!",
			name: "user4" },
		{	id: 5,
			group: false,
			text: "Message5",
			name: "user5" },
		{	id: 6,
			group: false,
			text: "Message6!",
			name: "user6"	},
		{	id: 7,
			group: false,
			text: "Message7!",
			name: "user7"
		},
		{	id: 8,
			group: false,
			text: "Message4!",
			name: "user8" },
		{	id: 9,
			group: false,
			text: "Message5wqfqfgggggeeddddddddeeeeeeeeeeeeeee", 
			name: "user9" },
		{	id: 10,
			group: true,
			text: "Message6!",
			name: "Group10" },
		{	id: 11,
			group: false,
			text: "Message7!",
			name: "user11" },
		{	id: 12,
			group: false,
			text: "Message4!",
			name: "user12" },
		{	id: 13,
			group: false,
			text: "Message4!",
			name: "user13" },
			{	id: 8,
				group: false,
				text: "Message4!",
				name: "user8" },
			{	id: 9,
				group: false,
				text: "Message5wqfqfgggggeeddddddddeeeeeeeeeeeeeee", 
				name: "user9" },
			{	id: 10,
				group: true,
				text: "Message6!",
				name: "Group10" },
			{	id: 11,
				group: false,
				text: "Message7!",
				name: "user11" },
			{	id: 12,
				group: false,
				text: "Message4!",
				name: "user12" },
			{	id: 13,
				group: false,
				text: "Message4!",
				name: "user13" }
	]

	return (
		<div className="flex flex-col h-screen max-h-screen">
			<div className="flex pb-5">
				<div className="flex">
					<input
						className="input h-auto focus:outline-none bg-gray-100 rounded-r-none"
						type="text"
						placeholder="Search"
					/>
					<button
						className="h-auto bg-gray-100 rounded-l-none rounded-r-lg px-3 text-sm"
						type="submit"
					>
						<SearchOutlined />
					</button>
					<Button
						className="rounded-md px-3 text-sm"
						onClick={() => setAddMode((prev) => !prev)}
						icon={addMode ? <PlusOutlined /> : <MinusOutlined />}
					/>
				</div>
			</div>
			<div className="overflow-auto p-1" >
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
