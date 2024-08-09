import React, { useState, useEffect } from "react";
import { useEventContext } from "../EventContext";
import { Typography } from 'antd';

const { Text } = Typography;

export default function RequestSend({ imageNumber }) {
  const { getEventData, removeEvent } = useEventContext();
  const [requestData, setRequestData] = useState("");

  useEffect(() => {
    const request = getEventData("open_chat_request_send");
		if (request) {
      setRequestData(request);
			removeEvent("open_chat_request_send");
		}
  }, [getEventData]);

  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <img
        src={`/images/background2/background-${imageNumber}.svg`}
        alt="background"
        className="object-cover w-full h-full opacity-45"
      />
      <Text className="flex absolute justify-center items-center">
        Has enviado una solicitud de amistad a {requestData.contact_name}. Esperando respuesta.
      </Text>
    </div>
  );
}