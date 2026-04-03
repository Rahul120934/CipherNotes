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
  const backgroundColor =
    score > 85
      ? theme.secondaryFixedDim
      : score >= 60
        ? "rgba(240, 173, 78, 0.25)"
        : "rgba(255, 45, 107, 0.25)";

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color }]}>{`Confidence: ${score}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
