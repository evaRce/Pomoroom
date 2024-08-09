import React, { useState, useEffect } from "react";
import { useEventContext } from "../EventContext";
import { Button, Space, Typography } from 'antd';
import { useEventContext } from "../EventContext";

const { Text } = Typography;

export default function RequestReceived({ imageNumber }) {
  const { addEvent, getEventData, removeEvent } = useEventContext();
  const [requestData, setRequestData] = useState("");

  useEffect(() => {
    const request = getEventData("open_chat_request_received");
    if (request) {
      setRequestData(request);
      removeEvent("open_chat_request_received");
    }
  }, [getEventData]);

  const handleAccept = () => {
    addEvent("send_status_request", { status: "accepted", contact_name: requestData.contact_name, owner_name: requestData.owner_name })
  };

  const handleReject = () => {
    addEvent("send_status_request", { status: "rejected", contact_name: requestData.contact_name, owner_name: requestData.owner_name })
  };

  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <img
        src={`/images/background2/background-${imageNumber}.svg`}
        alt="background"
        className="object-cover w-full h-full opacity-45"
      />
      <div className="flex flex-col absolute justify-center items-center">
        <Text>{requestData.owner_name} te ha enviado una solicitud de amistad.</Text>
        <Space style={{ marginTop: 16 }}>
          <Button onClick={handleAccept}>
            Aceptar
          </Button>
          <Button danger onClick={handleReject}>
            Rechazar
          </Button>
        </Space>
      </div>
    </div>
  );
};