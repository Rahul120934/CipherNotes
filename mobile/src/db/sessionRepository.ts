import * as SQLite from "expo-sqlite";
import { Session } from "../types/session";

const DATABASE_NAME = "ciphernotes.db";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
};

export const initializeDatabase = async (): Promise<void> => {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id TEXT PRIMARY KEY NOT NULL,
      created_at TEXT NOT NULL,
      subject TEXT NOT NULL,
      professor TEXT NOT NULL,
      audio_file_path TEXT NOT NULL,
      transcript TEXT NOT NULL,
      confidence_score INTEGER NOT NULL,
      summary TEXT NOT NULL,
      takeaways TEXT NOT NULL,
      questions TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL
    );
  `);
};

export const saveSession = async (session: Session): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `
      INSERT INTO sessions (
        session_id, created_at, subject, professor, audio_file_path, transcript,
        confidence_score, summary, takeaways, questions, duration_minutes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      session.sessionId,
      session.createdAt,
      session.subject,
      session.professor,
      session.audioFilePath,
      session.transcript,
      session.confidenceScore,
      session.summary,
      JSON.stringify(session.takeaways),
      JSON.stringify(session.questions),
      session.durationMinutes,
    ],
  );
};

interface SessionRow {
  session_id: string;
  created_at: string;
  subject: string;
  professor: string;
  audio_file_path: string;
  transcript: string;
  confidence_score: number;
  summary: string;
  takeaways: string;
  questions: string;
  duration_minutes: number;
}

export const listSessions = async (): Promise<Session[]> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<SessionRow>(
    `SELECT * FROM sessions ORDER BY datetime(created_at) DESC`,
  );

  return rows.map((row) => ({
    sessionId: row.session_id,
    createdAt: row.created_at,
    subject: row.subject,
    professor: row.professor,
    audioFilePath: row.audio_file_path,
    transcript: row.transcript,
    confidenceScore: row.confidence_score,
    summary: row.summary,
    takeaways: JSON.parse(row.takeaways),
    questions: JSON.parse(row.questions),
    durationMinutes: row.duration_minutes,
  }));
};

export const getSessionById = async (
  sessionId: string,
): Promise<Session | null> => {
  const db = await getDatabase();
  const row = await db.getFirstAsync<SessionRow>(
    `SELECT * FROM sessions WHERE session_id = ?`,
    [sessionId],
  );

  if (!row) {
    return null;
  }

  return {
    sessionId: row.session_id,
    createdAt: row.created_at,
    subject: row.subject,
    professor: row.professor,
    audioFilePath: row.audio_file_path,
    transcript: row.transcript,
    confidenceScore: row.confidence_score,
    summary: row.summary,
    takeaways: JSON.parse(row.takeaways),
    questions: JSON.parse(row.questions),
    durationMinutes: row.duration_minutes,
  };
};

export const deleteSessionById = async (sessionId: string): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM sessions WHERE session_id = ?`, [sessionId]);
};
