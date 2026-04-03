import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSessions } from "../context/SessionsContext";
import { useAppTheme } from "../theme/theme";

export const StudyScreen: React.FC = () => {
  const theme = useAppTheme();
  const { sessions } = useSessions();

  const session = useMemo(() => sessions[0], [sessions]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!session) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.mutedText }}>
          No session available yet. Record a lecture first.
        </Text>
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
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.progress, { color: theme.mutedText }]}>
        {`Question ${questionIndex + 1} of ${session.questions.length}`}
      </Text>
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
                borderColor: isCorrect
                  ? theme.primary
                  : isWrongChoice
                    ? theme.danger
                    : isSelected
                      ? theme.secondary
                      : theme.border,
                backgroundColor: theme.card,
              },
            ]}
          >
            <Text style={{ color: theme.text }}>{option}</Text>
          </Pressable>
        );
      })}

      <Pressable
        onPress={submitted ? nextQuestion : submitAnswer}
        style={[styles.actionButton, { backgroundColor: theme.primary }]}
      >
        <Text style={styles.actionText}>
          {submitted ? (isLastQuestion ? "Finish" : "Next") : "Submit"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  progress: { marginBottom: 10 },
  question: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
    marginBottom: 18,
  },
  option: {
    borderWidth: 1,
    borderRadius: 12,
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
  actionText: { color: "#0a0a0f", fontWeight: "700", fontSize: 16 },
  resultTitle: { fontSize: 24, fontWeight: "700" },
  resultBody: { marginTop: 8, fontSize: 17 },
});
