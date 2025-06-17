// src/hooks/useSatelliteSearch.ts
import { IonGeocoderService } from "cesium";
import type { Viewer } from "cesium";
import type { SatellitePosition } from "../services/satelliteManager";

export function useSatelliteSearch(
  viewerRef: React.RefObject<Viewer | null>,
  satellites: SatellitePosition[],
  setTrackedId: (id: string | null) => void
) {
  return async function handleSearch(query: string) {
    if (!viewerRef.current) {
      console.warn("❌ Viewer not ready.");
      return;
    }

    const trimmed = query.trim();
    console.log("🔍 Search query received:", trimmed);

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

    console.log("🌍 Attempting geocode for:", trimmed);
    const geocoderService = new IonGeocoderService({ scene: viewerRef.current.scene });
    const results = await geocoderService.geocode(trimmed);

    if (results.length > 0) {
      console.log("📍 Geocode result:", results[0].displayName);
      viewerRef.current.trackedEntity = undefined;
      setTrackedId(null);

      viewerRef.current.camera.flyTo({
        destination: results[0].destination,
        duration: 6,
      });
      
    } else {
      console.warn("❌ No geocode results found.");
    }
  };
}
