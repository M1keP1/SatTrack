import type { Viewer } from "cesium";
import type { SatellitePosition } from "../services/satelliteManager";
import { geocodeAndFlyTo } from "../services/geocodeAndFlyTo";
import { getTLEByNorad } from "../services/tleService";
import toast from "react-hot-toast";

export function useSatelliteSearch(
  viewerRef: React.RefObject<Viewer | null>,
  satellites: SatellitePosition[],
  setTrackedId: (id: string | null) => void,
  setCurrentTLE: (tle: { line1: string; line2: string } | null) => void
) {
  return async function handleSearch(query: string) {
    if (!viewerRef.current) {
      toast.error("❌ Viewer not ready.");
      return;
    }

    
    const trimmed = query.trim();
    if (!trimmed) return;

    // ✅ If input starts with "/", treat as NORAD ID or exact match
    if (trimmed.startsWith("/")) {
      const idQuery = trimmed.slice(1).replace(/[Uu]$/, "").trim();

      const match = satellites.find(
        (s) => s.id === idQuery || s.name.toLowerCase() === idQuery.toLowerCase()
      );

      if (match && match.position) {
        setTrackedId(match.id);
        const tle = await getTLEByNorad(match.id);
        if (tle) {
          setCurrentTLE(tle);
          toast.success(`🛰️ Tracking ${match.name}`);
        } else {
          setCurrentTLE(null);
          toast.error("❌ No TLE found for this satellite.");
        }
        return;
      }

      toast.error("❌ No satellite with this NORAD ID or name.");
      return;
    }

    // ✅ Else, treat it as satellite name match
    const match = satellites.find(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (match && match.position) {
      setTrackedId(match.id);
      setCurrentTLE(match.tle || null);
      toast.success(`🛰️ Tracking ${match.name}`);
      return;
    }

    // 🌍 Fallback to geocode
    toast("📍 Using location search...");
    geocodeAndFlyTo(viewerRef.current, trimmed, 10);
  };
}
