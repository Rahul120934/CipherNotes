import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  deleteSessionById,
  initializeDatabase,
  listSessions,
  saveSession,
} from "../db/sessionRepository";
import { Session } from "../types/session";

interface SessionsContextValue {
  sessions: Session[];
  loading: boolean;
  refreshSessions: () => Promise<void>;
  addSession: (session: Session) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
}

const SessionsContext = createContext<SessionsContextValue | undefined>(
  undefined,
);

export const SessionsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshSessions = async (): Promise<void> => {
    const allSessions = await listSessions();
    setSessions(allSessions);
  };

  useEffect(() => {
    const bootstrap = async (): Promise<void> => {
      await initializeDatabase();
      await refreshSessions();
      setLoading(false);
    };

    bootstrap();
  }, []);

  const addSession = async (session: Session): Promise<void> => {
    await saveSession(session);
    await refreshSessions();
  };

  const deleteSession = async (sessionId: string): Promise<void> => {
    await deleteSessionById(sessionId);
    await refreshSessions();
  };

  const value = useMemo(
    () => ({ sessions, loading, refreshSessions, addSession, deleteSession }),
    [sessions, loading],
  );

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
};

export const useSessions = (): SessionsContextValue => {
  const context = useContext(SessionsContext);
  if (!context) {
    throw new Error("useSessions must be used inside SessionsProvider.");
  }

  return context;
};
