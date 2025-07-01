import { useRef, useState, useEffect } from "react";
import type { Viewer } from "cesium";
import SplashScreen from "./components/SplashScreen";
import Globe from "./components/Globe";
import Sidebar from "./components/LeftSideBar/LeftSideBar";
import { useSatelliteSearch } from "./hooks/useSatelliteSearch";
import { useClickOutside } from "./hooks/useClickOutside";
import type { SatellitePosition } from "./services/satelliteManager";
import { ModularInfoSidebar } from "./components/RightSideBar/modular-info-sidebar";
import { SkyglowPanel } from "@/components/RightSideBar/SkyglowPanel";
import { CloudPanel } from "@/components/RightSideBar/CloudPanel";
import CustomToaster from "./components/CustomToaster";
import SettingsPanel from "./components/RightSideBar/SettingsPanel";
import { useCinematicCamera } from "./hooks/useCinematicCamera";
import ContactPanel from "./components/RightSideBar/ContactPanel";
import IdeaPanel from "./components/RightSideBar/IdeaPanel";
import { usePanelCameraZoom } from "./hooks/usePanelCameraZoom";

function App() {
  const viewerRef = useRef<Viewer | null>(null);
  const [satellites, setSatellites] = useState<SatellitePosition[]>([]);
  const [trackedId, setTrackedId] = useState<string | null>(null);
  const [groundStation, setGroundStation] = useState<{
    lat: number;
    lon: number;
    name: string;
  } | null>(null); 
  const [currentTLE, setCurrentTLE] = useState<{ line1: string; line2: string } | null>(null);
  const isGroundStationEnabled = groundStation !== null;
  const handleSearch = useSatelliteSearch(viewerRef, satellites, setTrackedId, setCurrentTLE);
  const [showSkyglow, setShowSkyglow] = useState(false);
  const [showCloud, setShowCloud] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showIdea, setShowIdea] = useState(false);
  const { zoomIn, zoomOut, saveDefaultView } = usePanelCameraZoom(viewerRef);

  useCinematicCamera(viewerRef, showSplash);
  useClickOutside(viewerRef, trackedId, setTrackedId);

  useEffect(() => {
  const timeout = setTimeout(() => {
    setShowSplash(false);
    saveDefaultView();
  }, 3500); // or hook into Cesium readiness

  return () => clearTimeout(timeout);
}, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Splash Screen with fade out transition */}
      <div
        className={`absolute inset-0 z-[9999] transition-opacity duration-1000 ease-in-out ${
          showSplash ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <SplashScreen />
      </div>

      {/* Your actual app (always mounted) */}
      <Globe
        viewerRef={viewerRef}
        satellites={satellites}
        setSatellites={setSatellites}
        trackedId={trackedId}
        setTrackedId={setTrackedId}
        setCurrentTLE={setCurrentTLE}
      />

      <Sidebar
        onSearch={handleSearch}
        satelliteNames={satellites.map((s) => s.name)}
        viewerRef={viewerRef}
        ongroundStationChange={setGroundStation}
      />

      <ModularInfoSidebar
        selectedNoradId={trackedId}
        tle={currentTLE}
        groundStation={groundStation}
        isGroundStationEnabled={isGroundStationEnabled}
        onOpenSkyglow={() => setShowSkyglow(true)}
        onOpenCloud={() => setShowCloud(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenContact={() => setShowContact(true)}
        onOpenPromo={() => setShowIdea(true)}
      />

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
      {!showSplash && <CustomToaster />}
      <footer className="absolute bottom-0 w-full text-center text-xs text-white/40 font-mono pb-2 pointer-events-none z-[10]">
        <div className="mx-auto max-w-fit rounded-lg bg-black/20 backdrop-blur px-4 py-1 border border-teal-400/20 shadow-sm">
          © {new Date().getFullYear()} <span className="text-white">🛰️SatTrack™</span> · All rights reserved
        </div>
      </footer>

    </div>
      );
      
}

export default App;
