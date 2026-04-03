import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../theme/theme";

interface ConfidenceBadgeProps {
  score: number;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score }) => {
  const theme = useAppTheme();
  const color =
    score > 85 ? theme.primary : score >= 60 ? "#f0ad4e" : theme.danger;

  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{`Confidence: ${score}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
