import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from "antd";
import { useEventContext } from "../EventContext";

export default function Call({ chatName }) {
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const [modalVisible, setModalVisible] = useState(false);
  const { addEvent, getEventData, removeEvent } = useEventContext();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isCallInitiator, setIsCallInitiator] = useState(false);
  const [users, setUsers] = useState({});
  const [localStream, setLocalStream] = useState(undefined);
  // const [iceCandidate, setIceCandidate] = useState({});
  // const [sdpOffer, setSdpOffer] = useState({});
  // const [answer, setAnswer] = useState({});

  // ###############################################################################################################################
  useEffect(() => {
    const connectUsersData = getEventData("connected_users");
    const offerRequestData = getEventData("offer_requests");
    const iceCandidatesData = getEventData("receive_ice_candidate_offers");
    const sdpOffersData = getEventData("receive_sdp_offers");
    const answersData = getEventData("receive_answers");

    if (connectUsersData) {
      setConnectedUsers(connectUsersData);
      removeEvent("connected_users");
    }

    if (offerRequestData) {
      offerRequestData.forEach((offerFromUser) => {
        createPeerConnection(offerFromUser, undefined);
      });
      removeEvent("offer_requests");
    }

    if (iceCandidatesData) {
      iceCandidatesData.forEach((itemIceCandidate) => {
        const { candidate: candidateData, from_user: fromUser } =
          itemIceCandidate;
        if (candidateData) {
          const peerConnection = users[fromUser]?.peerConnection;
          peerConnection.addIceCandidate(candidateData);
        }
      });
      removeEvent("receive_ice_candidate_offers");
    }

    if (sdpOffersData) {
      sdpOffersData.forEach((itemSdpOffer) => {
        const {
          description: { sdp: sdpOffer },
          from_user: fromUser,
        } = itemSdpOffer;
        if (sdpOffer !== "") {
          createPeerConnection(fromUser, sdpOffer);
        }
      });
      removeEvent("receive_sdp_offers");
    }

    if (answersData) {
      answersData.forEach((itemAnswer) => {
        const { description: descriptionAnswer, from_user: fromUser } =
          itemAnswer;
        const { type: type, sdp: sdpAnswer } = descriptionAnswer;
        const peerConnection = users[fromUser]?.peerConnection;
        if (sdpAnswer !== "") {
          peerConnection.setRemoteDescription(descriptionAnswer);
        }
      });
      removeEvent("receive_answers");
    }
  }, [getEventData, removeEvent]);

  // ###############################################################################################################################
  const handleGetMedia = async () => {
    const constraints = { video: true, audio: true };

    try {
      setModalVisible(true);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      if (!isCallInitiator) {
        addEvent("start_private_call", { contact_name: chatName });
        setIsCallInitiator(true);
      }
    } catch (error) {
      console.error("Error al acceder a los dispositivos de media:", error);
    }
  };

  // ###############################################################################################################################
  const setVideoRefs = (el, user) => {
    remoteVideoRefs.current[user] = el;
    addUserConnection(user);
  };

  // ###############################################################################################################################
  const addUserConnection = (userNickname) => {
    if (users[userNickname] === undefined) {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [userNickname]: { peerConnection: null },
      }));
    }
  };

  // ###############################################################################################################################
  const removeUserConnection = (userNickname) => {
    setUsers((prevUsers) => {
      const { [userNickname]: _, ...remainingUsers } = prevUsers;
      return remainingUsers;
    });
  };

  // ###############################################################################################################################
  function createPeerConnection(fromUser, offer) {
    let newPeerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:littlechat.app:3478" }],
    });
    setUsers((prevUsers) => ({
      ...prevUsers,
      [fromUser]: {
        ...prevUsers[fromUser], // Mantiene las propiedades existentes del usuario
        peerConnection: newPeerConnection, // Actualiza solo peerConnection
      },
    }));

    if (localStream !== undefined) {
      localStream
        .getTracks()
        .forEach((track) => newPeerConnection.addTrack(track, localStream));
    }

    if (offer !== undefined) {
      newPeerConnection.setRemoteDescription({ type: "offer", sdp: offer });
      newPeerConnection
        .createAnswer()
        .then((answer) => {
          newPeerConnection.setLocalDescription(answer);
          addEvent("new_answer", {
            to_user: fromUser,
            description: answer,
          });
        })
        .catch((err) => console.log(err));
    }

    newPeerConnection.onicecandidate = async ({ candidate }) => {
      addEvent("new_ice_candidate", { to_user: fromUser, candidate });
    };

    if (offer === undefined) {
      newPeerConnection.onnegotiationneeded = async () => {
        try {
          newPeerConnection
            .createOffer()
            .then((offer) => {
              newPeerConnection.setLocalDescription(offer);
              addEvent("new_sdp_offer", {
                to_user: fromUser,
                description: offer,
              });
            })
            .catch((err) => console.log(err));
        } catch (error) {
          console.log(error);
        }
      };
    }

    newPeerConnection.ontrack = async (event) => {
      remoteVideoRefs.current[fromUser].srcObject = event.streams[0];
    };

    return newPeerConnection;
  }

  // ###############################################################################################################################
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

          {connectedUsers.map((user) => (
            <video
              key={user}
              ref={(el) => setVideoRefs(el, user)}
              playsInline
              autoPlay
              className="w-full md:w-1/2 lg:w-1/3 max-h-screen object-contain p-2"
              style={{ transform: "rotateY(180deg)" }}
            ></video>
          ))}
        </div>
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
      </Modal>
    </div>
  );
}
