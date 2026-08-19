import { io } from "socket.io-client";

const socket = io("http://localhost:4000");
let updateCount = 0;
let eventCount = 0;

socket.on("connect", () => console.log("[test] connected:", socket.id));
socket.on("devices:init", (devices) => console.log("[test] devices:init — got", devices.length, "devices"));
socket.on("presence:update", (presence) => console.log("[test] presence:update", presence));
socket.on("device:update", () => { updateCount++; });
socket.on("event:new", (e) => { eventCount++; console.log("[test] event:new —", e.message); });

setTimeout(() => {
  console.log(`[test] Received ${updateCount} device:update events, ${eventCount} event:new events in the window.`);
  socket.emit("viewing:region", "North");
}, 3000);

setTimeout(() => {
  socket.close();
  process.exit(0);
}, 5000);
