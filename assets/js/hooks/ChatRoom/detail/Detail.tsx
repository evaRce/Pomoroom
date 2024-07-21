import React from "react";
import { Avatar } from "antd";

export default function Detail() {
	return (
		<div className="hidden lg:pr-8 lg:flex-shrink-0 xl:pr-0 xl:block">
			<div className=" min-w-[20vw]">
				<div className="text-center w-[17vw] mb-10">
					<Avatar src="/images/default_user/default_user-02.svg" size={150}/>
					<h2 className="text-2xl mt-2">
						user2
					</h2>
				</div>
				<div className="mb-2">
					<h4>Attachments</h4>
				</div>
				<div className="grid grid-cols-3 w-[17vw] gap-2 px-1">
					<div>
						<div className="cursor-pinter bg-gray-300 hover:bg-gray-400 h-[8vh] w-[5vw]"></div>
					</div>
					<div>
						<div className="cursor-pinter bg-gray-300 hover:bg-gray-400 h-[8vh] w-[5vw]"></div>
					</div>
					<div>
						<div className="cursor-pinter bg-gray-300 hover:bg-gray-400 h-[8vh] w-[5vw]"></div>
					</div>
					<div>
						<div className="cursor-pinter bg-gray-300 hover:bg-gray-400 h-[8vh] w-[5vw]"></div>
					</div>
				</div>
			</div>
		</div>
	);
}