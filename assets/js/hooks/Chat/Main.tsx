import React from 'react';
import { Card, Flex, Typography, Button } from 'antd';
import List from "./list/List";
import Chat from "./chat/Chat";
import Detail from "./detail/Detail";

export interface MainProps {
	
}

export const Main: React.FC<MainProps> = (props: MainProps) => {

	return(
		<>
			{/* <Card > */}
				<Flex justify="space-between">
					<Flex vertical>
						<List/>
					</Flex>
					<Flex vertical>
						<Chat/>
					</Flex>
					<Flex vertical>
						<Detail/>
					</Flex>
				</Flex>
				
			{/* </Card> */}
		</>
	);
}

