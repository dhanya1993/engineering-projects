# Dhanyashree H P — Engineering Projects

Seven standalone projects, each isolating one problem that shows up as a single
line on a resume and turning it into something you can actually run and read.
Full-stack (Node + MongoDB), real-time (Socket.IO, WebRTC), native browser media
APIs, a documented component library, and an offline-first mobile app.

Every project is independent — its own dependencies, its own commands, nothing
shared between them.

## Projects

### [RBAC Fleet Admin Dashboard](rbac-admin-dashboard) — role-based access control, enforced twice

A four-tier org (super admin → national → regional → field agent) where every
tier sees a different slice of the same fleet. Permissions are checked on the
server *and* reflected in the UI, deliberately in two places: the UI check is
convenience, the server check is the actual boundary.

**Stack** React · TypeScript · Vite · Node/Express · MongoDB · JWT

```bash
cd rbac-admin-dashboard/server && npm install && cp .env.example .env && npm run seed && npm run dev
cd rbac-admin-dashboard/client && npm install && cp .env.example .env && npm run dev
```

Seven demo accounts, all with password `Passw0rd!`. Sign in as
`national@demo.com`, then as `agent.south@demo.com`, and compare the Tickets and
Users pages.

### [Mini CRM](mini-crm) — contacts, deals, kanban pipeline

Contacts, a drag-and-drop deal pipeline, an activity timeline, and tasks.

**Stack** React · TypeScript · Vite · Node/Express · MongoDB · JWT

```bash
cd mini-crm/server && npm install && cp .env.example .env && npm run seed && npm run dev
cd mini-crm/client && npm install && cp .env.example .env && npm run dev
```

Demo login: `demo@minicrm.com` / `Passw0rd!`

### [Fleet Pulse](realtime-fleet-dashboard) — live dashboard over Socket.IO

24 simulated IoT devices across four regions, pushing status, battery, and
temperature changes the instant they happen. No database, no polling.

**Worth a look** — the simulator ticks 2–5 random devices per interval rather
than the whole fleet, presence is tracked with real Socket.IO room membership,
and the connection indicator derives four states (connecting / live /
reconnecting / disconnected) from the client's manager-level reconnect events.

**Stack** React · TypeScript · Vite · Recharts · Node · Socket.IO

```bash
cd realtime-fleet-dashboard/server && npm install && npm run dev
cd realtime-fleet-dashboard/client && npm install && cp .env.example .env && npm run dev
```

### [WebRTC Video Chat](webrtc-video-chat) — peer-to-peer, server out of the loop

Two people, one room code, direct browser-to-browser video, audio, and chat. The
Socket.IO server handles only the handshake; once connected, no media or messages
touch it.

**Worth a look** — ICE candidates can arrive before the remote SDP description is
applied, and `addIceCandidate()` before `setRemoteDescription()` throws. The hook
queues early candidates and flushes them once the description lands, rather than
assuming an order the network doesn't guarantee.

**Stack** React · TypeScript · Vite · WebRTC · Node · Socket.IO

```bash
cd webrtc-video-chat/server && npm install && npm run dev
cd webrtc-video-chat/client && npm install && cp .env.example .env && npm run dev
```

Open the client in **two** windows to place a call.

### [Speech / Audio / TTS Studio](speech-audio-studio) — native browser media APIs, no backend

Audio recording, text-to-speech, and live speech recognition on nothing but Web
APIs — no server, no API keys.

**Worth a look** — three real cross-browser bugs and their fixes: MIME-type
probing for `MediaRecorder` because Safari accepts a much narrower set than
Chrome; subscribing to `voiceschanged` because `getVoices()` returns empty on
first call; and an explicit session lock around `SpeechRecognition.start()`,
which throws `InvalidStateError` if called while a session is still tearing down.

**Stack** React · TypeScript · Vite · MediaRecorder · SpeechSynthesis · SpeechRecognition

```bash
cd speech-audio-studio && npm install && npm run dev
```

Chrome or Edge for speech recognition. Grant microphone permission when asked.

### [UI Component Library](ui-component-library) — 11 documented components

`Button`, `Header`, `TabBar`, `Pagination`, `EmptyState`, `NetworkBanner`,
`StatusBadge`, `Modal`, `FormInput`, `FilterBar`, `Card` — the components that
kept getting rewritten across an e-learning platform, its teacher dashboard, a
mobile app, and an IoT console, pulled into one documented package.

**Stack** React · TypeScript · Tailwind · Storybook · tsup

```bash
cd ui-component-library && npm install && npm run dev   # Storybook on :6006
```

### [Offline Notes](offline-notes-app) — offline-first React Native

Notes that save instantly with no network, queue their writes, and flush when
connectivity returns. Includes voice notes.

**Stack** React Native · Expo · TypeScript · SQLite

```bash
cd offline-notes-app && npm install && npx expo start
```

Needs [Expo Go](https://expo.dev/go) on a phone, or a simulator. To see the point
of it: turn on airplane mode, edit a few notes, then turn it back off and watch
the queue drain.

## Running several at once

Each project hardcodes a port in its `vite.config.ts`, and several of them
collide. To run more than one at a time, override the port and point the server's
`CLIENT_ORIGIN` at the new value so CORS still matches:

| Project | Backend | Frontend |
| --- | --- | --- |
| RBAC Fleet Admin | 5002 | 5181 |
| Mini CRM | 5001 | 5182 |
| Fleet Pulse | 4000 | 5183 |
| WebRTC Video Chat | 4001 | 5184 |
| Speech / Audio Studio | — | 5180 |
| UI Component Library | — | 6006 |

```bash
npm run dev -- --port 5181 --strictPort          # frontend
CLIENT_ORIGIN=http://localhost:5181 npm run dev  # its backend
```

**On macOS, port 5000 is taken by Control Center** (AirPlay Receiver), which is
why the RBAC backend runs on 5002 rather than its documented default. Either use
another port or turn off AirPlay Receiver in System Settings → General → AirDrop
& Handoff.

## Prerequisites

- **Node.js 20+** — `node -v`
- **MongoDB** for the two full-stack projects, local or Atlas. Local:
  `brew services start mongodb-community`
- **Expo Go** on a phone for Offline Notes

Each backend reads its config from `.env` — copy `.env.example` and set a real
`JWT_SECRET` (`openssl rand -hex 32`). The `.env` files are gitignored.

## Author

**Dhanyashree H P** · React.js, React Native, mobile · 9+ years
