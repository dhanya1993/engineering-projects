import * as SQLite from "expo-sqlite";
import type { Note, NoteDraft, SyncStatus } from "../types";

/**
 * All local persistence for this app lives in SQLite rather than
 * AsyncStorage — notes are structured, queryable records (we filter and
 * sort by updatedAt and syncStatus), which is exactly the case where
 * SQLite pays for itself over a flat key-value store. AsyncStorage is
 * still used, separately, for the lightweight "when did we last sync"
 * timestamp (see hooks/useNotes.ts).
 */

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("offline_notes.db");
  }
  return dbPromise;
}

export async function initDatabase() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      audioUri TEXT,
      updatedAt INTEGER NOT NULL,
      syncStatus TEXT NOT NULL DEFAULT 'pending'
    );
  `);
}

function rowToNote(row: any): Note {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    audioUri: row.audioUri ?? null,
    updatedAt: row.updatedAt,
    syncStatus: row.syncStatus as SyncStatus
  };
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>("SELECT * FROM notes ORDER BY updatedAt DESC;");
  return rows.map(rowToNote);
}

export async function insertNote(draft: NoteDraft): Promise<Note> {
  const db = await getDb();
  const note: Note = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: draft.title,
    body: draft.body,
    audioUri: draft.audioUri,
    updatedAt: Date.now(),
    syncStatus: "pending"
  };

  await db.runAsync(
    "INSERT INTO notes (id, title, body, audioUri, updatedAt, syncStatus) VALUES (?, ?, ?, ?, ?, ?);",
    [note.id, note.title, note.body, note.audioUri, note.updatedAt, note.syncStatus]
  );

  return note;
}

export async function updateNote(id: string, draft: NoteDraft): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    "UPDATE notes SET title = ?, body = ?, audioUri = ?, updatedAt = ?, syncStatus = 'pending' WHERE id = ?;",
    [draft.title, draft.body, draft.audioUri, Date.now(), id]
  );
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM notes WHERE id = ?;", [id]);
}

export async function markNotesSynced(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const db = await getDb();
  const placeholders = ids.map(() => "?").join(", ");
  await db.runAsync(`UPDATE notes SET syncStatus = 'synced' WHERE id IN (${placeholders});`, ids);
}

export async function markNotesSyncing(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const db = await getDb();
  const placeholders = ids.map(() => "?").join(", ");
  await db.runAsync(`UPDATE notes SET syncStatus = 'syncing' WHERE id IN (${placeholders});`, ids);
}

export async function markNotesFailed(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const db = await getDb();
  const placeholders = ids.map(() => "?").join(", ");
  await db.runAsync(`UPDATE notes SET syncStatus = 'failed' WHERE id IN (${placeholders});`, ids);
}
