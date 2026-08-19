# WebRTC Video Chat

A peer-to-peer video call app: two people, one room code, direct browser-to-browser audio, video,
and chat. A lightweight Socket.IO server only handles the initial handshake — once the connection
is up, no media or messages pass through any server at all.

## Why this exists

WebRTC and real-time communication show up on my resume from a production platform's live,
collaborative video/audio lessons — but that's server-side infrastructure a resume line can't show.
This project isolates the actual WebRTC connection-negotiation logic (the part with real, easy-to-get-wrong
edge cases) into something small enough to read start to finish.

## What it does

- **Room-based 1:1 calls** — create a room and share the 6-character code, or join one you were
  given. Each room holds exactly two people; the server rejects a third.
- **Live video and audio**, direct peer-to-peer once connected
- **Screen sharing** — swaps the outgoing video track from camera to screen mid-call via
  `RTCRtpSender.replaceTrack`, and reverts automatically if the user stops sharing from the
  browser's own "Stop sharing" control rather than the app's button
- **Text chat over a WebRTC data channel** — not relayed through the server; it's a genuine
  peer-to-peer channel opened on the same connection as the media
- **Mute/camera toggles**, a real connection-status banner, and graceful handling when the other
  person leaves

## How the connection actually gets established

This is the part worth understanding, not just running:

1. Both browsers connect to the **signaling server** (`server/src/index.js`) over Socket.IO and
   join the same room by code.
2. The **second** person to join is designated the "initiator" — they create an SDP **offer** and
   send it through the signaling server to the first person.
3. The first person sets that as their remote description, creates an SDP **answer**, and sends it
   back the same way.
4. Both sides exchange **ICE candidates** (possible network paths) through the signaling server as
   they're discovered.
5. Once enough ICE candidates are exchanged, the browsers open a **direct connection** to each
   other. From this point on, the signaling server is completely out of the loop — video, audio,
   and chat all flow peer-to-peer.

### The race condition this handles

ICE candidates can arrive over the signaling channel *before* the remote SDP description has been
applied — the two round-trips race each other over the network, and which one wins is not
guaranteed. Calling `addIceCandidate()` before `setRemoteDescription()` throws. `useVideoCall.ts`
queues early candidates in a ref and flushes them immediately after the remote description is set,
rather than assuming they'll always arrive in the "expected" order.

## Project structure

```
server/
  src/index.js          Socket.IO signaling only — no media, no database, in-memory room tracking
client/
  src/
    hooks/useVideoCall.ts   All WebRTC logic: peer connection, offer/answer, ICE queueing,
                            data channel, screen-share track swapping
    components/
      RoomJoinScreen.tsx
      VideoTile.tsx
      CallControls.tsx
      ChatPanel.tsx           Renders messages sent over the data channel
      CallStatusBanner.tsx
    App.tsx
```

## Running it

Needs two browser tabs/windows (or two different devices) to actually see the call connect — one
person alone will just see their own video waiting for a peer.

### 1. Signaling server

```bash
cd server
npm install
npm run dev   # http://localhost:4001
```

### 2. Client

```bash
cd client
npm install
npm run dev   # http://localhost:5177
```

Open `http://localhost:5177` in two tabs (or share the URL with someone else on your network).
Click "Create a new room" in one tab, copy the code, and "Join" with that code in the other.
Grant camera/microphone permission in both. The call should connect within a few seconds.

## A note on NAT traversal

This uses public Google STUN servers, which is enough for most home networks and same-network
demos. Some restrictive corporate/mobile networks require a **TURN** server (which relays media
when a direct connection isn't possible) — that's not included here since running one requires
either a paid service or self-hosting `coturn`. If a call gets stuck on "Connecting…" between two
networks that can't reach each other directly, that's the TURN server this demo doesn't have.

## Tech stack

- **Signaling server:** Node.js, Express (health check only), Socket.IO 4
- **Client:** React 18 + TypeScript, native `RTCPeerConnection`/`getUserMedia`/`getDisplayMedia`
  APIs (no WebRTC wrapper library — this is meant to show direct familiarity with the raw APIs),
  socket.io-client, Tailwind CSS, Vite

## What I'd add next

- [ ] TURN server fallback for restrictive networks
- [ ] Group calls (mesh network for 3-4 peers, or an SFU for more)
- [ ] Call recording
- [ ] Reconnection handling if a peer's network drops mid-call

## Author

**Dhanyashree H P** — Senior Software Engineer (React.js, React Native, Mobile)
[linkedin.com/in/dhanya-chinivar-773b37115](https://linkedin.com/in/dhanya-chinivar-773b37115)
