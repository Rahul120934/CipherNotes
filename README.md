# 📝 CipherNotes

An AI-powered Lecture Recorder & Summarizer built with React Native (Expo). CipherNotes allows students to seamlessly record long lectures, transcribe the audio, and use Google's Gemini AI to automatically generate summaries, key takeaways, and flashcard-like quizzes—all stored locally on your device for absolute privacy.

---

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/a5f090c2-c731-4036-97bd-0a573afccc82" width="22%" />
  <img src="https://github.com/user-attachments/assets/a34de44e-a69a-4978-ada2-06ee393a8b51" width="22%" />
  <img src="https://github.com/user-attachments/assets/734d6208-5f28-4af2-8e0d-5143d634dc7f" width="22%" />
  <img src="https://github.com/user-attachments/assets/555ed712-7ab9-4226-94fc-91ba9b1c8ed8" width="22%" />
</p>

---

## 🚀 Quick Start Guide

Get up and running with CipherNotes in a few simple steps.

### Prerequisites

- Node.js (>= 18)
- npm or yarn
- Expo Go App installed on your iOS or Android device (for physical device testing)

### Installation

1. **Clone the project & Navigate to the mobile directory**

   ```bash
   git clone https://github.com/Rahul120934/CipherNotes.git
   cd CipherNotes/mobile
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create an `.env` file in the `mobile` directory using the provided example:

   ```bash
   cp .env.example .env
   ```

   Add your Gemini API Key to the new `.env` file:

   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_google_ai_studio_api_key_here
   ```

4. **Start the Application**
   ```bash
   npm run start
   ```
   Scan the QR code with your iOS Camera or the Expo Go app on Android to launch CipherNotes.

---

## ✨ Features & Project Details

### 🎙️ Smart Lecture Recording

Capture high-quality audio in the background. Stop and save recordings that are instantly piped into a transcription service.

### 🧠 Automated AI Insights

Harnessing the power of Gemini Flash models, transcripts are evaluated to automatically extract:

- **Subject & Professor:** Intelligent tagging of lectures.
- **Summaries:** A concise digest of complex information.
- **Actionable Takeaways:** Bulleted key points for quick revision.
- **Confidence Scoring:** Determines how reliable the information extracted from the transcript is.
- **Model Fallback:** Robust API error handling dynamically switches between available Gemini models to guarantee generation success.

### 📚 Study & Quiz Mode

Active recall built directly into the app! For every lecture recorded, CipherNotes generates a set of 5 interactive multiple-choice questions. Dive into the **Study Mode** tab to pick a session and test your knowledge.

### 🎨 The "Neon Lexicon" Design System

An entirely custom UI framework leveraging:

- Perfect Tonal Contrast
- Ghost Borders and Ambient Glows
- Highly polished Dark and Light modes dynamically linked to a global `ThemeProvider` and persisted on-device via `AsyncStorage`.

### 📱 Local & Secure Storage

Your sessions, transcripts, and AI-generated notes stay on your device globally via `expo-sqlite`, ensuring offline-accessibility, swift load times, and data privacy.

---

## 🏗️ Project Architecture

```text
mobile/
 ├── .env                 # Environment variables (API Keys)
 ├── App.tsx              # Application entrypoint & providers
 ├── src/
 │    ├── components/     # Reusable UI (SessionCard, ConfidenceBadge)
 │    ├── constants/      # Shared literal values and mocks
 │    ├── context/        # React Context (Sessions global state)
 │    ├── db/             # Local SQLite repository logic
 │    ├── navigation/     # React Navigation (Bottom Tabs) configurations
 │    ├── screens/        # Primary Views (Home, Record, Sessions, Study, Settings)
 │    ├── services/       # AI, Transcription, and Recording logic
 │    ├── theme/          # Global styles, color tokens (Neon Lexicon)
 │    └── types/          # TypeScript interfaces (Session, Draft, Questions)
```

## 🛠️ Tech Stack

- **Framework:** React Native / Expo
- **Language:** TypeScript
- **State Management:** React Context API
- **Local Database:** Expo SQLite
- **Persistence:** React Native AsyncStorage
- **AI Processing:** Google Gemini API (`@google/genai`)
- **Routing:** React Navigation (Bottom Tabs)

## 🔮 Next Implementation Steps

1. Add chunked audio upload and transcription stitching for highly extensive lectures.
2. Add PDF export features built on top of `expo-print` + `expo-sharing`.
3. Add robust list filtering by Date, Professor, and Subject tags.
