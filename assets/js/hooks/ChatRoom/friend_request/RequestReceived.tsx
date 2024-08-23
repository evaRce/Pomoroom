import React, { useState, useEffect } from "react";
import { useEventContext } from "../EventContext";
import { Button, Space, Typography } from 'antd';

const { Text } = Typography;

export default function RequestReceived({ imageNumber }) {
  const { addEvent, getEventData, removeEvent } = useEventContext();
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    const request = getEventData("open_chat_request_received");
    if (request) {
      setRequestData(request);
      removeEvent("open_chat_request_received");
    }
  }, [getEventData]);

  const handleAccept = () => {
    addEvent("update_status_request", { status: "accepted", contact_name: requestData.to_user, from_user_name: requestData.from_user });
  };

  const handleReject = () => {
    addEvent("update_status_request", { status: "rejected", contact_name: requestData.to_user, from_user_name: requestData.from_user });
    addEvent("rejected_request", { request: requestData });
  };

  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <img
        src={`/images/background2/background-${imageNumber}.svg`}
        alt="background"
        className="object-cover w-full h-full opacity-45"
      />
      <div className="flex flex-col absolute justify-center items-center">
        <Text>{requestData ? `${requestData.from_user} te ha enviado una solicitud de amistad.` : 'Cargando...'}</Text>
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