import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SessionCard } from "../components/SessionCard";
import { useSessions } from "../context/SessionsContext";
import { RootStackParamList } from "../navigation/types";
import { useAppTheme } from "../theme/theme";

export const SessionsScreen: React.FC = () => {
  const theme = useAppTheme();
  const { sessions, deleteSession } = useSessions();
  const [searchText, setSearchText] = useState("");

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const filteredSessions = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return sessions;
    }

    return sessions.filter((session) =>
      [session.subject, session.professor, session.transcript].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [searchText, sessions]);

  const handleDelete = (sessionId: string): void => {
    Alert.alert(
      "Delete Session",
      "This will permanently delete this session.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void deleteSession(sessionId);
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>Sessions</Text>
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search by subject, professor, keyword"
        placeholderTextColor={theme.mutedText}
        style={[
          styles.searchInput,
          {
            color: theme.text,
            backgroundColor: theme.surfaceContainerLowest,
            borderLeftColor: theme.ghostBorderStrong,
          },
        ]}
      />

      {filteredSessions.length === 0 ? (
        <Text style={[styles.empty, { color: theme.mutedText }]}>
          No sessions match your search.
        </Text>
      ) : (
        filteredSessions.map((session) => (
          <SessionCard
            key={session.sessionId}
            session={session}
            onPress={() =>
              navigation.navigate("SessionDetail", {
                sessionId: session.sessionId,
              })
            }
            onDelete={() => handleDelete(session.sessionId)}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingLeft: 20,
    paddingRight: 12,
    paddingBottom: 24,
    paddingTop: 12,
  },
  title: { fontSize: 24, fontWeight: "700", letterSpacing: -0.48 },
  searchInput: {
    marginTop: 14,
    marginBottom: 14,
    borderLeftWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  empty: { marginTop: 8 },
});
