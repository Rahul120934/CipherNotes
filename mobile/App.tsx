import React from "react";
import { StatusBar } from "expo-status-bar";
import { SessionsProvider } from "./src/context/SessionsContext";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { ThemeProvider } from "./src/theme/theme";

export default function App() {
  return (
    <ThemeProvider>
      <SessionsProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </SessionsProvider>
    </ThemeProvider>
  );
}
