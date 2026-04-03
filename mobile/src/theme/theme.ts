import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const darkTheme = {
  background: "#131318",
  card: "#22232d",
  primary: "#00f0ff",
  secondary: "#bf5fff",
  danger: "#ff2d6b",
  text: "#f0f0f0",
  mutedText: "#a3a3b5",
  border: "rgba(0, 240, 255, 0.2)",
  surfaceDim: "#131318",
  surface: "#17171d",
  surfaceContainerLow: "#1b1c24",
  surfaceContainer: "#22232d",
  surfaceContainerHigh: "#2a2b36",
  surfaceContainerHighest: "#333545",
  surfaceContainerLowest: "#14141b",
  primaryContainer: "#00f0ff",
  onPrimary: "#00363a",
  secondaryContainer: "#5f2b90",
  secondaryFixedDim: "#8d45c8",
  onSecondaryFixed: "#f7e9ff",
  ghostBorder: "rgba(0, 240, 255, 0.2)",
  ghostBorderStrong: "rgba(0, 240, 255, 0.4)",
  ambientGlow: "rgba(0, 240, 255, 0.08)",
};

const lightTheme = {
  background: "#eef0f4",
  card: "#ffffff",
  primary: "#00b8c4",
  secondary: "#9b3fd4",
  danger: "#d4003a",
  text: "#1a1a2e",
  mutedText: "#555566",
  border: "rgba(0, 184, 196, 0.25)",
  surfaceDim: "#e2e5eb",
  surface: "#f5f6f8",
  surfaceContainerLow: "#ffffff",
  surfaceContainer: "#ffffff",
  surfaceContainerHigh: "#f8f9fa",
  surfaceContainerHighest: "#e9ecef",
  surfaceContainerLowest: "#ffffff",
  primaryContainer: "#ccebf0",
  onPrimary: "#00363a",
  secondaryContainer: "#e8d2f7",
  secondaryFixedDim: "#cfabf0",
  onSecondaryFixed: "#2f114f",
  ghostBorder: "rgba(0, 184, 196, 0.2)",
  ghostBorderStrong: "rgba(0, 184, 196, 0.4)",
  ambientGlow: "rgba(0, 184, 196, 0.1)",
};

export type AppTheme = typeof darkTheme;

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  theme: AppTheme;
  toggleTheme: () => void;
}

const THEME_MODE_STORAGE_KEY = "ciphernotes.theme.mode";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(
    colorScheme === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    const loadMode = async (): Promise<void> => {
      const storedMode = await AsyncStorage.getItem(THEME_MODE_STORAGE_KEY);
      if (storedMode === "light" || storedMode === "dark") {
        setMode(storedMode);
      }
    };

    void loadMode();
  }, []);

  const toggleTheme = (): void => {
    setMode((previousMode) => {
      const nextMode: ThemeMode = previousMode === "dark" ? "light" : "dark";
      void AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, nextMode);
      return nextMode;
    });
  };

  const value = useMemo(
    () => ({
      mode,
      theme: mode === "dark" ? darkTheme : lightTheme,
      toggleTheme,
    }),
    [mode],
  );

  return React.createElement(ThemeContext.Provider, { value }, children);
};

export const useAppTheme = (): AppTheme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used inside ThemeProvider.");
  }

  return context.theme;
};

export const useThemeMode = (): Pick<
  ThemeContextValue,
  "mode" | "toggleTheme"
> => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used inside ThemeProvider.");
  }

  return {
    mode: context.mode,
    toggleTheme: context.toggleTheme,
  };
};
