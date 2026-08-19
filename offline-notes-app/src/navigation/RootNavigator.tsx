import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NotesListScreen } from "../screens/NotesListScreen";
import { NoteEditorScreen } from "../screens/NoteEditorScreen";

export type RootStackParamList = {
  NotesList: undefined;
  NoteEditor: { noteId: string | null };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#F5F9F7" },
          headerShadowVisible: false,
          headerTintColor: "#101B18"
        }}
      >
        <Stack.Screen name="NotesList" component={NotesListScreen} options={{ title: "Notes" }} />
        <Stack.Screen
          name="NoteEditor"
          component={NoteEditorScreen}
          options={{ title: "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
