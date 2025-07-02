import { useEffect, useRef } from "react";
import { parseTleText } from "../utils/tleParser";
import { getSatellitePositions } from "../services/satelliteManager";
import type { SatellitePosition } from "../services/satelliteManager";
import { getActiveTleFile } from "../services/activeCollection";
import type { TleEntry } from "../utils/tleParser";
import toast from "react-hot-toast";

// ════════════════════════════════════════════════════════════════════════
// 🛰️ useSatelliteTracker Hook
// Description:
//    - Fetches active TLE file (local or remote).
//    - Parses TLE data and updates satellite positions in real-time.
//    - Compares and notifies if new satellites are added/removed.
//    - Intended for live Cesium visualization in SatTrack app.
// Parameters:
//    - setSatellites: Callback to update tracked satellite positions.
// ════════════════════════════════════════════════════════════════════════

export function useSatelliteTracker(setSatellites: (sats: SatellitePosition[]) => void) {
  const trackedSatIdsRef = useRef<Set<string>>(new Set());
  const currentTlesRef = useRef<TleEntry[]>([]);
  const lastTleRawRef = useRef<string | null>(null);

  useEffect(() => {
    let fileCheckInterval: ReturnType<typeof setInterval>;
    let positionUpdateInterval: ReturnType<typeof setInterval>;

    const loadTleFile = async () => {
      try {
        const res = await fetch(getActiveTleFile(), { cache: "no-store" });
        const text = await res.text();

        if (text === lastTleRawRef.current) return;
        lastTleRawRef.current = text;

        const tles = parseTleText(text);
        currentTlesRef.current = tles;

        const newPositions = getSatellitePositions(tles);
        const newIds = new Set(newPositions.map((s) => s.id));

        const added = [...newIds].filter((id) => !trackedSatIdsRef.current.has(id));
        const removed = [...trackedSatIdsRef.current].filter((id) => !newIds.has(id));

        if (added.length || removed.length) {
          toast.success(`Updating Sats🔄 ${added.length} added, ${removed.length} removed`);
        }

        added.forEach((id) => trackedSatIdsRef.current.add(id));
        removed.forEach((id) => trackedSatIdsRef.current.delete(id));

        setSatellites(newPositions);
      } catch (err) {
        console.error("❌ Failed to fetch TLE:", err);
        toast.error("❌ Failed to load TLE file.");
      }
    };

    const updatePositions = () => {
      const tles = currentTlesRef.current;
      if (!tles.length) return;
      const updated = getSatellitePositions(tles);
      setSatellites(updated);
    };

    loadTleFile();
    updatePositions();
    fileCheckInterval = setInterval(loadTleFile, 1000);        // Check for new TLEs
    positionUpdateInterval = setInterval(updatePositions, 10); // Refresh satellite positions

    return () => {
      clearInterval(fileCheckInterval);
      clearInterval(positionUpdateInterval);
    };
  }, [setSatellites]);
}
