export interface RevisionQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface Session {
  sessionId: string;
  createdAt: string;
  subject: string;
  professor: string;
  audioFilePath: string;
  transcript: string;
  confidenceScore: number;
  summary: string;
  takeaways: string[];
  questions: RevisionQuestion[];
  durationMinutes: number;
}

export interface SessionDraft {
  subject: string;
  professor: string;
  audioFilePath: string;
  durationMinutes: number;
}
