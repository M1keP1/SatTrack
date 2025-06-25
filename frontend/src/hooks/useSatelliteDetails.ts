import { useEffect, useState } from "react";
import { getTLEByNorad } from "@/services/tleService";
import { computeOrbitalState } from "@/utils/propagationUtils";
import { getOperator, getSatelliteType } from "@/utils/satelliteMetadata";

export interface SatelliteInfo {
  noradId: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  operator: string;
  satelliteType: string;
}

export function useSatelliteDetails(noradId: string | null) {
  const [tle, setTLE] = useState<{ name: string; line1: string; line2: string } | null>(null);
  const [data, setData] = useState<SatelliteInfo | null>(null);

  // Fetch TLE once when noradId changes
  useEffect(() => {
    if (!noradId) return;
    const cleanId = noradId.replace(/[^\d]/g, "");

    console.log("🛰️ Fetching TLE for", cleanId);
    setTLE(null);
    setData(null);

    getTLEByNorad(cleanId).then((tleData) => {
      if (!tleData) {
        console.warn("❌ No TLE found for", cleanId);
        return;
      }
      setTLE(tleData);
    });
  }, [noradId]);

  // Recompute position every 10 seconds using the cached TLE
  useEffect(() => {
    if (!tle || !noradId) return;

    const cleanId = noradId.replace(/[^\d]/g, "");

    const compute = () => {
      const orbit = computeOrbitalState(tle);
      if (!orbit) {
        console.warn("❌ Orbit computation failed for", cleanId);
        return;
      }

      const satelliteInfo: SatelliteInfo = {
        noradId: cleanId,
        name: tle.name,
        ...orbit,
        operator: getOperator(cleanId),
        satelliteType: getSatelliteType(cleanId),
      };

      console.log("✅ Computed satellite state:", satelliteInfo);
      setData(satelliteInfo);
    };

    compute(); // Run once immediately
    const interval = setInterval(compute, 1000); // Poll every 10s

    return () => clearInterval(interval);
  }, [tle, noradId]);

  return data;
}
