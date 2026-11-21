# AirAstra: Winter Smog Defense & Community Clean Air OS

> PromptWars [Challenge 6] Urban Air Quality Assistant  
> Built with Next.js, React, TypeScript, Three.js, GLSL Shaders, Framer Motion, and GSAP.

---

## 🌟 Overview

**AirAstra** is an advanced GenAI-powered atmospheric health assistant built to help families and urban communities navigate severe winter smog and cold-temperature inversions. It suggests low-emission daily routines, indoor air quality hacks, and sustainable alternatives tailored to location and lifestyle while explaining the direct cause-and-effect impact of every choice.

---

## 🚀 Key Features

1. **Modern Minimalist Visual Design**:
   - Near-black warm aesthetic with custom atmospheric hexagon glow backdrop.
   - Distinctive typography with **Plus Jakarta Sans**, clear headline hierarchy, asymmetric action buttons, and hairline borders with zero drop shadows.
2. **Atmospheric Physics Simulation**:
   - Real-time Three.js & GLSL inversion layer shader simulating thermal smog trapping.
   - 24-hour inversion curve modeling surface cooling, morning smog peak, and mid-day solar lift.
3. **GenAI Intelligence**:
   - **Routine Architect**: Tailored low-emission schedules aligned to safe ventilation windows.
   - **Indoor Hacks Lab & 3D CAD Simulator**: Interactive Corsi-Rosenthal DIY box filter CAD viewer with CADR room volume sizing.
   - **AirSnap Vision Scanner**: Multimodal room draft and window infiltration diagnostic assistant.
   - **Astra Voice Companion**: Speech-to-text and synthesized speech respiratory safety companion.
4. **Community Defense Pods**:
   - GSAP animated metrics, localized neighborhood filter sharing, and clean route planning.

---

## 🔒 Security Best Practices

- **Zero Leaked Secrets**: All secret tokens, local `.env` files, and credentials are listed in `.gitignore` and never committed.
- **Client-Side Key Option**: Users can optionally supply their own Google Gemini API key via the UI modal, which is stored in `localStorage` client-side only.
- **Fail-Safe Fallback**: If no Gemini API key is configured, AirAstra falls back to intelligent deterministic engines without failing or exposing errors.
- **HTTP Security Headers**: Configured in both `next.config.ts` and `netlify.toml`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(self), microphone=(self)`

---

## 🌐 Deploy to Netlify

### One-Click or Git-Connected Deployment

1. Fork or import this repository on [Netlify](https://app.netlify.com/).
2. Netlify will automatically detect the configuration from `netlify.toml`:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
3. Under **Site Configuration > Environment Variables**, optionally set:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Click **Deploy**.

---

## 💻 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/DEVAL-020/AirAstra.git
cd AirAstra

# 2. Install dependencies
npm install

# 3. Copy environment configuration
cp .env.example .env.local

# 4. Start local development server
npm run dev

# 5. Open browser
http://localhost:3000
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router)
- **Language**: TypeScript, JavaScript
- **Styling**: Tailwind CSS v4, Custom Design System
- **Typography**: Plus Jakarta Sans
- **Graphics & Motion**: Three.js, GLSL Shaders, Framer Motion, GSAP
- **AI**: Google Generative AI (Gemini 1.5 Flash) with local deterministic fallbacks
- **Icons**: Lucide React
