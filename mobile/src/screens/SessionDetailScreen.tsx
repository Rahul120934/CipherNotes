import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ConfidenceBadge } from "../components/ConfidenceBadge";
import { useSessions } from "../context/SessionsContext";
import { RootStackParamList } from "../navigation/types";
import { useAppTheme } from "../theme/theme";

type SessionDetailRoute = RouteProp<RootStackParamList, "SessionDetail">;

export const SessionDetailScreen: React.FC = () => {
  const theme = useAppTheme();
  const route = useRoute<SessionDetailRoute>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { sessions, deleteSession } = useSessions();

  const session = sessions.find(
    (item) => item.sessionId === route.params.sessionId,
  );

  if (!session) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.mutedText }}>Session not found.</Text>
      </View>
    );
  }

  const handleDelete = (): void => {
    Alert.alert(
      "Delete Session",
      "This will permanently delete this session.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void deleteSession(session.sessionId).then(() =>
              navigation.goBack(),
            );
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {session.subject}
      </Text>
      <Text
        style={[styles.meta, { color: theme.mutedText }]}
      >{`Prof. ${session.professor}`}</Text>
      <ConfidenceBadge score={session.confidenceScore} />

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Summary</Text>
      <Text style={[styles.body, { color: theme.text }]}>
        {session.summary}
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Key Takeaways
      </Text>
      {session.takeaways.map((point) => (
        <Text
          key={point}
          style={[styles.bullet, { color: theme.text }]}
        >{`• ${point}`}</Text>
      ))}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Revision Questions
      </Text>
      {session.questions.map((question, index) => (
        <View
          key={`${question.question}-${index}`}
          style={[
            styles.questionCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text
            style={[styles.question, { color: theme.text }]}
          >{`${index + 1}. ${question.question}`}</Text>
          {question.options.map((option) => (
            <Text
              key={option}
              style={[
                styles.option,
                {
                  color:
                    option === question.answer
                      ? theme.primary
                      : theme.mutedText,
                },
              ]}
            >
              {option}
            </Text>
          ))}
        </View>
      ))}

      <Pressable
        onPress={handleDelete}
        style={({ pressed }) => [
          styles.deleteButton,
          {
            borderColor: theme.danger,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={[styles.deleteText, { color: theme.danger }]}>
          Delete Session
        </Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700" },
  meta: { marginTop: 5, marginBottom: 12 },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "700",
  },
  body: { lineHeight: 22 },
  bullet: { marginBottom: 6, lineHeight: 21 },
  questionCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  question: { fontWeight: "600", marginBottom: 6, lineHeight: 20 },
  option: { marginTop: 3 },
  deleteButton: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  deleteText: {
    fontWeight: "700",
    fontSize: 15,
  },
});
