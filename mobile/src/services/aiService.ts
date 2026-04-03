import { Session, SessionDraft } from "../types/session";

const GEMINI_MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
] as const;

interface AiOutput {
  summary: string;
  takeaways: string[];
  questions: Session["questions"];
}

export const generateStudyMaterial = async (
  transcript: string,
): Promise<AiOutput> => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.warn(
      "Gemini API key not found. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.",
    );
    throw new Error("Gemini API key missing.");
  }

  const prompt = `
System: You are an academic assistant. Given a lecture transcript, generate:
1. A concise summary (200-300 words)
2. 7 key takeaways as bullet points
3. 5 revision questions with 4 multiple choice options and the correct answer marked
Respond strictly in valid JSON format matching this structure:
{
  "summary": "String",
  "takeaways": ["String", "String"],
  "questions": [
    {
      "question": "String",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Exact matching option string"
    }
  ]
}

User: transcript text follows:
${transcript}
  `;

  try {
    const response = await fetchWithModelFallback(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

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
      throw new Error(`Gemini API Error: ${message}`);
    }

    const data = await response.json();
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      throw new Error("No output generated from AI");
    }

    const jsonParsed = JSON.parse(textOutput) as AiOutput;
    return jsonParsed;
  } catch (error) {
    console.error("AI service error:", error);
    throw error;
  }
};

export const buildSessionFromProcessing = (
  draft: SessionDraft,
  transcript: string,
  confidenceScore: number,
  aiOutput: AiOutput,
): Session => {
  return {
    sessionId: `${Date.now()}`,
    createdAt: new Date().toISOString(),
    subject: draft.subject.trim() || "General",
    professor: draft.professor.trim() || "Unknown",
    audioFilePath: draft.audioFilePath,
    transcript,
    confidenceScore,
    summary: aiOutput.summary,
    takeaways: aiOutput.takeaways,
    questions: aiOutput.questions,
    durationMinutes: draft.durationMinutes,
  };
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
        headers: { "Content-Type": "application/json" },
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
