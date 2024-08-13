import React, { useState, useEffect } from "react";
import { useEventContext } from "../EventContext";
import { Button, Space, Typography } from 'antd';

const { Text } = Typography;

export default function RequestReceived({ imageNumber }) {
  const { addEvent, getEventData, removeEvent } = useEventContext();
  const [requestData, setRequestData] = useState(null);
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
    const request = getEventData("open_chat_request_received");
    if (request) {
      setRequestData(request);
      removeEvent("open_chat_request_received");
    }
    const rejectedRequest = getEventData("open_rejected_request_send");
    if (rejectedRequest) {
      setIsRejected(true);
      setRequestData(rejectedRequest);
      removeEvent("open_rejected_request_send");
    }
  }, [getEventData]);

  const handleAccept = () => {
    addEvent("send_status_request", { status: "accepted", contact_name: requestData.contact_name, owner_name: requestData.owner_name });
  };

  const handleReject = () => {
    addEvent("send_status_request", { status: "rejected", contact_name: requestData.contact_name, owner_name: requestData.owner_name });
  };

  const handleRejectedRequest = () => {
    addEvent("delete_contact", requestData.owner_name);
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
            Has rechazado la solicitud de amistad de {requestData.owner_name}.
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
      <div className="flex flex-col absolute justify-center items-center">
        <Text>{requestData ? `${requestData.owner_name} te ha enviado una solicitud de amistad.` : 'Cargando...'}</Text>
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