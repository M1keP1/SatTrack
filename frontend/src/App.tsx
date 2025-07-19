// ════════════════════════════════════════════════════════════════════════
// 📁 App.tsx – Main Application Entry Point
// 🛰️ SatTrack: AI-Enhanced Satellite Tracking Platform
// 📌 This file was submitted solely for academic evaluation as part of a university course.
// ❗ It is not intended for commercial or production use.
// ════════════════════════════════════════════════════════════════════════

import { useRef, useState, useEffect } from "react";
import type { Viewer } from "cesium";

// ════════════🌌 COMPONENTS ════════════
import SplashScreen from "./components/SplashScreen";
import Globe from "./components/Globe";
import Sidebar from "./components/LeftSideBar/LeftSideBar";
import { ModularInfoSidebar } from "./components/RightSideBar/modular-info-sidebar";
import { SkyglowPanel } from "@/components/RightSideBar/SkyglowPanel";
import { CloudPanel } from "@/components/RightSideBar/CloudPanel";
import SettingsPanel from "./components/RightSideBar/SettingsPanel";
import ContactPanel from "./components/RightSideBar/ContactPanel";
import IdeaPanel from "./components/RightSideBar/IdeaPanel";
import CustomToaster from "./components/CustomToaster";

// ════════════🔧 HOOKS ════════════
import { useSatelliteSearch } from "./hooks/useSatelliteSearch";
import { useClickOutside } from "./hooks/useClickOutside";
import { useCinematicCamera } from "./hooks/useCinematicCamera";
import { usePanelCameraZoom } from "./hooks/usePanelCameraZoom";

// ════════════📡 TYPES ════════════
import type { SatellitePosition } from "./services/satelliteManager";

// ════════════════════════════════════════════════════════════════════════
// 🧠 Main App Component
// ════════════════════════════════════════════════════════════════════════

function App() {
  // ─── Refs and State ──────────────────────────────
  const viewerRef = useRef<Viewer | null>(null);
  const [satellites, setSatellites] = useState<SatellitePosition[]>([]);
  const [trackedId, setTrackedId] = useState<string | null>(null);
  const [currentTLE, setCurrentTLE] = useState<{ line1: string; line2: string } | null>(null);
  const [groundStation, setGroundStation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const isGroundStationEnabled = groundStation !== null;
  const [isTooSmall, setIsTooSmall] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  

  // ─── Panels & UI Toggles ─────────────────────────
  const [showSkyglow, setShowSkyglow] = useState(false);
  const [showCloud, setShowCloud] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showIdea, setShowIdea] = useState(false);


  // ─── Camera Zoom & Cinematics ────────────────────
  const { zoomIn, zoomOut, saveDefaultView } = usePanelCameraZoom(viewerRef);
  useCinematicCamera(viewerRef, showSplash);
  useClickOutside(viewerRef, trackedId, setTrackedId);

  // ─── Satellite Search ─────────────────────────────
  const handleSearch = useSatelliteSearch(viewerRef, satellites, setTrackedId, setCurrentTLE);

  // ─── Splash Logic ────────────────────────────────
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplash(false);
      saveDefaultView();
    }, 3500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const checkSize = () => {
      const minWidth = 600;
      const minHeight = 920;
      const collapseWidth = 1000;

      setIsTooSmall(window.innerWidth < minWidth || window.innerHeight < minHeight);

      // collapse sidebar below 800px
      if (window.innerWidth < collapseWidth) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  
  if (isTooSmall) {
  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center text-center p-6 z-[99999]">
      <div className="animate-pulse text-3xl font-mono mb-4">🛰️ SatTrack</div>
      <p className="text-white/80 text-sm max-w-md">
        ⚠️ SatTrack requires a minimum screen size of <strong>600x930</strong>. <br />
        Please use a larger screen or resize your browser to continue.
      </p>
    </div>
  );
}

  // ══════════════════════════════════════════════════
  // 🌐 Render UI
  // ══════════════════════════════════════════════════
  
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* ─── Splash Screen ───────────────────────── */}
      <div
        className={`absolute inset-0 z-[9999] transition-opacity duration-1000 ease-in-out ${
          showSplash ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <SplashScreen />
      </div>

      {/* ─── Cesium Globe ────────────────────────── */}
      <Globe
        viewerRef={viewerRef}
        satellites={satellites}
        setSatellites={setSatellites}
        trackedId={trackedId}
        setTrackedId={setTrackedId}
        setCurrentTLE={setCurrentTLE}
      />

      {/* ─── Left Sidebar ────────────────────────── */}
      <Sidebar
        onSearch={handleSearch}
        satelliteNames={satellites.map((s) => s.name)}
        viewerRef={viewerRef}
        ongroundStationChange={setGroundStation}
        collapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />

      {/* ─── Right Info Sidebar ───────────────────── */}
      <ModularInfoSidebar
        selectedNoradId={trackedId}
        tle={currentTLE}
        groundStation={groundStation}
        isGroundStationEnabled={isGroundStationEnabled}
        onOpenSkyglow={() => setShowSkyglow(true)}
        onOpenCloud={() => setShowCloud(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenContact={() => {
          setShowIdea(false);
          setShowContact(true);
        }}
        onOpenPromo={() => {
          setShowContact(false);
          setShowIdea(true);
        }}
      />

      {/* ─── Panels (Conditional Rendering) ───────── */}
      <SkyglowPanel isOpen={showSkyglow} onClose={() => setShowSkyglow(false)} />
      <CloudPanel isOpen={showCloud} onClose={() => setShowCloud(false)} groundStation={groundStation ?? undefined} />
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {showContact && (
        <ContactPanel
          onClose={() => {
            setShowContact(false);
            zoomIn();
          }}
          onOpenEffect={zoomOut}
        />
      )}

      {showIdea && (
        <IdeaPanel
          onClose={() => {
            setShowIdea(false);
            zoomIn();
          }}
          onOpenContact={() => {
            setShowIdea(false);
            setShowContact(true);
            zoomOut();
          }}
          onOpenEffect={zoomOut}
        />
      )}

      {/* ─── Toast Notifications ──────────────────── */}
      {!showSplash && <CustomToaster />}

      {/* ─── Footer (Branding) ───────────────────── */}
      <footer className="absolute bottom-0 w-full text-center text-xs text-white/40 font-mono pb-2 pointer-events-none z-[10]">
        <div className="mx-auto max-w-fit rounded-lg bg-black/20 backdrop-blur px-4 py-1 border border-teal-400/20 shadow-sm">
          © {new Date().getFullYear()} <span className="text-white">🛰️SatTrack™</span> · All rights reserved
        </div>
      </footer>
    </div>
  );
}

export default App;
