import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNotes } from "../hooks/useNotes";
import { VoiceNoteRecorder } from "../components/VoiceNoteRecorder";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "NoteEditor">;

export function NoteEditorScreen({ route, navigation }: Props) {
  const { noteId } = route.params;
  const { notes, createNote, editNote, removeNote } = useNotes();

  const existingNote = noteId ? notes.find((n) => n.id === noteId) ?? null : null;

  const [title, setTitle] = useState(existingNote?.title ?? "");
  const [body, setBody] = useState(existingNote?.body ?? "");
  const [audioUri, setAudioUri] = useState<string | null>(existingNote?.audioUri ?? null);

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setBody(existingNote.body);
      setAudioUri(existingNote.audioUri);
    }
  }, [existingNote]);

  async function handleSave() {
    if (!title.trim() && !body.trim()) {
      navigation.goBack();
      return;
    }
    const draft = { title: title.trim() || "Untitled note", body: body.trim(), audioUri };
    if (noteId) {
      await editNote(noteId, draft);
    } else {
      await createNote(draft);
    }
    navigation.goBack();
  }

  function handleDelete() {
    if (!noteId) return;
    Alert.alert("Delete this note?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeNote(noteId);
          navigation.goBack();
        }
      }
    ]);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      )
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, title, body, audioUri]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="#9FC0B5"
          style={styles.titleInput}
        />
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Write your note…"
          placeholderTextColor="#9FC0B5"
          multiline
          style={styles.bodyInput}
        />

        <VoiceNoteRecorder existingUri={audioUri} onChange={setAudioUri} />

        {noteId && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete note</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F9F7" },
  scrollContent: { padding: 16 },
  titleInput: {
    fontSize: 20,
    fontWeight: "700",
    color: "#101B18",
    marginBottom: 12
  },
  bodyInput: {
    fontSize: 15,
    color: "#233830",
    minHeight: 160,
    textAlignVertical: "top",
    lineHeight: 22
  },
  saveButton: { color: "#33534A", fontWeight: "700", fontSize: 15, marginRight: 4 },
  deleteButton: { marginTop: 28, alignSelf: "flex-start" },
  deleteText: { color: "#B3261E", fontWeight: "600", fontSize: 14 }
});
