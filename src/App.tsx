import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Peer from "peerjs";

function App() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      const constraints = {
        // audio: true,
        video: true,
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((mediaStream) => {
          currentVideoRef.current!.srcObject = mediaStream;
          currentVideoRef.current?.play();
          call.answer(mediaStream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current!.srcObject = remoteStream;
            remoteVideoRef.current?.play();
          });
        })
        .catch((err) => {});
    });
    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId: string) => {
    const constraints = {
      // audio: true,
      video: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream) => {
        currentVideoRef.current!.srcObject = mediaStream;
        currentVideoRef.current?.play();
        const call = peerInstance.current?.call(remotePeerId, mediaStream);
        call?.on("stream", (remoteStream) => {
          remoteVideoRef.current!.srcObject = remoteStream;
          remoteVideoRef.current?.play();
        });
      })
      .catch((err) => {});
  };
  console.log(peerId);
  return (
    <div className="container">
      <h1>Current user ID is {peerId}</h1>
      <div className="input-container">
        <input
          type="text"
          value={remotePeerIdValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setRemotePeerIdValue(e.target.value)
          }
        />
        <button onClick={() => call(remotePeerIdValue)}>Call</button>
      </div>
      <div className="video-container">
        <div className="video-box">
          <video ref={currentVideoRef} />
          <h3>유저</h3>
        </div>
        <div className="video-box">
          <video ref={remoteVideoRef} />
          <h3>상대</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
