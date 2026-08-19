import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SyncStatusBadge } from "./SyncStatusBadge";
import type { Note } from "../types";

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

function formatRelativeTime(timestampMs: number): string {
  const diffMs = Date.now() - timestampMs;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.round(diffHr / 24)}d ago`;
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title || "Untitled note"}
        </Text>
        <SyncStatusBadge status={note.syncStatus} />
      </View>
      {note.body ? (
        <Text style={styles.body} numberOfLines={2}>
          {note.body}
        </Text>
      ) : null}
      <View style={styles.footerRow}>
        {note.audioUri ? <Text style={styles.audioTag}>🎙 Voice note</Text> : null}
        <Text style={styles.timestamp}>{formatRelativeTime(note.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9F1EC",
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#101B18"
  },
  body: {
    marginTop: 4,
    fontSize: 13,
    color: "#4A7268",
    lineHeight: 18
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8
  },
  audioTag: {
    fontSize: 11,
    color: "#6E9A8F"
  },
  timestamp: {
    fontSize: 11,
    color: "#9FC0B5",
    marginLeft: "auto"
  }
});
