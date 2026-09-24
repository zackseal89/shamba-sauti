# 🌱 Shamba Sauti (Voice of the Farm)

**Shamba Sauti** is a voice-first, multilingual agricultural advisory assistant built for smallholder farmers in Kenya. It provides structured, safe, and actionable field guidance in both **Kiswahili** and **English**, grounded in authoritative agronomic research.

Powered by the [Mansa AI Platform](https://platform.mymansa.ai/docs).

---

## 🚀 One-Click Deploy to Vercel

Deploy your own instance of Shamba Sauti to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzackseal89%2Fshamba-sauti&env=MANSA_API_KEY,MANSA_API_BASE_URL,MANSA_PROVIDER&envDescription=Mansa%20API%20Configuration&envLink=https%3A%2F%2Fplatform.mymansa.ai%2Fdocs%2Fauthentication)

### Required Environment Variables on Vercel

| Variable | Description | Example |
| :--- | :--- | :--- |
| `MANSA_API_KEY` | Your live Mansa API key from [Mansa Console](https://platform.mymansa.ai) | `msk_live_...` |
| `MANSA_API_BASE_URL` | Mansa base API endpoint | `https://api.mymansa.ai` |
| `MANSA_PROVIDER` | Provider mode: set to `mansa` for live AI, or `mock` for safe local offline demos | `mansa` |

---

## ✨ Features & Mansa AI Capabilities

- **Multilingual Agronomic Chat ([`POST /v1/chat`](https://platform.mymansa.ai/docs/chat))**:
  - Delivers structured diagnoses: likely causes, field checks, immediate cultural/sanitation actions, cautions against chemical overuse, and escalation to agricultural extension officers.
  - Enabled with live **Web Search tools** to cross-reference real-time Kenyan agricultural advisories from KALRO, FAO, CABI, and the Ministry of Agriculture.
- **East African Voice Playback ([`POST /v1/audio/speech`](https://platform.mymansa.ai/docs/speech))**:
  - Speaks out guidance with natural pronunciation (`voice: "east_african_female"` for English and `voice: "female"` for Kiswahili).
  - Includes full audio playback controls (play, pause, stop, loading status) and browser fallback.
- **Instant Dual-Language Translation ([`POST /v1/translate`](https://platform.mymansa.ai/docs/translate))**:
  - One-click translation of agricultural answers between Kiswahili and English so farmers and extension officers can share advice across communities.
- **Voice-to-Text Transcription ([`POST /v1/transcribe`](https://platform.mymansa.ai/docs/transcribe))**:
  - Allows farmers out in the field to speak symptoms directly into the microphone.
  - Implements resilient RFC 7807 error handling with exponential backoff.
- **High-Contrast Outdoor UI**:
  - Crafted with Tailwind CSS and an earth-toned, high-contrast palette optimized for mobile devices in direct sunlight.

---

## 🛠️ Local Development

### 1. Clone & Install

```bash
git clone https://github.com/zackseal89/shamba-sauti.git
cd shamba-sauti
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set your `MANSA_API_KEY`:

```env
MANSA_API_KEY=your_mansa_api_key_here
MANSA_API_BASE_URL=https://api.mymansa.ai
MANSA_PROVIDER=mansa
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Validation

```bash
# Run unit and integration tests (Vitest)
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint

# Production bundle build
npm run build
```

---

## 📖 License

MIT
