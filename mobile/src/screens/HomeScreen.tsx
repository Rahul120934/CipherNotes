import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppTheme } from "../theme/theme";
import { useSessions } from "../context/SessionsContext";
import { SessionCard } from "../components/SessionCard";

export const HomeScreen: React.FC = () => {
  const theme = useAppTheme();
  const { sessions, loading } = useSessions();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>CipherNotes</Text>
      <Text style={[styles.subtitle, { color: theme.mutedText }]}>
        AI Lecture Recorder & Summarizer
      </Text>

      <View
        style={[
          styles.heroCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.heroText, { color: theme.text }]}>
          Tap Record to capture a lecture in the background, then generate
          summary, takeaways, and quiz questions.
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Recent Sessions
      </Text>
      {loading ? (
        <ActivityIndicator color={theme.primary} />
      ) : sessions.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.mutedText }]}>
          No sessions yet. Start by recording your first lecture.
        </Text>
      ) : (
        sessions
          .slice(0, 3)
          .map((session) => (
            <SessionCard key={session.sessionId} session={session} />
          ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { marginTop: 6, fontSize: 14 },
  heroCard: { borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 16 },
  heroText: { lineHeight: 22, fontSize: 15 },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: { lineHeight: 21 },
});
