import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

interface VoiceNoteRecorderProps {
  existingUri: string | null;
  onChange: (uri: string | null) => void;
}

export function VoiceNoteRecorder({ existingUri, onChange }: VoiceNoteRecorderProps) {
  const { state, uri, error, startRecording, stopRecording, play, reset } = useVoiceRecorder();

  const activeUri = uri ?? existingUri;

  // Propagate a freshly recorded URI up to the note editor once recording
  // stops — done in an effect (not inline during render) since it calls
  // a parent state setter as a side effect.
  useEffect(() => {
    if (uri && uri !== existingUri && state === "recorded") {
      onChange(uri);
    }
  }, [uri, existingUri, state, onChange]);

  async function handlePrimaryPress() {
    if (state === "recording") {
      await stopRecording();
      return;
    }
    if (state === "idle" && !existingUri) {
      await startRecording();
      return;
    }
    if (activeUri) {
      await play(activeUri);
    }
  }

  async function handleRemove() {
    await reset();
    onChange(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Voice note</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, state === "recording" && styles.buttonRecording]}
          onPress={handlePrimaryPress}
        >
          <Text style={styles.buttonText}>
            {state === "recording"
              ? "Stop recording"
              : activeUri
              ? state === "playing"
                ? "Playing…"
                : "Play voice note"
              : "Record a voice note"}
          </Text>
        </TouchableOpacity>

        {activeUri && (
          <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#182722", marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  button: {
    backgroundColor: "#182722",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  buttonRecording: { backgroundColor: "#B3261E" },
  buttonText: { color: "#F5F9F7", fontSize: 13, fontWeight: "600" },
  removeButton: { paddingVertical: 10, paddingHorizontal: 4 },
  removeText: { color: "#B3261E", fontSize: 13, fontWeight: "500" },
  error: { color: "#B3261E", fontSize: 12, marginTop: 6 }
});
