import { useEffect, useState, useRef } from "react";
import { Entity } from "resium";
import { Color, Cartesian2 } from "cesium";
import toast from "react-hot-toast";

import { parseTleText } from "../utils/tleParser";
import type { TleEntry } from "../utils/tleParser";

import { getSatellitePositions } from "../services/satelliteManager";
import type { SatellitePosition } from "../services/satelliteManager";

export default function SatelliteEntities() {
  const [satellites, setSatellites] = useState<SatellitePosition[]>([]);
  const trackedSatIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let fileCheckInterval: ReturnType<typeof setInterval>;
    let positionUpdateInterval: ReturnType<typeof setInterval>;
    let lastTleRaw: string | null = null;
    let currentTles: TleEntry[] = [];

    const trackedSatIds = trackedSatIdsRef.current;

    const loadTleFile = async () => {
      try {
        const res = await fetch("/data/active_tles.txt", { cache: "no-store" });
        const text = await res.text();

        if (text === lastTleRaw) return; // No change
        lastTleRaw = text;

        currentTles = parseTleText(text);
        console.log(`📂 TLE file updated — loaded ${currentTles.length} entries`);
        

        const newPositions = getSatellitePositions(currentTles);
        const newIds = new Set(newPositions.map((s) => s.id));

        const added = [...newIds].filter((id) => !trackedSatIds.has(id));
        const removed = [...trackedSatIds].filter((id) => !newIds.has(id));

        if (added.length || removed.length) {
          toast.success(`🔄 ${added.length} added, ${removed.length} removed`);
        }

        added.forEach((id) => {
          const sat = newPositions.find((s) => s.id === id);
          console.log(`🛰️ Tracking satellite: ${sat?.name} [${id}]`);
          toast.success(`🛰️ Tracking: ${sat?.name}`);
          trackedSatIds.add(id);
        });

        removed.forEach((id) => {
          
          console.log(`❌ Lost satellite: ${id}`);
          toast.error(`❌ Lost tracking of some satellite`);
          trackedSatIds.delete(id);
        });

        // Also immediately update positions
        setSatellites(newPositions);
      } catch (err) {
        console.error("❌ Failed to fetch TLE file:", err);
        toast.error("❌ Failed to load TLE data.");
      }
    };

    const updatePositions = () => {
      if (!currentTles.length) return;
      const updated = getSatellitePositions(currentTles);
      setSatellites(updated);
    };

    // Initial run
    loadTleFile();
    updatePositions();

    // Set intervals
    fileCheckInterval = setInterval(loadTleFile, 10000); // every 10s
    positionUpdateInterval = setInterval(updatePositions, 1000); // every 1s

    return () => {
      clearInterval(fileCheckInterval);
      clearInterval(positionUpdateInterval);
    };
  }, []);

  return (
    <>
      {satellites.map((sat) =>
        sat.position ? (
          <Entity
            key={sat.id}
            name={sat.name}
            position={sat.position}
            point={{ pixelSize: 10, color: Color.WHITE }}
            label={{
              text: sat.name,
              font: "12pt sans-serif",
              fillColor: Color.CYAN,
              showBackground: true,
              pixelOffset: new Cartesian2(10, -20),
            }}
            description={`<p>${sat.name}</p>`}
          />
        ) : null
      )}
    </>
  );
}
