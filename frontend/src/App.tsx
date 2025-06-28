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
  const [showSplash, setShowSplash] = useState(true);
  useClickOutside(viewerRef, trackedId, setTrackedId);

  useEffect(() => {
  const timeout = setTimeout(() => {
    setShowSplash(false);
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
      />

      <SkyglowPanel isOpen={showSkyglow} onClose={() => setShowSkyglow(false)} />
      <CloudPanel isOpen={showCloud} onClose={() => setShowCloud(false)} groundStation={groundStation ?? undefined} />
      {!showSplash && <CustomToaster />}

    </div>
      );
      
}

export default App;
