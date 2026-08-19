import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { createDeviceSimulator, REGIONS } from "./simulator/deviceSimulator.js";

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5176";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CLIENT_ORIGIN }
});

// Tracks which "viewing room" each connected socket is currently in, so
// presence counts can be recomputed and broadcast whenever anyone joins,
// leaves, or switches which region they're looking at. Keyed by socket.id
// rather than relying on io.sockets.adapter.rooms directly — explicit
// bookkeeping here is easier to reason about than querying the adapter.
const viewerRegionBySocket = new Map();

function computePresence() {
  const counts = Object.fromEntries(REGIONS.map((r) => [r, 0]));
  counts.ALL = 0;
  for (const region of viewerRegionBySocket.values()) {
    counts[region] = (counts[region] ?? 0) + 1;
  }
  counts.total = viewerRegionBySocket.size;
  return counts;
}

function broadcastPresence() {
  io.emit("presence:update", computePresence());
}

const simulator = createDeviceSimulator({
  onDeviceUpdate: (device) => io.emit("device:update", device),
  onEvent: (event) => io.emit("event:new", event)
});

io.on("connection", (socket) => {
  // Every client starts "viewing" the aggregate (ALL regions) until they
  // pick a specific region filter on the client.
  viewerRegionBySocket.set(socket.id, "ALL");
  socket.emit("devices:init", simulator.getSnapshot());
  broadcastPresence();

  socket.on("viewing:region", (region) => {
    const nextRegion = REGIONS.includes(region) ? region : "ALL";
    viewerRegionBySocket.set(socket.id, nextRegion);
    broadcastPresence();
  });

  socket.on("disconnect", () => {
    viewerRegionBySocket.delete(socket.id);
    broadcastPresence();
  });
});

simulator.start(2000);

httpServer.listen(PORT, () => {
  console.log(`[server] Socket.IO fleet server listening on port ${PORT}`);
  console.log(`[server] Accepting connections from ${CLIENT_ORIGIN}`);
});
