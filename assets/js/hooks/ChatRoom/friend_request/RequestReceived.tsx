import React from "react";
import { useEventContext } from "../EventContext";
import { Button, Space, Typography } from 'antd';

const { Text } = Typography;

export default function RequestReceived({ imageNumber, onAccept, onReject, userName }) {
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <img
        src={`/images/background2/background-${imageNumber}.svg`}
        alt="background"
        className="object-cover w-full h-full opacity-45"
      />
      <div className="flex flex-col absolute justify-center items-center">
        <Text>{userName} te ha enviado una solicitud de amistad.</Text>
        <Space style={{ marginTop: 16 }}>
          <Button onClick={onAccept}>
            Aceptar
          </Button>
          <Button danger onClick={onReject}>
            Rechazar
          </Button>
        </Space>
      </div>
    </div>
  );
};