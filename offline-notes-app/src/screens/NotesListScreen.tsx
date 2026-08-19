import { useLayoutEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNotes } from "../hooks/useNotes";
import { NetworkBanner } from "../components/NetworkBanner";
import { NoteCard } from "../components/NoteCard";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "NotesList">;

export function NotesListScreen({ navigation }: Props) {
  const { notes, loading, connectivity, pendingCount } = useNotes();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("NoteEditor", { noteId: null })}>
          <Text style={styles.addButton}>+ New</Text>
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <NetworkBanner status={connectivity} pendingCount={pendingCount} />

      {loading ? (
        <Text style={styles.emptyText}>Loading notes…</Text>
      ) : notes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No notes yet</Text>
          <Text style={styles.emptyText}>
            Tap "+ New" to create your first note. It'll save locally right away, online or not.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => navigation.navigate("NoteEditor", { noteId: item.id })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F9F7" },
  list: { paddingTop: 12, paddingBottom: 24 },
  addButton: { color: "#33534A", fontWeight: "600", fontSize: 15, marginRight: 4 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: "#182722", marginBottom: 6 },
  emptyText: { fontSize: 13, color: "#6E9A8F", textAlign: "center", lineHeight: 19 }
});
