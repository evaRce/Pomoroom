import React from "react";
import { Avatar } from "antd";

export default function Detail({ }) {
	const imSender = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";
	return (
		<div className="hidden bg-gray-100 lg:pr-8 lg:flex-shrink-0 xl:pr-0 xl:block">
			<div className="h-full pl-6 py-6 lg:w-80">
				<div className="h-full relative">
					<div className="m-auto text-center mb-10">
						<Avatar src={imSender} size={150}/>
						<h2 className="m-auto text-2xl mt-2">
							user2
						</h2>
					</div>
					<div className="mb-2">
						<h4>Attachments</h4>
					</div>
					<div className="grid grid-cols-3 gap-2">
						<div>
							<div className="cursor-pinter bg-gray-300 hover:bg-gray-400 h-14 w-full"></div>
						</div>
						<div>
							<div className="cursor-pinter bg-gray-300 hover:bg-gray-400 h-14 w-full"></div>
						</div>
						<div>
							<div className="cursor-pinter bg-gray-300 hover:bg-gray-400 h-14 w-full"></div>
						</div>
						<div>
							<div className="cursor-pinter bg-gray-300 hover:bg-gray-400 h-14 w-full"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}