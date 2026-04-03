import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppTheme, useThemeMode } from "../theme/theme";

export const SettingsScreen: React.FC = () => {
  const theme = useAppTheme();
  const { mode, toggleTheme } = useThemeMode();
  const nextMode = mode === "dark" ? "light" : "dark";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <Pressable
        onPress={toggleTheme}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.surfaceContainerLow,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: theme.text }]}>Theme</Text>
        <Text style={[styles.cardBody, { color: theme.mutedText }]}>
          {`Current: ${mode}. Tap to switch to ${nextMode}.`}
        </Text>
      </Pressable>

      <View
        style={[styles.card, { backgroundColor: theme.surfaceContainerLow }]}
      >
        <Text style={[styles.cardTitle, { color: theme.text }]}>Storage</Text>
        <Text style={[styles.cardBody, { color: theme.mutedText }]}>
          Sessions are stored locally on-device using SQLite.
        </Text>
      </View>

      <View
        style={[styles.card, { backgroundColor: theme.surfaceContainerLow }]}
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
  content: {
    paddingLeft: 20,
    paddingRight: 12,
    paddingBottom: 28,
    paddingTop: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: -0.48,
  },
  card: { borderRadius: 14, padding: 14, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardBody: { marginTop: 6, lineHeight: 20 },
});
