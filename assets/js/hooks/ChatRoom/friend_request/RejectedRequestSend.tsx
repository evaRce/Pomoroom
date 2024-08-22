import React, { useState, useEffect } from "react";
import { useEventContext } from "../EventContext";
import { Button, Typography } from 'antd';

const { Text } = Typography;

export default function RejectedRequestSend({ imageNumber }) {
  const { addEvent, getEventData, removeEvent } = useEventContext();
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    const rejectedRequest = getEventData("open_rejected_request_send");
    if (rejectedRequest) {
      setRequestData(rejectedRequest);
      removeEvent("open_rejected_request_send");
    }
  }, [getEventData]);

  const handleRejectedRequest = () => {
    console.log("te deja clicar en open_rejected_request_send");
    addEvent("delete_contact_from_list", requestData.from_user_data.nickname);
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
          Has rechazado la solicitud de amistad de {requestData ? requestData.from_user_data.nickname : '...'}.
        </Text>
        <br></br>
        <Button onClick={handleRejectedRequest}>
          Entendido
        </Button>
      </div>
    </div>
  );
};