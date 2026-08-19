import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  CallStatus,
  ChatMessage,
  PeerJoinedPayload,
  PeerLeftPayload,
  RoomErrorPayload,
  RoomJoinedPayload,
  SignalAnswerPayload,
  SignalIceCandidatePayload,
  SignalOfferPayload
} from "../types";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" }
];

const SIGNALING_URL = import.meta.env.VITE_SIGNALING_URL || "http://localhost:4001";

/**
 * Drives a single 1:1 WebRTC call. The signaling server (a thin
 * Socket.IO relay — see server/src/index.js) only ever sees offer/
 * answer/ICE-candidate messages; actual audio, video, and chat travel
 * directly between the two browsers once the peer connection is up.
 *
 * The trickiest real bug this handles: ICE candidates can arrive over
 * the signaling channel *before* the remote SDP description has been
 * set (the two round-trips race each other over the network). Calling
 * addIceCandidate before setRemoteDescription throws. This hook queues
 * early candidates in `pendingCandidatesRef` and flushes them right
 * after the remote description is applied.
 */
export function useVideoCall(roomId: string) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const cameraTrackRef = useRef<MediaStreamTrack | null>(null);
  const peerIdRef = useRef<string | null>(null);
  const isInitiatorRef = useRef(false);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const setupDataChannel = useCallback((channel: RTCDataChannel) => {
    dataChannelRef.current = channel;
    channel.onmessage = (event) => {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-peer`, from: "peer", text: event.data, timestamp: Date.now() }
      ]);
    };
  }, []);

  const createPeerConnection = useCallback(
    (peerId: string) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit("signal:ice-candidate", {
            to: peerId,
            candidate: event.candidate.toJSON()
          });
        }
      };

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") setStatus("connected");
        if (pc.connectionState === "failed") {
          setError("The connection dropped and couldn't recover. Try rejoining the room.");
          setStatus("error");
        }
      };

      if (localStreamRef.current) {
        for (const track of localStreamRef.current.getTracks()) {
          pc.addTrack(track, localStreamRef.current);
        }
      }

      pc.ondatachannel = (event) => setupDataChannel(event.channel);

      pcRef.current = pc;
      return pc;
    },
    [setupDataChannel]
  );

  const flushPendingCandidates = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;
    for (const candidate of pendingCandidatesRef.current) {
      await pc.addIceCandidate(candidate).catch(() => undefined);
    }
    pendingCandidatesRef.current = [];
  }, []);

  const startCallAsInitiator = useCallback(
    async (peerId: string) => {
      const pc = createPeerConnection(peerId);
      const channel = pc.createDataChannel("chat");
      setupDataChannel(channel);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.emit("signal:offer", { to: peerId, offer });
    },
    [createPeerConnection, setupDataChannel]
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setStatus("joining");
      setError(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        cameraTrackRef.current = stream.getVideoTracks()[0] ?? null;
        setLocalStream(stream);
      } catch {
        setError("Couldn't access your camera/microphone. Check browser permissions.");
        setStatus("error");
        return;
      }

      const socket = io(SIGNALING_URL);
      socketRef.current = socket;

      socket.on("room:joined", async (payload: RoomJoinedPayload) => {
        isInitiatorRef.current = payload.initiator;
        peerIdRef.current = payload.peerId;

        if (payload.initiator && payload.peerId) {
          setStatus("connecting");
          await startCallAsInitiator(payload.peerId);
        } else {
          setStatus("waiting-for-peer");
        }
      });

      socket.on("peer:joined", (payload: PeerJoinedPayload) => {
        // We were first in the room; the second person just joined and
        // will send us an offer shortly. We just need to remember who
        // they are so we can address our answer and ICE candidates.
        peerIdRef.current = payload.peerId;
        setStatus("connecting");
      });

      socket.on("signal:offer", async ({ from, offer }: SignalOfferPayload) => {
        const pc = pcRef.current ?? createPeerConnection(from);
        await pc.setRemoteDescription(offer);
        await flushPendingCandidates();
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("signal:answer", { to: from, answer });
      });

      socket.on("signal:answer", async ({ answer }: SignalAnswerPayload) => {
        const pc = pcRef.current;
        if (!pc) return;
        await pc.setRemoteDescription(answer);
        await flushPendingCandidates();
      });

      socket.on("signal:ice-candidate", async ({ candidate }: SignalIceCandidatePayload) => {
        const pc = pcRef.current;
        if (!pc || !pc.remoteDescription) {
          pendingCandidatesRef.current.push(candidate);
          return;
        }
        await pc.addIceCandidate(candidate).catch(() => undefined);
      });

      socket.on("peer:left", (_payload: PeerLeftPayload) => {
        setStatus("peer-left");
        setRemoteStream(null);
        pcRef.current?.close();
        pcRef.current = null;
        peerIdRef.current = null;
      });

      socket.on("room:error", (payload: RoomErrorPayload) => {
        setError(payload.message);
        setStatus("error");
      });

      socket.emit("room:join", roomId);
    }

    init();

    return () => {
      cancelled = true;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      pcRef.current?.close();
      socketRef.current?.emit("room:leave");
      socketRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const toggleMic = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  }, []);

  const toggleCamera = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  }, []);

  const toggleScreenShare = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;

    if (screenSharing) {
      // Revert to the original camera track.
      const camTrack = cameraTrackRef.current;
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender && camTrack) await sender.replaceTrack(camTrack);
      setScreenSharing(false);
      return;
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = displayStream.getVideoTracks()[0];
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender) await sender.replaceTrack(screenTrack);
      setScreenSharing(true);

      // If the user stops sharing via the browser's own "Stop sharing"
      // control (rather than our button), revert automatically.
      screenTrack.onended = async () => {
        const camTrack = cameraTrackRef.current;
        if (sender && camTrack) await sender.replaceTrack(camTrack);
        setScreenSharing(false);
      };
    } catch {
      // User cancelled the screen-picker dialog — not an error worth surfacing.
    }
  }, [screenSharing]);

  const sendMessage = useCallback((text: string) => {
    const channel = dataChannelRef.current;
    if (!channel || channel.readyState !== "open" || !text.trim()) return;
    channel.send(text);
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-me`, from: "me", text, timestamp: Date.now() }
    ]);
  }, []);

  const hangUp = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();
    socketRef.current?.emit("room:leave");
    socketRef.current?.close();
    setStatus("idle");
    setLocalStream(null);
    setRemoteStream(null);
  }, []);

  return {
    status,
    error,
    localStream,
    remoteStream,
    micOn,
    cameraOn,
    screenSharing,
    messages,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    sendMessage,
    hangUp
  };
}
