# Tech Stack Document
## Project: AI Lecture Recorder & Summarizer
**Version:** 1.2 | **Date:** April 1, 2026 | **Author:** Rahul Narvekar

---

## 1. Primary Tech Stack — React Native (Expo)

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | React Native (Expo) | Cross-platform iOS + Android; Rahul already knows React |
| Audio Recording | expo-av | Background recording, works with screen locked |
| Local Storage | SQLite (expo-sqlite) | Lightweight, offline-first, stores all sessions locally |
| Transcription | OpenAI Whisper API | Best accuracy, returns confidence scores, handles long audio |
| AI Processing | Google Gemini 1.5 Flash | Free tier, fast, perfect for build-a-thon |
| Backend (optional) | Node.js + Express | Secure API key management |
| Build & Deploy | EAS Build (Expo) | Easy build and device testing |

### Why React Native for this project
- Background audio recording works seamlessly on both iOS and Android
- Expo reduces setup time dramatically — perfect for a hackathon
- Existing React knowledge means minimal learning curve
- App stays on the phone — no browser tab to keep open

---

## 2. AI APIs

### Transcription
- **OpenAI Whisper API** — best-in-class accuracy, confidence scores, handles chunked audio

### Summarization, Takeaways & Question Generation
- **Google Gemini 1.5 Flash** — fast, free tier, returns structured JSON

### Prompt Strategy
```
System: You are an academic assistant. Given a lecture transcript, generate:
1. A concise summary (200-300 words)
2. 7 key takeaways as bullet points
3. 5 revision questions with 4 multiple choice options and the correct answer marked

Respond in valid JSON format.

User: [transcript text here]
```

---

## 3. UI & Design

| Tool | Purpose |
|------|---------|
| Stitch (stitch.withgoogle.com) | UI prototyping and screen design |
| React Native StyleSheet | In-app styling |
| expo-haptics | Haptic feedback on record/stop |
| react-native-reanimated | Waveform and pulse animations |

### Theme
- Cyberpunk dark theme with neon cyan (#00f0ff) and purple (#bf5fff) accents
- Light/dark mode support following system settings
- Space Grotesk (headers) + Inter (body)

---

## 4. Development Tools
- Version Control: Git + GitHub
- IDE: VS Code
- Package Manager: npm or yarn
- API Testing: Postman
- Design: Stitch by Google
- Project Management: Notion or Trello

---

## 5. Build-a-thon MVP Scope

### Must Have (Core Demo)
1. Background audio recording (expo-av)
2. Transcription via Whisper API with confidence score
3. Summary + takeaways + questions via Gemini
4. Subject and professor tagging
5. Clean cyberpunk UI with dark/light mode
6. Study Mode quiz

### Nice to Have (if time permits)
- PDF export
- Search across sessions
- Multi-language transcription

### Skip for MVP
- User authentication
- Cloud sync
- Push notifications

---

## 6. Estimated Timeline (24–48 hour hackathon)
| Hours | Task |
|-------|------|
| 0–3 | Expo setup, Stitch UI mockups finalized |
| 3–8 | Audio recording + basic UI screens |
| 8–14 | Whisper API integration + confidence score display |
| 14–18 | Gemini API for summaries, takeaways, questions |
| 18–22 | Session history, subject/professor tagging, Study Mode |
| 22–24 | UI polish, cyberpunk theme, dark/light mode, demo prep |