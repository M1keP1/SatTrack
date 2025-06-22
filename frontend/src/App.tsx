import { useRef, useState, useEffect } from "react";
import type { Viewer } from "cesium";

import Globe from "./components/Globe";
import Sidebar from "./components/LeftSideBar/LeftSideBar";
import { useSatelliteSearch } from "./hooks/useSatelliteSearch";
import { useClickOutside } from "./hooks/useClickOutside";
import type { SatellitePosition } from "./services/satelliteManager";
import { ModularInfoSidebar } from "./components/RightSideBar/modular-info-sidebar";

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

  useClickOutside(viewerRef, trackedId, setTrackedId);

  useEffect(() => {
    console.log("📍 Ground Station changed:", groundStation);
  }, [groundStation]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
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
        isGroundStationEnabled={isGroundStationEnabled} />
    </div>
  );
}

export default App;
