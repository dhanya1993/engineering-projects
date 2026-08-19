import { StyleSheet, Text, View } from "react-native";
import type { ConnectivityState } from "../hooks/useNetworkStatus";

interface NetworkBannerProps {
  status: ConnectivityState;
  pendingCount: number;
}

const COPY: Record<ConnectivityState, string> = {
  offline: "You're offline. Notes are saved on this device and will sync once you reconnect.",
  reconnecting: "Reconnecting…",
  online: "Online"
};

/**
 * Same visual/interaction pattern as NetworkBanner in the web component
 * library — deliberately kept as the same three states (offline /
 * reconnecting / restored) so the design language stays consistent
 * across platforms even though the implementation is native View/Text
 * instead of HTML.
 */
export function NetworkBanner({ status, pendingCount }: NetworkBannerProps) {
  if (status === "online" && pendingCount === 0) return null;

  const backgroundColor =
    status === "offline" ? "#182722" : status === "reconnecting" ? "#D97B3F" : "#33534A";

  return (
    <View style={[styles.banner, { backgroundColor }]}>
      <View style={styles.dot} />
      <Text style={styles.text}>
        {status === "online" && pendingCount > 0
          ? `Syncing ${pendingCount} note${pendingCount === 1 ? "" : "s"}…`
          : COPY[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.8)"
  },
  text: {
    color: "#F5F9F7",
    fontSize: 13,
    fontWeight: "500"
  }
});
