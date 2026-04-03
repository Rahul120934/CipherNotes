# CipherNotes Mobile MVP

React Native (Expo) app scaffold for the AI Lecture Recorder & Summarizer.

## Implemented so far

- Background-capable lecture recording flow (`expo-audio`)
- Local session persistence with SQLite (`expo-sqlite`)
- Gemini-based transcription + study material generation
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

1. Add chunked audio upload/transcription stitching for long lectures.
2. Add PDF export (`expo-print` + `expo-sharing`).
3. Add robust filtering by date + professor + subject.
