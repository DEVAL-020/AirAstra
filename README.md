# 🌬️ AirAstra: Winter Smog Defense & Community Clean Air OS

> **PromptWars [Challenge 6] Urban Air Quality Assistant**  
> *A GenAI-powered atmospheric health operating system engineered to help families and communities navigate severe winter temperature inversions, toxic PM2.5 spikes, and urban air pollution with actionable low-emission routines, frugal DIY indoor filtration hacks, and quantified impact metrics.*

---

## 🌟 Executive Overview & The Problem

During severe winter months, cities across northern India, the Salt Lake basin, Central Europe, and East Asia experience extreme **radiation and subsidence temperature inversions**. A cold layer of stagnant surface air becomes trapped beneath a cap of warm air, acting like a lid that traps vehicular exhaust, agricultural stubble burning fallout, and domestic heating emissions within 50–200 meters of the ground. 

Most air quality apps merely show a passive red dial saying *"Air Quality Hazardous (AQI 350+)"*, leaving families feeling helpless, anxious, and unequipped. 

**AirAstra transforms anxiety into agency.** Designed with the sensibility of experienced environmental systems engineers, atmospheric scientists, and human-centered designers, AirAstra gives families practical, low-cost, high-leverage tools to protect their respiratory health while slashing community emissions.

---

## 🚀 Key Features

### 1. 🌐 Live Atmospheric Inversion Radar & 3D GLSL Shader
- **Real-Time Meteorology Integration**: Connects directly to Open-Meteo's atmospheric boundary layer and air quality API (tracking real PM2.5, PM10, $NO_2$, $SO_2$, $O_3$, $CO$, temperature, wind stagnation, and US EPA AQI breakpoints).
- **Custom Three.js + GLSL Atmospheric Shader**: Simulates Brownian motion of aerosols and the physical temperature inversion boundary lid in WebGL, shifting dynamically from clean mint emeralds to toxic ochre and carbon soot crimson based on real-time AQI.
- **24-Hour Diurnal Forecast Scrubber**: Helps families visually anticipate early morning (06:00–09:00) and late evening (20:00–23:00) inversion trapping peaks, highlighting the exact **Midday Solar Thermal Lift Window** (13:00–15:30) for safe home flush ventilation.

### 2. 🌀 Interactive 3D Corsi-Rosenthal Purifier CAD Simulator
- **Interactive 3D WebGL Model (Three.js + GLSL)**: Full 3D assembly of a $25 DIY Corsi-Rosenthal box fan purifier.
- **Real-Time Particle Fluid Mechanics**: Dirty ambient particles (ochre/brown) are drawn into the 4 MERV-13 filter planes from all four lateral sides, purified, and vortexed upward into the room as clean cyan oxygen particles.
- **Controls**: Interactive Fan RPM speed regulator, dynamic CADR ($CFM$) calculation, and an **Exploded CAD View** toggle that disassembles the unit so any homeowner can understand how to build it.

### 3. 🗓️ GenAI Daily Routine Architect
- **Context-Aware Scheduling**: Dynamically architects an hour-by-hour winter routine based on household composition (families with toddlers, asthmatic children, elderly relatives, daily motorbike commuters).
- **Behavioral Contrast & Quantified Direct Impact**:
  - Compares the high-risk standard habit (e.g. cold-start car idling, morning outdoor cardio) against the low-emission alternative.
  - Explains the atmospheric physics behind the choice.
  - Quantifies direct personal savings: grams of avoided $CO_2$ and micrograms of PM2.5 spared from pulmonary alveoli.
- **Interactive Checklists & Confetti Celebrations**: Reinforces daily habit compliance with sound effects and milestones.

### 4. 🔬 Indoor Air Quality Hacks & DIY Lab
- **Harvard ACH Sizing CAD Calculator**: Input room length, width, and ceiling height to compute cubic volume, target Air Changes per Hour ($ACH \ge 5$), and required Clean Air Delivery Rate (CADR in CFM).
- **Frugal Engineering Blueprints**:
  - The Corsi-Rosenthal Box ($28 DIY vs $350 Commercial HEPA).
  - Radiator-Assisted Wet Microfiber Evaporative Aerosol Trap (precipitating electrostatically suspended PM2.5 in dry winter air).
  - NASA 4-Tier Clean Air Botanical Sanctuary (Sansevieria CAM night oxygenation, Areca Palm transpiration, Golden Pothos VOC capture).
  - Kitchen $NO_2$ Isolation & Negative Pressure Thermal Chimney Defense.

