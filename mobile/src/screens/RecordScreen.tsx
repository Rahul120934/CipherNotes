import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useAppTheme } from "../theme/theme";
import {
  startLectureRecording,
  stopLectureRecording,
} from "../services/recordingService";
import { transcribeAudio } from "../services/transcriptionService";
import {
  buildSessionFromProcessing,
  generateStudyMaterial,
} from "../services/aiService";
import { useSessions } from "../context/SessionsContext";

const toUserErrorMessage = (error: unknown): string => {
  const rawMessage =
    error instanceof Error ? error.message : "Something went wrong.";

  if (
    rawMessage.includes("API key") ||
    rawMessage.includes("API_KEY_INVALID") ||
    rawMessage.includes("INVALID_ARGUMENT")
  ) {
    return "Gemini API key is invalid or restricted. Update EXPO_PUBLIC_GEMINI_API_KEY in mobile/.env and restart Expo with cache clear.";
  }

  if (rawMessage.length > 220) {
    return `${rawMessage.slice(0, 220)}...`;
  }

  return rawMessage;
};

export const RecordScreen: React.FC = () => {
  const theme = useAppTheme();
  const { addSession } = useSessions();

  const [subject, setSubject] = useState("");
  const [professor, setProfessor] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordStartTime, setRecordStartTime] = useState<number | null>(null);

  const actionLabel = useMemo(() => {
    if (isProcessing) return "Processing...";
    return isRecording ? "Stop Recording" : "Start Recording";
  }, [isProcessing, isRecording]);

  const handleToggleRecording = async (): Promise<void> => {
    if (isProcessing) {
      return;
    }

    try {
      if (!isRecording) {
        await startLectureRecording();
        setRecordStartTime(Date.now());
        setIsRecording(true);
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
        return;
      }

      setIsProcessing(true);
      const audioFilePath = await stopLectureRecording();
      const recordingDuration = recordStartTime
        ? Math.max(1, Math.round((Date.now() - recordStartTime) / 60000))
        : 1;

      const transcription = await transcribeAudio(audioFilePath);
      const aiOutput = await generateStudyMaterial(transcription.transcript);

      const session = buildSessionFromProcessing(
        {
          subject,
          professor,
          audioFilePath,
          durationMinutes: recordingDuration,
        },
        transcription.transcript,
        transcription.confidenceScore,
        aiOutput,
      );

      await addSession(session);
      setIsRecording(false);
      setRecordStartTime(null);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Session Ready",
        "Summary, takeaways, and quiz questions are generated.",
      );
    } catch (error) {
      setIsRecording(false);
      setRecordStartTime(null);
      const message = toUserErrorMessage(error);
      Alert.alert("Recording Error", message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>Record Lecture</Text>
      <Text style={[styles.subtitle, { color: theme.mutedText }]}>
        Tag your session and record in background.
      </Text>

      <TextInput
        value={subject}
        onChangeText={setSubject}
        placeholder="Subject (e.g. Machine Learning)"
        placeholderTextColor={theme.mutedText}
        style={[
          styles.input,
          {
            color: theme.text,
            borderLeftColor: theme.ghostBorderStrong,
            backgroundColor: theme.surfaceContainerLowest,
          },
        ]}
      />
      <TextInput
        value={professor}
        onChangeText={setProfessor}
        placeholder="Professor / Instructor"
        placeholderTextColor={theme.mutedText}
        style={[
          styles.input,
          {
            color: theme.text,
            borderLeftColor: theme.ghostBorderStrong,
            backgroundColor: theme.surfaceContainerLowest,
          },
        ]}
      />

      <Pressable
        onPress={handleToggleRecording}
        style={({ pressed }) => [
          styles.recordButton,
          {
            backgroundColor: isRecording
              ? theme.secondaryContainer
              : theme.primaryContainer,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={styles.recordButtonText}>{actionLabel}</Text>
      </Pressable>

      {isProcessing && (
        <View style={styles.processingWrap}>
          <ActivityIndicator color={theme.secondary} />
          <Text style={[styles.processingText, { color: theme.mutedText }]}>
            Transcribing and generating study material...
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingLeft: 20, paddingRight: 12, paddingTop: 12 },
  title: { fontSize: 24, fontWeight: "700", letterSpacing: -0.48 },
  subtitle: { marginTop: 6, marginBottom: 18, fontSize: 14 },
  input: {
    borderLeftWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  recordButton: {
    marginTop: 12,
    borderRadius: 999,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  recordButtonText: { color: "#00363a", fontSize: 17, fontWeight: "700" },
  processingWrap: { marginTop: 20, alignItems: "center" },
  processingText: { marginTop: 10, fontSize: 14 },
});
