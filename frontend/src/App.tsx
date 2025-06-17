import { useEffect, useRef, useState } from "react";
import { IonGeocoderService, Cartesian3 } from "cesium";

import Globe from "./components/Globe";
import Sidebar from "./components/LeftSidebar/LeftSidebar";
import type { Viewer } from "cesium";
import type { SatellitePosition } from "./services/satelliteManager";

function App() {
  const viewerRef = useRef<Viewer | null>(null);
  const [satellites, setSatellites] = useState<SatellitePosition[]>([]);
  const [trackedId, setTrackedId] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!viewerRef.current) {
      console.warn("❌ Viewer not ready.");
      return;
    }

    const trimmed = query.trim();
    console.log("🔍 Search query received:", trimmed);

    // Satellite search using "/"
    if (trimmed.startsWith("/")) {
      const satQuery = trimmed.slice(1).trim();
      console.log("🔎 Looking for satellite:", satQuery);

      const sat = satellites.find(
        (s) => s.name.toLowerCase() === satQuery.toLowerCase()
      );

      if (sat) {
        console.log("🎯 Match found:", sat.name, sat.id);
        if (sat.position) {
          setTrackedId(sat.id);
          console.log("✅ Tracking mode set for:", sat.id);
        } else {
          console.warn("⚠️ Satellite found but no position available.");
        }
      } else {
        console.warn("❌ No satellite match found.");
      }

      return;
    }

    // Fallback to geocoding
    console.log("🌍 Attempting geocode for:", trimmed);
    const geocoderService = new IonGeocoderService({ scene: viewerRef.current.scene });
    const results = await geocoderService.geocode(trimmed);

    if (results.length > 0) {
      console.log("📍 Geocode result:", results[0].displayName);
      viewerRef.current.camera.flyTo({
        destination: results[0].destination,
        duration: 3,
      });
      setTrackedId(null); // Exit follow mode
    } else {
      console.warn("❌ No geocode results found.");
    }
  };

  const resetCameraView = () => {
    if (!viewerRef.current) return;

    viewerRef.current.camera.flyTo({
      destination: Cartesian3.fromDegrees(0, 0, 20000000),
      duration: 2,
    });
    console.log("🔄 Resetting camera to default view.");
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Ignore clicks inside the sidebar or search results
      if (
        target.closest(".sidebar-container") ||
        target.closest(".suggestions-list") || // ✅ prevent false positive
        target.closest(".search-input")         // ✅ prevent false positive
      ) return;

      if (trackedId) {
        console.log("👆 Clicked outside, exiting follow mode.");
        setTrackedId(null);
        resetCameraView();
      }
    };

    // ✅ Add slight delay to let other events (like suggestion click) finish
    setTimeout(() => {
      window.addEventListener("click", handleClick);
    }, 100);

    return () => window.removeEventListener("click", handleClick);
  }, [trackedId]);


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
      />
    </div>
  );
}

export default App;
