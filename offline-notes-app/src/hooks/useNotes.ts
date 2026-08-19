import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initDatabase,
  getAllNotes,
  insertNote,
  updateNote as updateNoteInDb,
  deleteNote as deleteNoteInDb,
  markNotesSyncing,
  markNotesSynced,
  markNotesFailed
} from "../db/database";
import { useNetworkStatus } from "./useNetworkStatus";
import type { Note, NoteDraft } from "../types";

const LAST_SYNCED_KEY = "offline-notes:last-synced-at";

/**
 * Simulates a server round-trip. There's no real backend in this demo
 * on purpose — the point is the offline-first *client* architecture
 * (queue writes locally, flush on reconnect, surface sync state in the
 * UI), which is identical whether the eventual endpoint is a real API
 * or this stand-in. Swapping this for a real `fetch` call to your
 * backend is the only change needed to go from demo to production.
 */
async function simulateUploadToServer(note: Note): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 400));
  // Small deliberate failure rate so the "failed" sync-status path in
  // the UI is actually reachable during a demo, not just theoretical.
  if (Math.random() < 0.08) {
    throw new Error(`Simulated upload failure for note ${note.id}`);
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const connectivity = useNetworkStatus();
  const syncInFlightRef = useRef(false);

  const refresh = useCallback(async () => {
    const all = await getAllNotes();
    setNotes(all);
  }, []);

  useEffect(() => {
    (async () => {
      await initDatabase();
      const stored = await AsyncStorage.getItem(LAST_SYNCED_KEY);
      if (stored) setLastSyncedAt(Number(stored));
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const syncPendingNotes = useCallback(async () => {
    // Guard against overlapping sync runs — e.g. connectivity flapping
    // (offline -> online -> offline -> online) shouldn't kick off a
    // second flush while the first is still in flight.
    if (syncInFlightRef.current) return;

    const pending = (await getAllNotes()).filter(
      (n) => n.syncStatus === "pending" || n.syncStatus === "failed"
    );
    if (pending.length === 0) return;

    syncInFlightRef.current = true;
    setIsSyncing(true);

    const pendingIds = pending.map((n) => n.id);
    await markNotesSyncing(pendingIds);
    await refresh();

    const succeededIds: string[] = [];
    const failedIds: string[] = [];

    for (const note of pending) {
      try {
        await simulateUploadToServer(note);
        succeededIds.push(note.id);
      } catch {
        failedIds.push(note.id);
      }
    }

    await markNotesSynced(succeededIds);
    await markNotesFailed(failedIds);

    const now = Date.now();
    await AsyncStorage.setItem(LAST_SYNCED_KEY, String(now));
    setLastSyncedAt(now);

    await refresh();
    setIsSyncing(false);
    syncInFlightRef.current = false;
  }, [refresh]);

  // Flush the queue whenever connectivity is restored.
  useEffect(() => {
    if (connectivity === "online") {
      syncPendingNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectivity]);

  const createNote = useCallback(
    async (draft: NoteDraft) => {
      await insertNote(draft);
      await refresh();
      if (connectivity === "online") syncPendingNotes();
    },
    [refresh, connectivity, syncPendingNotes]
  );

  const editNote = useCallback(
    async (id: string, draft: NoteDraft) => {
      await updateNoteInDb(id, draft);
      await refresh();
      if (connectivity === "online") syncPendingNotes();
    },
    [refresh, connectivity, syncPendingNotes]
  );

  const removeNote = useCallback(
    async (id: string) => {
      await deleteNoteInDb(id);
      await refresh();
    },
    [refresh]
  );

  const pendingCount = notes.filter(
    (n) => n.syncStatus === "pending" || n.syncStatus === "failed"
  ).length;

  return {
    notes,
    loading,
    connectivity,
    isSyncing,
    lastSyncedAt,
    pendingCount,
    createNote,
    editNote,
    removeNote,
    syncNow: syncPendingNotes
  };
}
