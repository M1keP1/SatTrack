# 🛰️ SatTrack – Real-Time Satellite Tracking & Management

**Version**: 1.0

---

## 🌍 Overview

SatTrack is a web‑based dashboard for live satellite tracking. It uses the Cesium viewer and React to render orbits in 3D with real‑time telemetry based on Two‑Line Element (TLE) data. The interface features a left sidebar for search and collections, a right sidebar showing detailed information, and panels for clouds, skyglow, and settings.

---

## ⚙️ Installation

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start a development server:

```bash
npm run dev
```

The app will be served on [http://localhost:5173](http://localhost:5173) by default.

---

## 📦 Building for Production

To generate a production build:

```bash
npm run build
```

The compiled files appear in `frontend/dist`.

---

## 🚀 Key Features

* **Live Satellite Positions** – Calculates positions from TLE data every second with `satellite.js`
* **Satellite Search and Tracking** – Search by name or NORAD ID, then center the camera on the selected satellite
* **Ground Station View** – Enter or geolocate a ground station to compute azimuth, elevation, range, and next pass
* **Orbit Visualization** – Toggle satellite trails and follow satellites with cinematic camera movements
* **Collections** – Load different TLE collections (e.g., Amateur Radio, Earth Observation) from `public/data/collections`
* **Cloud and Skyglow Panels** – Overlay cloud radar and light‑pollution data for your ground station
* **Responsive UI** – Tailwind-based “glassmorphism” UI with animation effects
* **SEO and Analytics** – Meta tags, structured data, and GoatCounter analytics

---

## 🧾 Development History

| Feature                  | Description                                | Commit                          |
| ------------------------ | ------------------------------------------ | ------------------------------- |
| Initial Project Setup    | Base React + TypeScript scaffold with Vite | `44e52f1`                       |
| Cesium Globe Integration | Basic viewer, default UI disabled          | `d4d44d9`                       |
| Satellite Tracker        | Parsed TLEs, real-time updates             | `78998c6`                       |
| Toast Notifications      | Added `react-hot-toast`                    | `6b2401d`                       |
| Search Functionality     | Left sidebar with fuzzy search             | `43ce21a`                       |
| Collections + Hooks      | Panel UI and hook refactor                 | `4f3ae47`, `cfdf20c`            |
| Tailwind Migration       | UI fixes with TailwindCSS                  | `9869ec1`                       |
| Ground Station Panel     | UI with geolocation + fly-to               | `634d55c`                       |
| Real‑Time Info Panel     | Right sidebar for satellite state          | `9e9a749`                       |
| Pass Prediction          | `usePassPrediction`, ground track          | `2cf354d`                       |
| UI Enhancements          | Splash screen, hover effects, toasts       | `aec61d9`, `cede4f6`, `7f71fb4` |
| Skybox & Atmosphere      | Custom deep-space skybox + disabled fog    | `df3f0f8`                       |
| Cloud Radar + Panels     | Slide-out overlays for skyglow/clouds      | `fa51a37`                       |
| Final Polish             | SEO, metadata, contact form                | `1561f35`, `a19a46a`            |
| Fixes                    | Final tweaks before release                | `1818487`, `7d1b238`, `6f75162` |

Development spanned from mid‑June to early July 2025, with 30+ meaningful commits.

---

## 🧱 Roadblocks Encountered

* **Tailwind Setup** – Custom configuration and legacy CSS conflicts resolved manually \[`9869ec1`]
* **Ground Station Geocoding** – Handling Cesium’s geocode return types was non-trivial \[`c3f69bb`]
* **Real-Time Updates** – Preventing UI stutters while polling TLEs \[`78998c6`, `6b2401d`]
* **Orbital Accuracy** – Satellite.js validation and accurate propagation logic \[`9e9a749`]
* **UI Consistency** – Ensuring aesthetic + responsive layout over multiple passes \[`df3f0f8`, `7f71fb4`]

---

## 📂 File & Directory Blueprint

### 📁 Root

```
SatTrack/
├── README.md         # Full project documentation
└── frontend/         # Main app code
```

### 📁 Frontend Directory

```
frontend/
├── components.json   # Tailwind paths + UI library config
├── index.html        # App entry HTML with metadata and analytics
├── package.json      # Scripts and dependencies
├── tailwind.config.js# Tailwind theme and plugin setup
├── public/           # Static assets (TLE files, skybox)
└── src/              # App source code
```

### 📁 Public Folder

```
frontend/public/
├── Credits.md        # Credits and feature roadmap
├── RoadMap.txt       # Markdown-style planning notes
├── data/             # TLE files, active_tles.txt and collections/
│   └── collections/  # index.json + .txt files per group
└── skybox/           # PNGs for space background
```

### 📁 Src Folder

```
frontend/src/
├── assets/               # Static bundled assets (e.g., SVGs)
├── components/           # UI components
│   ├── Globe.tsx         # Cesium viewer setup
│   ├── LeftSideBar/      # Search, Collections, Ground Station
│   ├── RightSideBar/     # Settings, Skyglow, Clouds, Info panels
│   └── ui/               # Generic buttons, inputs, layout
├── hooks/                # Custom logic
│   ├── useSatelliteTracker.ts
│   ├── usePassPrediction.ts
│   ├── useTLELoader.ts
│   └── useCinematicCamera.ts
├── lib/                  # Small helper utilities (e.g., merge classes)
├── services/             # External logic (TLE fetch, geo, etc.)
├── utils/                # Orbital math (e.g., computeGroundTrack)
├── App.tsx               # App orchestration (globe + panels)
└── main.tsx              # Entry point
```

---

## 👥 Group Members & Contributions

The SatTrack project was developed collaboratively by the following team members as part of a course project. Each member contributed to different components of the app to ensure both technical and user experience goals were met:

| Name           | Student ID | Contributions                                                                                                                                                                                            |
| -------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mihir K. Patel | 1123669    | Lead Developer: Core architecture, Cesium globe integration, real-time TLE tracker, orbit propagation, right sidebar logic, splash screen, cloud radar overlay, custom hooks, and deployment integration |
| Shrey Sethi    | 1123132    | Ground Station UI layout and design, sidebar animations, collection switching UX, and settings panel styling                                                                                             |
| Manish Banjade | 1123983    | Slide-out panel transitions, skyglow overlay UI, Compatibility testing                                                                                            |
| Bashir Iqbal   | 1125790    | Satellite hover effect enhancements, utility hook refactoring, search bar interaction QA, and accessibility refinements                                                                                  |
| Hoai Anh Phan  | 1123315    | Info panel UI card layout, contact panel polish, iconography consistency, and final build metadata review                                                                                                |

---

## 🧠 AI Assistant (Upcoming Feature)

We plan to introduce an AI Assistant module into the right sidebar panel, which will enable:

* Natural language queries about selected satellites
* On-demand mission summaries and metadata
* Integration with satellite operator databases

The backend and UI hooks for this are already scaffolded, and development will continue post-submission. Additional future ideas include:

* Stellarium overlay integration
* Satellite collections from user prompts
* Embeddable mission widgets for external sites

---

## 📬 Submission Note

This README and documentation set reflects the full-stack effort behind SatTrack, a feature-rich and visually polished web application for satellite tracking. It captures architectural, UI/UX, and technical contributions in a modular and transparent manner. It demonstrates solid use of Cesium, React, and custom logic via hooks.

---

## 🚫 License

This is a **private project**. Redistribution or reuse of the source code in any form is **not permitted**.

All rights reserved © 2025 by the SatTrack development team. Please contact the maintainer for collaboration or licensing inquiries.
