export type SyncStatus = "synced" | "pending" | "syncing" | "failed";

export interface Note {
  id: string;
  title: string;
  body: string;
  audioUri: string | null;
  updatedAt: number; // epoch ms — used for both display and conflict-free "last write wins" sync
  syncStatus: SyncStatus;
}

export type NoteDraft = Pick<Note, "title" | "body" | "audioUri">;
