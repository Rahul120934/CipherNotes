import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { useSessions } from "../context/SessionsContext";
import { useAppTheme } from "../theme/theme";

export const StudyScreen: React.FC = () => {
  const theme = useAppTheme();
  const { sessions } = useSessions();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const session = useMemo(
    () => sessions.find((s) => s.sessionId === activeSessionId),
    [sessions, activeSessionId],
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const resetQuiz = () => {
    setActiveSessionId(null);
    setQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setSubmitted(false);
  };

  if (!activeSessionId) {
    if (sessions.length === 0) {
      return (
        <View style={[styles.centered, { backgroundColor: theme.background }]}>
          <Text style={{ color: theme.mutedText }}>
            No sessions available yet. Record a lecture first.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={[styles.listContainer, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.listTitle, { color: theme.text }]}>
          Available Quizzes
        </Text>
        {sessions.map((s, index) => {
          const hasQuestions = s.questions && s.questions.length > 0;
          return (
            <Pressable
              key={s.sessionId || `session-${index}`}
              style={[
                styles.sessionCard,
                { backgroundColor: theme.surfaceContainerLow },
              ]}
              onPress={() => {
                if (hasQuestions) {
                  setActiveSessionId(s.sessionId);
                  setQuestionIndex(0);
                  setScore(0);
                  setSelectedOption(null);
                  setSubmitted(false);
                }
              }}
            >
              <Text style={[styles.sessionTitle, { color: theme.text }]}>
                {s.subject || "Untitled Session"}
              </Text>
              {hasQuestions ? (
                <Text
                  style={{
                    color: theme.primary,
                    marginTop: 8,
                    fontWeight: "600",
                  }}
                >
                  {s.questions.length} Questions • Tap to start
                </Text>
              ) : (
                <Text style={{ color: theme.mutedText, marginTop: 8 }}>
                  No questions available
                </Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    );
  }

  if (!session) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.mutedText }}>Session not found.</Text>
        <Pressable onPress={resetQuiz} style={{ marginTop: 20 }}>
          <Text style={{ color: theme.primary, fontWeight: "700" }}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const question = session.questions[questionIndex];
  const isLastQuestion = questionIndex === session.questions.length - 1;

  const submitAnswer = (): void => {
    if (!selectedOption) {
      return;
    }

    if (selectedOption === question.answer) {
      setScore((prev) => prev + 1);
    }
    setSubmitted(true);
  };

  const nextQuestion = (): void => {
    if (isLastQuestion) {
      setQuestionIndex(session.questions.length);
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setSelectedOption(null);
    setSubmitted(false);
  };

  if (questionIndex >= session.questions.length) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: theme.background, padding: 20 },
        ]}
      >
        <Text style={[styles.resultTitle, { color: theme.text }]}>
          Study Mode Complete
        </Text>
        <Text
          style={[styles.resultBody, { color: theme.mutedText }]}
        >{`Score: ${score}/${session.questions.length}`}</Text>
        <Pressable
          onPress={resetQuiz}
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.primaryContainer,
              marginTop: 30,
              paddingHorizontal: 32,
            },
          ]}
        >
          <Text style={styles.actionText}>Back to Quizzes</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.progress, { color: theme.mutedText }]}>
          {`Question ${questionIndex + 1} of ${session.questions.length}`}
        </Text>
        <Pressable onPress={resetQuiz} hitSlop={15}>
          <Text style={{ color: theme.danger, fontWeight: "600" }}>Cancel</Text>
        </Pressable>
      </View>
      <Text style={[styles.question, { color: theme.text }]}>
        {question.question}
      </Text>

      {question.options.map((option) => {
        const isSelected = selectedOption === option;
        const isCorrect = submitted && option === question.answer;
        const isWrongChoice =
          submitted && isSelected && option !== question.answer;

        return (
          <Pressable
            key={option}
            disabled={submitted}
            onPress={() => setSelectedOption(option)}
            style={[
              styles.option,
              {
                borderLeftColor: isCorrect
                  ? theme.primary
                  : isWrongChoice
                    ? theme.danger
                    : isSelected
                      ? theme.secondary
                      : theme.ghostBorderStrong,
                backgroundColor: theme.surfaceContainerLow,
              },
            ]}
          >
            <Text style={{ color: theme.text }}>{option}</Text>
          </Pressable>
        );
      })}

      <Pressable
        onPress={submitted ? nextQuestion : submitAnswer}
        style={[
          styles.actionButton,
          { backgroundColor: theme.primaryContainer },
        ]}
      >
        <Text style={styles.actionText}>
          {submitted ? (isLastQuestion ? "Finish" : "Next") : "Submit"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingLeft: 20, paddingRight: 12, paddingTop: 12 },
  listContainer: { flex: 1, padding: 20 },
  listTitle: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  sessionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingRight: 8,
  },
  progress: { marginBottom: 0 },
  question: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
    marginBottom: 18,
  },
  option: {
    borderLeftWidth: 8,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  actionButton: {
    marginTop: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  actionText: { color: "#00363a", fontWeight: "700", fontSize: 16 },
  resultTitle: { fontSize: 24, fontWeight: "700" },
  resultBody: { marginTop: 8, fontSize: 17 },
});
