import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from "antd";
import { useEventContext } from "../EventContext";

export default function Call({ chatName }) {
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { addEvent, getEventData, removeEvent } = useEventContext();
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    const connect_users_list = getEventData("connected_users");
    if (connect_users_list) {
      setConnectedUsers(connect_users_list);
      removeEvent("connected_users");
    }
  }, [getEventData]);

  const handleGetMedia = async () => {
    const constraints = {
      video: true,
      audio: true,
    };
    let callStarted = false;
    try {
      // Cambia el estado antes de solicitar el video
      setModalVisible(true);
      console.log("CHAT_NAME:", chatName);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      if (!callStarted) {
        addEvent("start_private_call", { contact_name: "lois1" });
        callStarted = true; // Marcar que la llamada ha comenzado
      }
    } catch (error) {
      console.error("Error al acceder a los dispositivos de media:", error);
    }
  };

  return (
    <div>
      <Button
        className="bg-white"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
            />
          </svg>
        }
        title="LLamar"
        onClick={handleGetMedia}
      />
      <Modal
        open={modalVisible}
        footer={null}
        title={`Llamando a ${chatName}`}
        centered
        onCancel={() => setModalVisible(false)}
        wrapClassName="video-modal"
      >
        <div className="flex flex-wrap justify-center items-center max-h-screen overflow-auto">
          <video
            ref={localVideoRef}
            playsInline
            autoPlay
            muted
            className="w-full md:w-1/2 lg:w-1/3 max-h-screen object-contain p-2"
            style={{ transform: "rotateY(180deg)" }}
          ></video>
          <div className="w-full mt-4 text-center">
            <h3 className="text-xl font-semibold">Usuarios Conectados:</h3>
            <ul className="list-disc list-inside">
              {connectedUsers.length > 0 ? (
                connectedUsers.map((user, index) => <li key={index}>{user}</li>)
              ) : (
                <li>No hay usuarios conectados</li>
              )}
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
