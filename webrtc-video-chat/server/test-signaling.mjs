import { io } from "socket.io-client";

const roomId = "TEST123";
const peerA = io("http://localhost:4001");
const peerB = io("http://localhost:4001");

peerA.on("connect", () => {
  console.log("[A] connected", peerA.id);
  peerA.emit("room:join", roomId);
});
peerB.on("connect", () => {
  console.log("[B] connected", peerB.id);
  setTimeout(() => peerB.emit("room:join", roomId), 300);
});

peerA.on("room:joined", (data) => console.log("[A] room:joined", data));
peerB.on("room:joined", (data) => console.log("[B] room:joined", data));
peerA.on("peer:joined", (data) => {
  console.log("[A] peer:joined", data);
  peerA.emit("signal:offer", { to: data.peerId, offer: { type: "offer", sdp: "fake-sdp" } });
});
peerB.on("signal:offer", (data) => {
  console.log("[B] received offer from", data.from, "-> sending answer");
  peerB.emit("signal:answer", { to: data.from, answer: { type: "answer", sdp: "fake-answer-sdp" } });
});
peerA.on("signal:answer", (data) => console.log("[A] received answer from", data.from));

peerA.on("peer:left", (data) => console.log("[A] peer:left", data));

setTimeout(() => {
  console.log("[test] Peer B disconnecting...");
  peerB.close();
}, 1500);

setTimeout(() => {
  peerA.close();
  process.exit(0);
}, 2500);
