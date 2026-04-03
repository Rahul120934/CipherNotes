import { useColorScheme } from "react-native";

const darkTheme = {
  background: "#0a0a0f",
  card: "#111120",
  primary: "#00f0ff",
  secondary: "#bf5fff",
  danger: "#ff2d6b",
  text: "#f0f0f0",
  mutedText: "#888899",
  border: "#2a2a3d",
};

const lightTheme = {
  background: "#f5f5ff",
  card: "#ffffff",
  primary: "#00b8c4",
  secondary: "#9b3fd4",
  danger: "#d4003a",
  text: "#1a1a2e",
  mutedText: "#555566",
  border: "#d9d9ee",
};

export type AppTheme = typeof darkTheme;

export const useAppTheme = (): AppTheme => {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? darkTheme : lightTheme;
};
