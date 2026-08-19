import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 4001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5177";
const MAX_PEERS_PER_ROOM = 2;

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CLIENT_ORIGIN }
});

/**
 * This server never touches audio, video, or chat content — it only
 * exchanges the handshake messages two browsers need to find each other
 * and negotiate a direct peer-to-peer connection (the offer/answer SDP
 * exchange and ICE candidates). Once that connection is up, media and
 * the text-chat data channel both flow directly between the two
 * browsers; this server is out of the loop entirely from that point on.
 */
const roomPeers = new Map(); // roomId -> Set<socketId>
const roomBySocket = new Map(); // socketId -> roomId

function leaveCurrentRoom(socket) {
  const roomId = roomBySocket.get(socket.id);
  if (!roomId) return;

  const peers = roomPeers.get(roomId);
  peers?.delete(socket.id);
  roomBySocket.delete(socket.id);
  socket.leave(roomId);

  if (peers && peers.size > 0) {
    io.to(roomId).emit("peer:left", { peerId: socket.id });
  }
  if (peers && peers.size === 0) {
    roomPeers.delete(roomId);
  }
}

io.on("connection", (socket) => {
  socket.on("room:join", (roomId) => {
    if (typeof roomId !== "string" || !roomId.trim()) {
      socket.emit("room:error", { message: "A valid room code is required." });
      return;
    }

    const normalizedRoomId = roomId.trim().toUpperCase();
    const existingPeers = roomPeers.get(normalizedRoomId) ?? new Set();

    if (existingPeers.size >= MAX_PEERS_PER_ROOM) {
      socket.emit("room:error", { message: `Room "${normalizedRoomId}" already has two people in it.` });
      return;
    }

    const otherPeerId = existingPeers.size === 1 ? [...existingPeers][0] : null;

    existingPeers.add(socket.id);
    roomPeers.set(normalizedRoomId, existingPeers);
    roomBySocket.set(socket.id, normalizedRoomId);
    socket.join(normalizedRoomId);

    // Whoever joins second is the "initiator" — they create the SDP
    // offer once they know the other peer's socket id. The first
    // person in the room just waits.
    socket.emit("room:joined", {
      selfId: socket.id,
      roomId: normalizedRoomId,
      initiator: otherPeerId !== null,
      peerId: otherPeerId
    });

    if (otherPeerId) {
      io.to(otherPeerId).emit("peer:joined", { peerId: socket.id });
    }
  });

  socket.on("signal:offer", ({ to, offer }) => {
    if (to) io.to(to).emit("signal:offer", { from: socket.id, offer });
  });

  socket.on("signal:answer", ({ to, answer }) => {
    if (to) io.to(to).emit("signal:answer", { from: socket.id, answer });
  });

  socket.on("signal:ice-candidate", ({ to, candidate }) => {
    if (to) io.to(to).emit("signal:ice-candidate", { from: socket.id, candidate });
  });

  socket.on("room:leave", () => leaveCurrentRoom(socket));
  socket.on("disconnect", () => leaveCurrentRoom(socket));
});

httpServer.listen(PORT, () => {
  console.log(`[signaling] Listening on port ${PORT}`);
  console.log(`[signaling] Accepting connections from ${CLIENT_ORIGIN}`);
});
