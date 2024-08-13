import React, { useState, useEffect } from "react";
import { useEventContext } from "../EventContext";
import { Typography, Button } from 'antd';

const { Text } = Typography;

export default function RequestSend({ imageNumber }) {
  const { addEvent, getEventData, removeEvent } = useEventContext();
  const [requestData, setRequestData] = useState(null);
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
    const request = getEventData("open_chat_request_send");
    if (request) {
      setIsRejected(false);
      setRequestData(request);
      removeEvent("open_chat_request_send");
    }
    const rejectedRequest = getEventData("open_rejected_request_received");
    if (rejectedRequest) {
      setIsRejected(true);
      setRequestData(rejectedRequest);
      removeEvent("open_rejected_request_received");
    }
  }, [getEventData]);

  const handleRejectedRequest = () => {
    addEvent("delete_contact", requestData.contact_name);
  };

  if (isRejected) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <img
          src={`/images/background2/background-${imageNumber}.svg`}
          alt="background"
          className="object-cover w-full h-full opacity-45"
        />
        <div className="flex flex-col absolute justify-center items-center">
          <Text style={{ color: 'red' }}>
            Tu solicitud de amistad ha sido rechazada por {requestData ? requestData.contact_name : '...'}.
          </Text>
          <br></br>
          <Button onClick={handleRejectedRequest}>
            Entendido
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <img
        src={`/images/background2/background-${imageNumber}.svg`}
        alt="background"
        className="object-cover w-full h-full opacity-45"
      />
      <Text className="flex absolute justify-center items-center">
        Has enviado una solicitud de amistad a {requestData ? requestData.contact_name : '...'}.
        <br></br>
        Esperando respuesta.
      </Text>
    </div>
  );
}