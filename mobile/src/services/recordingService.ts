import {
  AudioModule,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  RecordingPresets,
} from "expo-audio";

let activeRecording: InstanceType<typeof AudioModule.AudioRecorder> | null =
  null;

export const startLectureRecording = async (): Promise<void> => {
  const permission = await requestRecordingPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Microphone permission is required.");
  }

  await setAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    allowsBackgroundRecording: true,
    interruptionMode: "duckOthers",
  });

  const recording = new AudioModule.AudioRecorder(
    RecordingPresets.HIGH_QUALITY,
  );
  await recording.prepareToRecordAsync();
  recording.record();

  activeRecording = recording;
};

export const stopLectureRecording = async (): Promise<string> => {
  if (!activeRecording) {
    throw new Error("No active recording found.");
  }

  await activeRecording.stop();
  const uri = activeRecording.uri;
  activeRecording = null;

  if (!uri) {
    throw new Error("Failed to retrieve recording path.");
  }

  return uri;
};
