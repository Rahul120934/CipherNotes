import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../theme/theme";

export const SettingsScreen: React.FC = () => {
  const theme = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: theme.text }]}>Theme</Text>
        <Text style={[styles.cardBody, { color: theme.mutedText }]}>
          Follows your system light/dark preference.
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: theme.text }]}>Storage</Text>
        <Text style={[styles.cardBody, { color: theme.mutedText }]}>
          Sessions are stored locally on-device using SQLite.
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: theme.text }]}>Privacy</Text>
        <Text style={[styles.cardBody, { color: theme.mutedText }]}>
          Audio is processed only when you explicitly run transcription and AI
          generation.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 28 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardBody: { marginTop: 6, lineHeight: 20 },
});
