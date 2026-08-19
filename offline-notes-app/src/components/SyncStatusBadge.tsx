import { StyleSheet, Text, View } from "react-native";
import type { SyncStatus } from "../types";

const CONFIG: Record<SyncStatus, { label: string; bg: string; fg: string }> = {
  synced: { label: "Synced", bg: "#E9F1EC", fg: "#33534A" },
  pending: { label: "Pending", bg: "#FBE8D8", fg: "#B4622B" },
  syncing: { label: "Syncing…", bg: "#FBE8D8", fg: "#B4622B" },
  failed: { label: "Sync failed", bg: "#FBE2E0", fg: "#B3261E" }
};

export function SyncStatusBadge({ status }: { status: SyncStatus }) {
  const { label, bg, fg } = CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999
  },
  text: {
    fontSize: 11,
    fontWeight: "600"
  }
});
