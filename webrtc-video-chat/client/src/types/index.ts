export type CallStatus =
  | "idle"
  | "joining"
  | "waiting-for-peer"
  | "connecting"
  | "connected"
  | "peer-left"
  | "error";

export interface ChatMessage {
  id: string;
  from: "me" | "peer";
  text: string;
  timestamp: number;
}

export interface RoomJoinedPayload {
  selfId: string;
  roomId: string;
  initiator: boolean;
  peerId: string | null;
}

export interface PeerJoinedPayload {
  peerId: string;
}

export interface PeerLeftPayload {
  peerId: string;
}

export interface SignalOfferPayload {
  from: string;
  offer: RTCSessionDescriptionInit;
}

export interface SignalAnswerPayload {
  from: string;
  answer: RTCSessionDescriptionInit;
}

export interface SignalIceCandidatePayload {
  from: string;
  candidate: RTCIceCandidateInit;
}

export interface RoomErrorPayload {
  message: string;
}
