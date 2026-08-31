# 🌿 Hair Vitals — Intelligent Hair & Scalp Clinical Intake

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-emerald?style=for-the-badge&logo=vercel)](https://hair-clinic-app.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/JitinSaxenaa/Hair-Clinic-App)
[![Next.js](https://img.shields.io/badge/Next.js-16_(Turbopack)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq-Fast_Inference-f55036?style=for-the-badge)](https://groq.com/)

A modern, accessible, bilingual (English & Hindi/Hinglish), voice-enabled single-page web application built for the **Hair Vitals Hair & Scalp Clinic**. It transforms a tedious 19-question clinical paper intake form into an intelligent, conversational, self-filling intake experience optimized for patients on mobile and desktop devices.

---

## 🔗 Quick Links

- **🚀 Live Application (Vercel):** [https://hair-clinic-app.vercel.app/](https://hair-clinic-app.vercel.app/)
- **📦 GitHub Repository:** [https://github.com/JitinSaxenaa/Hair-Clinic-App](https://github.com/JitinSaxenaa/Hair-Clinic-App)

---

## 🏛️ System Architecture & Intake Flow

```mermaid
flowchart TD
    A([Patient Opens App]) --> B[Intelligent Open-Mic Screen]
    
    subgraph Voice_Intake ["1. Conversational Speech Capture"]
        B -->|Speak freeform Hindi / Hinglish / English| C[Browser Web Speech API]
        C --> D["Real-Time Word Streaming & Confirmation"]
        D --> E["Groq AI Engine (/api/parse-speech)"]
    end

    subgraph Intelligent_Extraction ["2. Schema Mapping & Auto-Fill"]
        E --> F[Extract Structured Clinical Fields]
        F --> G[Infer Cascade Rules & Confidence Highlights]
    end

    subgraph FollowUp_Queue ["3. Targeted Voice Follow-up (Max 2-3)"]
        G --> H{Any Unanswered Core Questions?}
        H -->|Yes| I["Conversational Assistant Voice Prompt"]
        I --> J["Fast-Path & LLM Intent Resolution (/api/parse-followup)"]
        J --> K["Auto-Fill Remaining Standards"]
        H -->|No / Finished| L[Dynamic Sex-Gated Wizard]
    end

    subgraph Form_Wizard ["4. Interactive Clinical Wizard"]
        K --> L
        L --> M["Spatial Tap-a-Diagram Scalp Selector (Q4)"]
        M --> N["Thumb-Friendly Yes/No & Number Steppers"]
        N --> O["Haptic Vibrations on Touch Devices"]
    end

    subgraph Review_Summary ["5. Doctor Review & Clinical Summary"]
        O --> P["Comprehensive Section Review (A–E)"]
        P --> Q["Groq Doctor Summary Generation (/api/summarize)"]
        Q --> R([Trichology File Ready for Doctor Consultation])
    end
```

---

## 🌟 Key Features & Innovations

### 1. 🎙️ Intelligent Open-Mic Self-Filling
- Patients can freely describe their hair journey in natural spoken English, Hindi, or Hinglish (e.g., *"I'm a 45 year old female noticing severe crown thinning for over a year, mother had similar loss, I wash hair alternate days..."*).
- **Groq LLM Engine** (`/api/parse-speech`) automatically extracts and validates schema fields in under 500ms.
- Pre-filled fields display a soft confidence banner allowing the patient to confirm or adjust the answers with a single tap.

### 2. 🤖 Conversational Follow-Up Assistant (Capped at 2–3 Questions)
- Rather than asking 19 questions manually, the assistant identifies the top 2–3 high-leverage missing data points and asks them conversationally with voice dictation.
- Features **instant audio ducking** (cancelling TTS output on mic engagement to eliminate feedback delay) and **sub-millisecond local fast-path keyword recognition**.

### 3. 🧠 Spatial Tap-a-Scalp Diagram (Q4)
- Replaces plain text choices with an interactive line-art scalp outline. Patients can directly tap anatomical regions:
  - **Receding Hairline** (Frontal band)
  - **Thinning at Crown** (Vertex zone)
  - **Widening Part Line** (Center stripe)
  - **Diffuse Thinning** (Scalp perimeter)
  - **Patchy Loss** (Parietal spots)

### 4. 🚻 Dynamic Clinical Sex-Gate & Branching Logic
- Biologically gated questions: Selecting **Male** automatically skips Q6 (`menstrual_cycle`) and Q7 (`pregnancy_related`), reducing wizard steps from 40 down to 34.
- Female workflows adapt based on cycle regularity, menopausal status, and pregnancy timeline.

### 5. 🎨 Adaptive Dual-Theme System
- **Light Theme:** Serene cool slate-blue background (`#EDF2F7`) with crisp clinical white cards and fresh emerald/teal accents (`emerald-600`, `teal-700`).
- **Dark Theme:** High-contrast midnight navy (`#070B14` and `#0B132B`) with luminous sky-blue accents (`sky-400`, `blue-500`) meeting WCAG AAA accessibility standards.

### 6. 📱 Mobile-First Accessibility & Haptic Feedback
- Touch devices trigger a physical 10ms micro-vibration (`navigator.vibrate(10)`) on chip taps, yes/no toggles, and step advancements.
- Large, thumb-friendly touch targets with instant auto-advancing on single-select options.
- Floating trichology progress tracker for mobile viewports.

### 7. 🔒 Zero-Database Ephemeral Session Storage
- Zero login or persistent server storage required. State is safely mirrored to `sessionStorage` to prevent accidental loss on page refreshes while ensuring complete patient privacy.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (Turbopack)** | React 19 App Router, server-rendered API route handlers |
| **Styling** | **Tailwind CSS v4** | Modern theme tokens, dark mode variants, fluid typography |
| **AI / LLM Engine** | **Groq Cloud API** (`openai/gpt-oss-120b`) | Sub-500ms JSON intent extraction, follow-up parsing, medical summary |
| **Speech-to-Text** | **Browser Web Speech API** | Client-side zero-latency speech recognition (English `en-US` & Hindi `hi-IN`) |
| **Text-to-Speech** | **Web Audio SpeechSynthesis** | Natural verbal reading of questions for elderly patients |
| **Icons & UI Assets** | **Lucide React** | Feather-weight SVG icons for trichology categories |
| **Type Safety** | **TypeScript 5** | Strict schema validation for all 19 intake questions |

---

## 📂 Project Structure

```
Hair-Clinic-App/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── parse-speech/route.ts      # Open-Mic multi-field extractor
│   │   │   ├── parse-followup/route.ts    # Single question intent classifier
│   │   │   └── summarize/route.ts         # Doctor trichology summary generator
│   │   ├── globals.css                    # Tailwind tokens & themes
│   │   ├── layout.tsx                     # Metadata and root shell
│   │   └── page.tsx                       # Main intake wizard & state machine
│   ├── components/
│   │   ├── Header.tsx                     # Top navigation, progress segments, theme/TTS toggles
│   │   ├── DoctorCard.tsx                 # Real-time trichology progress tracker
│   │   ├── StepRenderer.tsx               # Anatomical scalp diagram, steppers, select chips
│   │   ├── VoiceTextInput.tsx             # Resilient Web Speech dictation controller
│   │   ├── ReviewScreen.tsx               # Section A-E interactive summary checklist
│   │   └── SummaryScreen.tsx              # Final clinical report view
│   ├── config/
│   │   ├── questions.ts                   # Question metadata, categories, branching gates
│   │   └── translations.ts                # Bilingual English & Hindi dictionaries
│   └── hooks/
│       └── useFormAnswers.ts              # SessionStorage synchronization hook
├── scripts/
│   └── test-personas.ts                   # Automated clinical persona validation suite
├── package.json
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/JitinSaxenaa/Hair-Clinic-App.git
cd Hair-Clinic-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the project root:
```env
GROQ_API_KEY=your_groq_api_key_here
```
> *Get a free API key instantly at [console.groq.com](https://console.groq.com).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing & Clinical Validation

Run the built-in clinical persona simulation suite to verify sex gating, branch logic, and schema conformance:

```bash
npx tsx scripts/test-personas.ts
```

### Validated Personas:
1. **Male Patient:** Verifies Q6 (`menstrual_cycle`) and Q7 (`pregnancy_related`) are completely bypassed. Wizard total steps: 34.
2. **Female Patient (Regular, Not Pregnant):** Verifies all hormonal questions are presented and captured. Wizard total steps: 37.
3. **Female Patient (Currently Pregnant):** Verifies pregnancy-related gating. Wizard total steps: 36.
4. **Female Patient (Menopausal):** Verifies menopausal pathways and side effect detail triggers. Wizard total steps: 40.

---

## 🚢 Deployment to Vercel

The application is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub.
2. Import the repository into [Vercel Dashboard](https://vercel.com).
3. Add the `GROQ_API_KEY` environment variable under **Project Settings > Environment Variables**.
4. Click **Deploy**.

---

## 📄 License
MIT License © 2026 Hair Vitals Hair & Scalp Clinic.
