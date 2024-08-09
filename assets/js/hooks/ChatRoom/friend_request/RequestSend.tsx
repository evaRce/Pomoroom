import React from "react";
import { useEventContext } from "../EventContext";
import { Typography } from 'antd';

const { Text } = Typography;

export default function RequestSend({ imageNumber, userName }) {
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <img
        src={`/images/background2/background-${imageNumber}.svg`}
        alt="background"
        className="object-cover w-full h-full opacity-45"
      />
      <Text className="flex absolute justify-center items-center">
        Has enviado una solicitud de amistad a {userName}. Esperando respuesta.
      </Text>
    </div>
  );
}