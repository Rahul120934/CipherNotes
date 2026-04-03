# Design Document
## Project: AI Lecture Recorder & Summarizer
**Version:** 1.2 | **Date:** April 1, 2026 | **Author:** Rahul Narvekar

---

## 1. System Architecture

### High-Level Flow
```
[User's Phone]
    → Background Audio Recording (expo-av)
    → Audio File (.mp3/.wav)
    → OpenAI Whisper API (Transcription + Confidence Score)
    → Raw Transcript
    → Google Gemini API (Summary + Takeaways + Questions)
    → Structured Output
    → SQLite Local DB + Displayed to User
```

---

## 2. Component Design

### 2.1 Recording Module
- Handles microphone access and background recording via expo-av
- Saves audio in chunks (every 10 minutes) for reliability
- Manages file naming and local storage

### 2.2 Transcription Module
- Sends audio to OpenAI Whisper API
- Receives raw transcript text and confidence score
- Handles chunked audio stitching for long lectures

### 2.3 AI Processing Module
- Sends transcript to Google Gemini 1.5 Flash
- Structured prompt returns JSON with summary, takeaways, and questions
- Parses and stores formatted response

### 2.4 Study Mode Module
- Reads generated revision questions from DB
- Presents multiple choice quiz one question at a time
- Tracks score and shows results at end

### 2.5 UI Module
- Home screen: recent sessions, record button
- Recording screen: timer, waveform animation, stop button
- Results screen: summary/takeaways/questions tabs, confidence badge
- Study Mode screen: quiz interface with score tracking
- History screen: searchable, filterable by subject/professor tags
- Settings screen: theme, language, storage preferences

### 2.6 Storage Module
- SQLite (expo-sqlite) for session data
- Local file system for audio files

---

## 3. UI/UX Design — Cyberpunk Theme

### Design Philosophy
A dark, futuristic cyberpunk aesthetic with neon cyan and purple accents. Clean, minimal layouts with glowing borders and pulsing animations on active elements. Adapts to system light/dark mode.

### Color Palette
| Role | Dark Mode | Light Mode |
|------|-----------|------------|
| Background | #0a0a0f | #f5f5ff |
| Card Surface | #111120 | #ffffff |
| Primary Accent | #00f0ff (Neon Cyan) | #00b8c4 |
| Secondary Accent | #bf5fff (Neon Purple) | #9b3fd4 |
| Danger / Stop | #ff2d6b | #d4003a |
| Primary Text | #f0f0f0 | #1a1a2e |
| Muted Text | #888899 | #555566 |

### Typography
- Headers: Space Grotesk, 500 weight, 0.5–1px letter spacing
- Body: Inter, 400 weight, 15px, line-height 1.6
- Captions: Inter, 400 weight, 12px

### Key UI Components
- Record Button: large circular button with pulsing neon cyan border when active
- Waveform: animated vertical bars in neon cyan during recording
- Confidence Badge: color-coded pill (cyan >85%, amber 60–85%, red <60%)
- Session Cards: dark surface cards with 0.5px neon-tinted borders
- Navigation: bottom tab bar with 5 icons (Home, Record, Sessions, Quiz, Settings)
- Transitions: slide-up animation, 300ms ease

### Screen Layout Specs
- Canvas: 390 x 844px (iPhone 14 base)
- Horizontal Padding: 16px
- Card Border Radius: 16px
- Button Border Radius: 8px
- Nav Bar Height: 56px + safe area

---

## 4. Data Model

### Session Object
```json
{
  "session_id": "uuid",
  "created_at": "2026-04-01T09:00:00Z",
  "subject": "Machine Learning",
  "professor": "Dr. Sharma",
  "audio_file_path": "/local/storage/session_001.mp3",
  "transcript": "Today we will cover...",
  "confidence_score": 92,
  "summary": "This lecture covered...",
  "takeaways": ["Point 1", "Point 2"],
  "questions": [
    { "question": "What is backpropagation?", "options": ["A", "B", "C", "D"], "answer": "A" }
  ],
  "duration_minutes": 52
}
```

---

## 5. Security & Privacy
- Audio files stored only on device by default
- API keys stored in secure environment variables
- Option to auto-delete audio after processing