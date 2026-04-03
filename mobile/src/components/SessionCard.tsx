import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Session } from "../types/session";
import { useAppTheme } from "../theme/theme";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface SessionCardProps {
  session: Session;
  onPress?: () => void;
  onDelete?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onPress,
  onDelete,
}) => {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surfaceContainer,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.subject, { color: theme.text }]}>
          {session.subject}
        </Text>
        <Text style={[styles.meta, { color: theme.mutedText }]}>
          {new Date(session.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text
        style={[styles.meta, { color: theme.mutedText }]}
      >{`Prof. ${session.professor}`}</Text>
      <View style={styles.badgeWrap}>
        <ConfidenceBadge score={session.confidenceScore} />
      </View>
      <Text numberOfLines={2} style={[styles.summary, { color: theme.text }]}>
        {session.summary}
      </Text>
      {onDelete ? (
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            {
              borderColor: theme.ghostBorderStrong,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={[styles.deleteText, { color: theme.secondary }]}>
            Delete
          </Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subject: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.34,
  },
  meta: {
    fontSize: 13,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  badgeWrap: {
    marginTop: 10,
  },
  summary: {
    marginTop: 12,
    lineHeight: 20,
  },
  deleteButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteText: {
    fontWeight: "700",
    fontSize: 13,
  },
});
