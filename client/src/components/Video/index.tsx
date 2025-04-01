import React, { useEffect, useRef, useState } from 'react';

const VideoCall = () => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<Record<string, RTCPeerConnection>>({});
  const socketRef = useRef<WebSocket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:4000');

    socketRef.current.onopen = () => {
      const userId = `user-${Math.floor(Math.random() * 1000)}`;
      socketRef.current?.send(JSON.stringify({ type: 'join', userId }));
    };

    socketRef.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      switch (data.type) {
        case 'user-joined':
          setParticipants((prev) => [...prev, data.userId]);
          break;
        case 'offer':
          await handleOffer(data);
          break;
        case 'answer':
          await handleAnswer(data);
          break;
        case 'candidate':
          await handleCandidate(data);
          break;
        case 'user-left':
          setParticipants((prev) => prev.filter((id) => id !== data.userId));
          break;
        default:
          break;
      }
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const startLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  };

  const handleOffer = async (data: any) => {
    console.log({ data });
    const peerConnection = new RTCPeerConnection();
    peerConnections[data.userId] = peerConnection;

    localStream?.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.send(JSON.stringify({ type: 'candidate', targetId: data.userId, candidate: event.candidate }));
      }
    };

    peerConnection.ontrack = (event) => {
      const remoteVideo = document.createElement('video');
      remoteVideo.srcObject = event.streams[0];
      remoteVideo.autoplay = true;
      remoteVideo.style.width = '300px';
      remoteVideo.style.height = '300px';
      console.log({ remoteVideo });
      document.body.appendChild(remoteVideo);
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socketRef.current?.send(JSON.stringify({ type: 'answer', targetId: data.userId, answer }));
  };

  const handleAnswer = async (data: any) => {
    const peerConnection = peerConnections[data.userId];
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  };

  const handleCandidate = async (data: any) => {
    const peerConnection = peerConnections[data.targetId];
    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  };

  useEffect(() => {
    startLocalStream();
  }, []);

  return (
    <div>
      <h1>Video Call</h1>
      <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }} />
      <h2>Participants</h2>
      <ul>
        {participants.map((participant) => (
          <li key={participant}>{participant}</li>
        ))}
      </ul>
    </div>
  );
};

export default VideoCall;
