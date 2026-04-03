# CipherNotes Mobile MVP

React Native (Expo) app scaffold for the AI Lecture Recorder & Summarizer.

## Implemented so far

- Background-capable lecture recording flow (`expo-av`)
- Local session persistence with SQLite (`expo-sqlite`)
- Transcript + AI output service interfaces with mock implementations
- Session tagging (`subject`, `professor`)
- Searchable session history
- Session detail view with summary, confidence badge, takeaways, and questions
- Study Mode quiz flow
- Light/Dark support based on system theme

## Project Structure

- `src/screens`: Home, Record, Sessions, Study, Settings, Session Details
- `src/services`: recording, transcription, AI processing
- `src/db`: SQLite repository and schema
- `src/context`: shared sessions state provider
- `src/components`: reusable UI blocks
- `src/theme`: app theme tokens and hook

## Run locally

```bash
cd mobile
npm install
npm run typecheck
npm run start
```

## Next implementation steps

1. Replace mock `transcriptionService` with Whisper API integration.
2. Replace mock `aiService` with Gemini structured JSON generation.
3. Add chunked audio upload/transcription stitching for long lectures.
4. Add PDF export (`expo-print` + `expo-sharing`).
5. Add robust filtering by date + professor + subject.
