# Fleet Pulse — Live Real-Time Dashboard

A live-updating device-fleet dashboard built on Socket.IO — no database, no polling. A Node.js
backend simulates 24 IoT devices across four regions and pushes every status change, battery
reading, and alert to connected clients the instant it happens.

**Run it and watch it work** — this is the fastest of my portfolio projects to actually see live:
two `npm install`s, two `npm run dev`s, no environment variables to configure, no database to
provision.

## Why this exists

"Socket.IO (real-time)" was one line of exposure on my resume from an IoT fleet-management
platform — accurate, but with nothing a reviewer could actually click through. This project pulls
the same category of problem (push live telemetry to a dashboard, track who's viewing what, keep
the UI honest about its own connection state) into something small enough to read end-to-end in
one sitting.

## What it does

- **Live device grid** — 24 simulated devices across North/South/East/West regions, each with a
  status (online/offline), battery %, and temperature that update in real time as the server pushes
  individual `device:update` events (not a full re-broadcast every tick — see below)
- **Live area chart** — a rolling 30-point history of online-device count, sampled on a fixed
  interval so the chart stays legible even though updates arrive multiple times a second
- **Live activity feed** — status-flip and low-battery alerts, newest first, capped at 50 entries
- **Region filter with live presence** — switch to "North" and the dashboard shows only North's
  devices; the server tracks this with real Socket.IO room membership and broadcasts "N people
  viewing this region" to everyone connected
- **A real connection-state indicator** — Connecting / Live / Reconnecting / Disconnected, derived
  from the underlying socket.io-client reconnection events rather than a single connected/
  disconnected boolean

## Architecture notes (the parts worth reading first)

| File | What it demonstrates |
|---|---|
| `server/src/simulator/deviceSimulator.js` | Ticks 2-5 random devices per interval rather than the whole fleet — a real device fleet doesn't report in lockstep, and this is also just cheaper on the wire than re-sending 24 objects every tick. Emits fine-grained `device:update` events per changed device. |
| `server/src/index.js` | Room-based presence tracking: every socket is assigned a "viewing region," tracked in a `Map`, and presence counts are recomputed and broadcast on connect/disconnect/region-switch. This is the same pattern (room-scoped visibility) used for the regional-manager scoping on a production IoT platform, shown here in isolation. |
| `client/src/hooks/useSocket.ts` | Derives a real four-state connection indicator (connecting/connected/reconnecting/disconnected) from socket.io-client's manager-level reconnect events, since the client doesn't expose that as a single value on its own. |
| `client/src/hooks/useOnlineCountHistory.ts` | Samples the device list on a fixed interval instead of charting every `device:update` directly — necessary because updates arrive faster than a chart can (or should) redraw. |

## Running it

Two terminals, no database required.

### 1. Server

```bash
cd server
npm install
npm run dev   # http://localhost:4000
```

### 2. Client

```bash
cd client
npm install
npm run dev   # http://localhost:5176
```

Open `http://localhost:5176`. Devices will start flipping online/offline within a few seconds —
watch the activity feed, the chart, and the device grid update together. Open a second browser
tab to see the presence count increase in real time.

## Tech stack

- **Backend:** Node.js, Express (health check only), Socket.IO 4
- **Frontend:** React 18 + TypeScript, socket.io-client, Recharts, Tailwind CSS, Vite

## What I'd add next

- [ ] Persist history to a time-series store (e.g. InfluxDB or a simple MongoDB collection) so the
      chart survives a page refresh
- [ ] Per-device detail drill-in with its own historical chart
- [ ] Authentication + per-role region scoping (tie this into the RBAC project's permission model)
- [ ] WebSocket reconnection backoff visualization — show the actual retry countdown, not just a state label

## Author

**Dhanyashree H P** — Senior Software Engineer (React.js, React Native, Mobile)
[linkedin.com/in/dhanya-chinivar-773b37115](https://linkedin.com/in/dhanya-chinivar-773b37115)