### 5. 📸 AirSnap Multimodal Vision Diagnostic AI
- Powered by **Google Gemini 1.5 Flash Multimodal Vision**: Allows users to upload a photo of their window frame, heating radiator, or room layout.
- Evaluates **Indoor Smog Defense Rating (0–100)**, identifies micro-draft infiltration gaps, flags dangerous purifier corner placements, and generates tailored physical remedies.

### 6. 🎙️ Astra: Voice & Conversational Respiratory Assistant
- **Speech-to-Text (STT) & Text-to-Speech (TTS)**: Built-in natural conversational interface powered by Web Speech API.
- Instant respiratory first-aid advice (saline nasal irrigation, steam inhalation, mucociliary hydration, pediatric stridor triage).
- Mask science explainer (why cloth/surgical masks fail vs electrostatic melt-blown N95/FFP2).

### 7. 🤝 BreatheTogether: Community Clean-Air Pods
- **Collective Impact Tracker**: High-precision **GSAP** numeric roll-up counters tracking thousands of kilograms of $CO_2$ and grams of PM2.5 saved by local neighborhood pods.
- **Neighborhood Pod Coordination**: School bus EV carpools, indoor community gym walking clubs, and bulk MERV-13 filter buying co-ops.
- **Community Air Warden Incident Dispatch**: Rapid citizen reporting of illegal trash burning, diesel generator idling, and uncovered construction dust plumes.

### 8. 🚨 Level 4 Emergency Smog Lockdown & Printable Dossier
- Automatic trigger when AQI exceeds 250–300.
- Step-by-step room consolidation and perimeter sealing protocol.
- One-click print-ready **Family Smog Action Plan** formatted for refrigerator mounting.

---

## 🛠️ Required Tech Stack Implementation

| Technology | Highlighted in Screenshot | AirAstra Implementation |
|---|---|---|
| **TypeScript** | ✅ Red Highlighted | Strict typed codebase across components, API clients, and atmospheric models (`src/types/index.ts`) |
| **JavaScript** | ✅ Red Highlighted | ESNext, Web Audio API synthesis, Web Speech API integration |
| **HTML5** | ✅ Red Highlighted | Semantic markup, Canvas WebGL viewports, accessible inputs |
| **CSS3** | ✅ Red Highlighted | Custom glassmorphism, glowing hazard tokens, responsive layout |
| **React** | ✅ Red Highlighted | React 19 functional components, hooks, state machines |
| **Next.js** | ✅ Red Highlighted | Next.js 16 App Router, Turbopack, static prerendering, server actions |
| **Node.js** | ✅ Red Highlighted | Runtime environment (v26.12.1) |
| **Three.js** | ✅ Red Highlighted | 3D WebGL scenes for Inversion Layer and Corsi-Rosenthal CAD simulator |
| **GLSL** | ✅ Red Highlighted | Custom atmospheric aerosol vertex & fragment shaders (`SmogShaderCanvas.tsx`) |
| **Framer Motion** | ✅ Red Highlighted | Smooth accordion springs, tab transitions, modal entrances |
| **GSAP** | ✅ Red Highlighted | Numeric roll-up tickers for AQI, PM2.5, and collective impact metrics |
| **Tailwind CSS** | Included | Modern utility styling, obsidian dark theme |
| **Google GenAI** | Core Requirement | Gemini 1.5 Flash Multimodal Vision & Reasoning with calibrated fallback |

---

## 🏁 Quickstart Guide

### 1. Prerequisites
- Node.js `18+` or `20+` (Tested on Node `v26.12.1`)
- npm `9+`

### 2. Installation
```bash
npm install --legacy-peer-deps
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start -p 3000
```

---

## 🌍 Supported Urban Hotspots & Live Cities
- **New Delhi, India** (Thermal inversion, crop burning fallout, vehicular stagnation)
- **Lahore, Pakistan** (Boundary layer collapse, brick kiln emissions)
- **Salt Lake City, USA** (Topographical valley basin cold-air lake)
- **Beijing, China** (Winter district coal surge, northern mountain blocks)
- **Krakow, Poland** (Vistula river valley domestic solid fuel trapping)
- **Mumbai, India** (Coastal humidity particulate suspension)
- **London, UK** (Urban canyon diesel exhaust stagnation)
- **Any Custom Location**: 1-click browser GPS auto-detection with live Open-Meteo meteorological API.

---

## 🛡️ License & Acknowledgments
Built with ❤️ for **PromptWars [Challenge 6]**.  
Dedicated to children, elderly seniors, and urban communities striving for clean air.
