# Requirements Document
## Project: AI Lecture Recorder & Summarizer
**Version:** 1.2 | **Date:** April 1, 2026 | **Author:** Rahul Narvekar

---

## 1. Project Overview
An AI-powered React Native mobile application that passively records lectures in the background, transcribes the audio, and generates structured study material including summaries, key takeaways, and revision questions.

---

## 2. Functional Requirements

### 2.1 Audio Recording
- FR-01: The system shall allow users to start/stop background audio recording.
- FR-02: The app shall continue recording when the screen is locked or minimized.
- FR-03: Recordings shall be saved locally with a timestamp and session label.

### 2.2 Transcription
- FR-04: The system shall transcribe audio to text using an AI speech-to-text engine.
- FR-05: Transcription shall support English (with optional multi-language support).
- FR-06: Users shall be able to view and manually edit the raw transcript.
- FR-07: The system shall display a confidence score (%) for each transcription session, color-coded as green (>85%), amber (60–85%), and red (<60%).

### 2.3 AI Processing
- FR-08: The system shall generate a concise summary of the lecture (200–400 words).
- FR-09: The system shall extract 5–10 key takeaways as bullet points.
- FR-10: The system shall generate 5 revision questions with answers based on the content.
- FR-11: Users shall be able to regenerate or customize outputs.

### 2.4 Session Tagging
- FR-12: Users shall be able to tag each session with a subject (e.g., Machine Learning, Physics).
- FR-13: Users shall be able to tag each session with a professor/instructor name.
- FR-14: Sessions shall be filterable and searchable by subject and professor tags.

### 2.5 Study Mode
- FR-15: The system shall provide a Study Mode that quizzes users on the generated revision questions.
- FR-16: Study Mode shall present questions one at a time with multiple choice options.
- FR-17: The system shall track correct/incorrect answers and show a score at the end.

### 2.6 Storage & History
- FR-18: All sessions shall be stored locally with date, subject tag, professor tag, and generated outputs.
- FR-19: Users shall be able to search past sessions by keyword, subject, or date.

### 2.7 Export
- FR-20: Users shall be able to export outputs as PDF or share via messaging apps.

---

## 3. Non-Functional Requirements
- NFR-01: Transcription accuracy shall be ≥ 90% in a quiet classroom environment.
- NFR-02: AI output generation shall complete within 30 seconds for a 1-hour lecture.
- NFR-03: The app shall function on both Android and iOS via React Native.
- NFR-04: The app shall support both light and dark mode, respecting system settings.
- NFR-05: Data shall be stored securely; audio files shall not be uploaded without user consent.

---

## 4. User Stories
| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Student | Record my lecture hands-free | I don't miss notes |
| US-02 | Student | Get a summary after class | I can review quickly |
| US-03 | Student | See revision questions | I can prepare for exams |
| US-04 | Student | See a confidence score | I know how accurate the transcript is |
| US-05 | Student | Tag sessions by subject and professor | I can organize and find them easily |
| US-06 | Student | Take a quiz in Study Mode | I can actively reinforce my learning |
| US-07 | Student | Export my notes | I can share with classmates |

---

## 5. Constraints
- Internet connection required for transcription and AI processing.
- Background recording subject to OS-level permissions (Android/iOS).
- App theme follows system light/dark mode setting.