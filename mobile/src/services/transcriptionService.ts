import * as FileSystem from "expo-file-system/legacy";

const GEMINI_MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
] as const;

export interface TranscriptionResult {
  transcript: string;
  confidenceScore: number;
}

export const transcribeAudio = async (
  audioFilePath: string,
): Promise<TranscriptionResult> => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.warn(
      "Gemini API key not found. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.",
    );
    throw new Error("Gemini API key missing.");
  }

  try {
    const base64Audio = await FileSystem.readAsStringAsync(audioFilePath, {
      encoding: "base64",
    });

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: "Please transcribe the following audio accurately. Reply ONLY with the exact transcription, nothing else.",
            },
            {
              inlineData: {
                mimeType: "audio/m4a",
                data: base64Audio,
              },
            },
          ],
        },
      ],
    };

    const response = await fetchWithModelFallback(apiKey, requestBody);

    if (!response.ok) {
      const errorBody = await response.text();

      let parsedError: {
        error?: { message?: string; details?: Array<{ reason?: string }> };
      } | null = null;
      try {
        parsedError = JSON.parse(errorBody);
      } catch {
        parsedError = null;
      }

      const reason = parsedError?.error?.details?.[0]?.reason;
      if (reason === "API_KEY_INVALID") {
        throw new Error(
          "Gemini API key is invalid. Update EXPO_PUBLIC_GEMINI_API_KEY in mobile/.env and restart Expo with cache clear.",
        );
      }

      const message =
        parsedError?.error?.message ||
        response.statusText ||
        "Unknown Gemini API error";
      throw new Error(`Failed to transcribe audio with Gemini: ${message}`);
    }

    const resultData = await response.json();
    const transcript =
      resultData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      transcript: transcript.trim(),
      confidenceScore: 95, // Gemini does not provide per-word confidence like Whisper, so we fallback to a constant
    };
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

const fetchWithModelFallback = async (
  apiKey: string,
  body: Record<string, unknown>,
): Promise<Response> => {
  let lastResponse: Response | null = null;

  for (const model of GEMINI_MODEL_CANDIDATES) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (response.ok) {
      return response;
    }

    let parsedError: {
      error?: { message?: string; details?: Array<{ reason?: string }> };
    } | null = null;
    try {
      parsedError = JSON.parse(await response.text());
    } catch {
      parsedError = null;
    }

    const reason = parsedError?.error?.details?.[0]?.reason;
    const message = parsedError?.error?.message || "";
    const isModelUnavailable =
      reason === "NOT_FOUND" ||
      message.includes("not found") ||
      message.includes("not supported for generateContent");

    if (!isModelUnavailable) {
      return new Response(
        JSON.stringify(parsedError ?? { error: { message } }),
        {
          status: response.status,
          statusText: response.statusText,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    lastResponse = response;
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw new Error("No Gemini model candidates available.");
};
