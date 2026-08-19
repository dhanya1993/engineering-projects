# Offline Notes — React Native / Expo

An offline-first notes app that mirrors the pattern used on production React Native/Expo apps:
everything writes to local storage first and instantly, connectivity is tracked separately from
"has a signal," and a queue flushes to the server only once a connection is confirmed reachable —
with per-note sync status visible in the UI the whole time.

## Why this exists

"Offline-first" is easy to claim and easy to get wrong in a way that only shows up under real
network conditions: writes that silently fail when offline, a spinner that hangs forever on flaky
wifi, or a sync that fires twice because connectivity flapped. This project is a small, complete
reference implementation of the pattern, with the specific edge cases called out in code comments
where they're handled.

## What it does

- **Create, edit, and delete notes**, each optionally with a recorded voice-note attachment
- **Every write lands in local SQLite immediately** — there is no "waiting for the network" state
  for the user, online or not
- **A visible per-note sync badge** (`Pending` / `Syncing…` / `Synced` / `Sync failed`) so the
  offline-first behavior isn't invisible — you can see exactly what's queued
- **A network banner** (offline / reconnecting / synced) using the same three-state pattern as the
  `NetworkBanner` in my web component library, translated to React Native
- **Automatic sync-on-reconnect**, with protection against double-flushing if connectivity flaps
  rapidly (see `useNotes.ts`)

There's no real backend — `simulateUploadToServer()` in `src/hooks/useNotes.ts` stands in for one,
including a small random failure rate so the "sync failed" state is actually reachable in a demo
rather than purely theoretical. Swapping in a real API call there is the only change needed to go
from demo to production.

## Key implementation details (the parts worth reading first)

| File | What it demonstrates |
|---|---|
| `src/hooks/useNetworkStatus.ts` | `NetInfo` reports `isConnected` and `isInternetReachable` separately — reading only the former is a common bug (reports "online" on a wifi network with no actual internet). This hook combines both and adds a brief "reconnecting" transition instead of jumping straight to "online." |
| `src/hooks/useNotes.ts` | The sync queue: writes go to SQLite first, flush automatically on reconnect, and a lock (`syncInFlightRef`) prevents two overlapping flush attempts if connectivity flaps. |
| `src/hooks/useVoiceRecorder.ts` | `expo-av` recording — sets `allowsRecordingIOS: true` (a step that's easy to miss and fails silently on iOS without it), and unloads the previous `Sound` instance before creating a new one to avoid leaking native audio sessions. |
| `src/db/database.ts` | Why SQLite over AsyncStorage here specifically: notes are queried/filtered/sorted (by `updatedAt`, by `syncStatus`), which is the case where a real query engine earns its keep over a flat key-value store. |

## Running it

You'll need [Expo Go](https://expo.dev/go) on a physical device, or an iOS/Android simulator, plus
Node.js.

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `i`/`a` in the terminal
to launch a simulator.

**To see the offline behavior:** turn on airplane mode, create or edit a few notes (they save
instantly, marked "Pending"), then turn airplane mode back off — watch the network banner and the
per-note badges update as the queue flushes.

**To try the voice note feature:** open a note, tap "Record a voice note," grant microphone
permission, and tap again to stop. Playback works immediately, online or not.

## Building with EAS

`eas.json` includes development/preview/production build profiles, matching the pipeline described
in my resume:

```bash
npm install -g eas-cli
eas login
eas build --profile preview --platform android
```

## Tech stack

- Expo SDK 51, React Native 0.74, React 18, TypeScript (strict)
- `expo-sqlite` for structured local persistence
- `@react-native-async-storage/async-storage` for the lightweight last-synced timestamp
- `@react-native-community/netinfo` for connectivity state
- `expo-av` for voice-note recording/playback
- `@react-navigation/native` + `native-stack` for navigation

## What I'd add next

- [ ] Replace `simulateUploadToServer` with a real backend + conflict resolution beyond "last write wins"
- [ ] Background sync via `expo-background-fetch` so the queue can flush even when the app isn't open
- [ ] Search/filter across notes
- [ ] Unit tests for the sync-queue logic in `useNotes.ts` (the part most worth testing)

## Author

**Dhanyashree H P** — Senior Software Engineer (React.js, React Native, Mobile)
[linkedin.com/in/dhanya-chinivar-773b37115](https://linkedin.com/in/dhanya-chinivar-773b37115)
