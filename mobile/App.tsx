import React from "react";
import { StatusBar } from "expo-status-bar";
import { SessionsProvider } from "./src/context/SessionsContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SessionsProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </SessionsProvider>
  );
}
