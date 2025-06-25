import type { Viewer } from "cesium";
import type { SatellitePosition } from "../services/satelliteManager";
import { geocodeAndFlyTo } from "../services/geocodeAndFlyTo";
import { getTLEByNorad } from "../services/tleService";

export function useSatelliteSearch(
  viewerRef: React.RefObject<Viewer | null>,
  satellites: SatellitePosition[],
  setTrackedId: (id: string | null) => void,
  setCurrentTLE: (tle: { line1: string; line2: string } | null) => void
) {
  return async function handleSearch(query: string) {
    if (!viewerRef.current) {
      console.warn("❌ Viewer not ready.");
      return;
    }

    const trimmed = query.trim();
    console.log("🔍 Search query received:", trimmed);

    // Satellite search with prefix "/"
    if (trimmed.startsWith("/")) {
      const satQuery = trimmed.slice(1).replace(/[Uu]$/, "").trim();
      console.log("🔎 Looking for satellite:", satQuery);

      const sat = satellites.find(
        (s) => s.name.toLowerCase() === satQuery.toLowerCase()
      );

      if (sat) {
        console.log("🎯 Match found:", sat.name, sat.id);
        if (sat.position) {
          setTrackedId(sat.id);
          const cleanId = sat.id.replace(/[Uu]$/, "");
          const tle = await getTLEByNorad(cleanId);
          if (tle) {
            setCurrentTLE(tle);
            console.log("🛰️ TLE set for:", sat.id);
          } else {
            console.warn("❌ No TLE found for:", sat.id);
            setCurrentTLE(null);
          }

        } else {
          console.warn("⚠️ Satellite found but no position available.");
        }
      } else {
        console.warn("❌ No satellite match found.");
        setCurrentTLE(null);
      }

      return;
    }

    // Geolocation fallback
    console.log("🌍 Attempting geocode for:", trimmed);
    geocodeAndFlyTo(viewerRef.current, trimmed, 10);
  };
}
