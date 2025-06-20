import { useRef, useState } from "react";
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

  const handleSearch = useSatelliteSearch(viewerRef, satellites, setTrackedId);
  useClickOutside(viewerRef, trackedId, setTrackedId);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Globe
        viewerRef={viewerRef}
        satellites={satellites}
        setSatellites={setSatellites}
        trackedId={trackedId}
      />
      <Sidebar
        onSearch={handleSearch}
        satelliteNames={satellites.map((s) => s.name)}
        viewerRef={viewerRef}
      />
      <ModularInfoSidebar selectedSatellite={null} />
    </div>
  );
}

export default App;
