import React, { useState, useEffect } from "react";
import { useEventContext } from "../EventContext";
import { Button, Typography } from 'antd';

const { Text } = Typography;

export default function RejectedRequestReceived({ imageNumber }) {
  const { addEvent, getEventData, removeEvent } = useEventContext();
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    const rejectedRequest = getEventData("open_rejected_request_received");
    if (rejectedRequest) {
      setRequestData(rejectedRequest);
      removeEvent("open_rejected_request_received");
    }
  }, [getEventData]);

  const handleRejectedRequest = () => {
    addEvent("delete_rejected_contact", requestData.to_user);
  };

  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <img
        src={`/images/background2/background-${imageNumber}.svg`}
        alt="background"
        className="object-cover w-full h-full opacity-45"
      />
      <div className="flex flex-col absolute justify-center items-center">
        <Text style={{ color: 'red' }}>
          Tu solicitud de amistad ha sido rechazada por {requestData ? requestData.to_user : '....'}
        </Text>
        <br></br>
        <Button onClick={handleRejectedRequest}>
          Entendido
        </Button>
      </div>
    </div>
  );
};