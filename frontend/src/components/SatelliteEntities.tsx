import { useEffect, useState, useRef } from "react";
import { Entity } from "resium";
import { Color, Cartesian2 } from "cesium";

import { parseTleText } from "../utils/tleParser";
import type { TleEntry } from "../utils/tleParser";

import { getSatellitePositions } from "../services/satelliteManager";
import type { SatellitePosition } from "../services/satelliteManager";

export default function SatelliteEntities() {
  const [satellites, setSatellites] = useState<SatellitePosition[]>([]);
  const trackedSatIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let interval: NodeJS.Timer;
    let lastTleRaw: string | null = null;

    const trackedSatIds = trackedSatIdsRef.current;

    async function loadAndTrack() {
      try {
        const res = await fetch("/data/active_tles.txt", { cache: "no-store" });
        const text = await res.text();

        if (text === lastTleRaw) {
          return; // 🔁 no changes, skip reprocessing
        }

        lastTleRaw = text;
        const tles: TleEntry[] = parseTleText(text);
        console.log(`📂 TLE file updated — loaded ${tles.length} entries`);

        const newPositions = getSatellitePositions(tles);

        newPositions.forEach((sat) => {
          if (sat.position && !trackedSatIds.has(sat.id)) {
            console.log(`🛰️ Tracking: ${sat.name}`);
            trackedSatIds.add(sat.id);
          }
        });

        setSatellites(newPositions);
      } catch (err) {
        console.error("❌ Failed to fetch TLE file:", err);
      }
    }

    loadAndTrack(); // initial
    interval = setInterval(loadAndTrack, 500); // every 5 seconds

    return () => clearInterval(interval);
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
