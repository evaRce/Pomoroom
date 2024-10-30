import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from "antd";
import { useEventContext } from "../EventContext";
import Video from "./Video";

export default function Call({ chatName, userLogin }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { addEvent, getEventData, removeEvent } = useEventContext();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isCallInitiator, setIsCallInitiator] = useState(false);
  const [users, setUsers] = useState({}); // peerConnections
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  // ###############################################################################################################################
  useEffect(() => {
    const connectUsersData = getEventData("connected_users");
    const offerRequestData = getEventData("offer_requests");
    const iceCandidatesData = getEventData("receive_ice_candidate_offers");
    const sdpOffersData = getEventData("receive_sdp_offers");
    const answersData = getEventData("receive_answers");

    if (connectUsersData) {
      const otherUsers = connectUsersData.filter((user) => user !== userLogin.nickname);
      console.log("[", userLogin.nickname,"]Connected users=", connectUsersData ," y otherUsers=",otherUsers, " excluding userLogin and is remoteUser=", otherUsers[0]);
      setConnectedUsers(connectUsersData);
      connectUsersData.forEach((user) => {
        addUserConnection(user);
      });

      removeEvent("connected_users");
    }

    if (offerRequestData) {
      offerRequestData.forEach((offerFromUser) => {
        console.log("[", userLogin.nickname,"]Initialize peer connection");
        createPeerConnection(offerFromUser, undefined);
      });
      removeEvent("offer_requests");
    }

    if (iceCandidatesData) {
      iceCandidatesData.forEach(({ candidate: candidateData, from_user: fromUser }) => {
        const peerConnection = users[fromUser]?.peerConnection;
        if (peerConnection  && candidateData !== null) {
          console.log("evento iceCandidate= ", candidateData);
          const { candidate: candidate, sdpMLineIndex: sdpMLineIndex, sdpMid: sdpMid, usernameFragment: usernameFragment } = iceCandidatesData;
          console.log("Añade RCTIceCandidate=", peerConnection.addIceCandidate(new RTCIceCandidate(candidateData)));
        }
      });
      removeEvent("receive_ice_candidate_offers");
    }

    if (sdpOffersData) {
      sdpOffersData.forEach(({ description: { sdp: sdpOffer }, from_user: fromUser }) => {
        if (sdpOffer) {
          createPeerConnection(fromUser, sdpOffer);
        }
      });
      removeEvent("receive_sdp_offers");
    }

    if (answersData) {
      answersData.forEach(({ description: descriptionAnswer, from_user: fromUser }) => {
        console.log("Entra en answersData=", descriptionAnswer);
        const peerConnection = users[fromUser]?.peerConnection;
        if (peerConnection && descriptionAnswer) {
          console.log("Entra en el if=", peerConnection.setRemoteDescription(descriptionAnswer));
          // peerConnection.setRemoteDescription(descriptionAnswer);
        }
      });
      removeEvent("receive_answers");
    }
  }, [getEventData, removeEvent, users]);

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

      // if (!isCallInitiator) {
        addEvent("start_private_call", { contact_name: chatName });
      //   setIsCallInitiator(true);
      // }
    } catch (error) {
      console.error("Error al acceder a los dispositivos de media:", error);
    }
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
  function createPeerConnection(fromUser, offer) {
    console.log("[", userLogin.nickname,"](PASO1)CREATE PEER CONNECTION");
    let newPeerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    
    setUsers((prevUsers) => ({
      ...prevUsers,
      [fromUser]: { peerConnection: newPeerConnection },
    }));
    console.log("[", userLogin.nickname,"](PASO2)USERS: ", users);

    if (localStream !== undefined) {
      localStream
        .getTracks()
        .forEach((track) => newPeerConnection.addTrack(track, localStream));
      console.log("[", userLogin.nickname,"](PASO3)localStream: ", localStream);
    }

    if (offer !== undefined) {
      newPeerConnection.setRemoteDescription({ type: "offer", sdp: offer });
      newPeerConnection
        .createAnswer()
        .then((answer) => {
          newPeerConnection.setLocalDescription(answer);
          console.log("[",userLogin.nickname,"](PASO3prima)Sending this ANSWER to the requester:", answer);
          addEvent("new_answer", {
            to_user: fromUser,
            description: answer,
          });
        })
        .catch((err) => console.log(err));
    }

    newPeerConnection.onicecandidate = async ({ candidate }) => {
      if (candidate !== null){
        console.log("[", userLogin.nickname,"](PASO4)Envio ICE candidate=", candidate);
        addEvent("new_ice_candidate", { to_user: fromUser, candidate });
      }
    };

    if (offer === undefined) {
      newPeerConnection.onnegotiationneeded = async () => {
        try {
          newPeerConnection
            .createOffer()
            .then((offer) => {
              newPeerConnection.setLocalDescription(offer);
              console.log("[",userLogin.nickname,"](PASO5)Sending this OFFER to the requester:", offer);
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
      console.log("[",userLogin.nickname,"](PASO6)Track received:", event);
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    return newPeerConnection;
  }

  const toggleMute = () => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsMuted((prev) => !prev);
    }
  };

  // Función para mostrar/ocultar video
  const toggleVideo = () => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsVideoEnabled((prev) => !prev);
    }
  };

  const endCall = (user) => {
    // Eliminar la peerConnection y limpiar los recursos
    if (users[user]?.peerConnection) {
      users[user].peerConnection.close();
    }

    // Detener todas las pistas de audio y video
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null); // Limpiar el stream local
    }

    // Eliminar al usuario de la lista de usuarios conectados
    setUsers((prevUsers) => {
      const updatedUsers = { ...prevUsers };
      delete updatedUsers[user];
      return updatedUsers;
    });

    localVideoRef.current = null;
    setModalVisible(false);
  };

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
        title={`Llamando a ${chatName}`}
        centered
        onCancel={() => setModalVisible(false)}
        wrapClassName="video-modal"
        footer={(
          <div className="flex justify-center space-x-4">
            <Button onClick={toggleMute} title="Audio">
              {isMuted ?
                // muted
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-mic-mute size-6" viewBox="0 0 16 16">
                  <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4 4 0 0 0 12 8V7a.5.5 0 0 1 1 0zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a5 5 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4m3-9v4.879l-1-1V3a2 2 0 0 0-3.997-.118l-.845-.845A3.001 3.001 0 0 1 11 3" />
                  <path d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607m-7.84-9.253 12 12 .708-.708-12-12z" />
                </svg>
                :
                // talk
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-mic size-6" viewBox="0 0 16 16">
                  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
                  <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3" />
                </svg>
              }
            </Button>
            <Button onClick={toggleVideo} title="Video">
              {isVideoEnabled ?
                // hide video
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-camera-video-off size-6" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518zM1.428 4.18A1 1 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634zM15 11.73l-3.5-1.555v-4.35L15 4.269zm-4.407 3.56-10-14 .814-.58 10 14z" />
                </svg>
                :
                // show video
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-camera-video size-6" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />
                </svg>
              }
            </Button>
            <Button onClick={() => endCall(userLogin.nickname)} className="bg-red-500 text-white" title="Cortar llamada">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-telephone-x size-6" viewBox="0 0 16 16">
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                <path fillRule="evenodd" d="M11.146 1.646a.5.5 0 0 1 .708 0L13 2.793l1.146-1.147a.5.5 0 0 1 .708.708L13.707 3.5l1.147 1.146a.5.5 0 0 1-.708.708L13 4.207l-1.146 1.147a.5.5 0 0 1-.708-.708L12.293 3.5l-1.147-1.146a.5.5 0 0 1 0-.708" />
              </svg>
            </Button>
          </div>
        )}
      >
        <div
          className={`grid gap-4 overflow-auto p-4 m-0 ${connectedUsers.length === 1
            ? 'grid-cols-1'
            : 'grid-cols-2'
            }`}
        >
          <div className="relative">
            <video
              ref={localVideoRef}
              playsInline
              autoPlay
              muted
              className="w-full aspect-video object-cover rounded-lg bg-orange-300"
              style={{ transform: 'rotateY(180deg)' }}
            ></video>
          </div>
          {connectedUsers.length > 1 &&
            <div className="relative">
              <video
                ref={remoteVideoRef}
                playsInline
                autoPlay
                className="w-full aspect-video object-cover rounded-lg bg-green-400"
                style={{ transform: 'rotateY(180deg)' }}
              ></video>
            </div>
          }
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