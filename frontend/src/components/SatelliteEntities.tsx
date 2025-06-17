import { useEffect, useState, useRef } from "react";
import { Entity } from "resium";
import { Color, Cartesian2 } from "cesium";
import toast from "react-hot-toast";

import { parseTleText } from "../utils/tleParser";
import type { TleEntry } from "../utils/tleParser";

import { getSatellitePositions } from "../services/satelliteManager";
import type { SatellitePosition } from "../services/satelliteManager";

type Props = {
  satellites: SatellitePosition[];
  setSatellites: (data: SatellitePosition[]) => void;
  trackedId: string | null;
};

export default function SatelliteEntities({ satellites, setSatellites, trackedId }: Props) {
  const trackedSatIdsRef = useRef<Set<string>>(new Set());
  const currentTlesRef = useRef<TleEntry[]>([]);
  const entityRefs = useRef<Record<string, Cesium.Entity>>({});

  useEffect(() => {
    let fileCheckInterval: ReturnType<typeof setInterval>;
    let positionUpdateInterval: ReturnType<typeof setInterval>;
    let lastTleRaw: string | null = null;

    const trackedSatIds = trackedSatIdsRef.current;

    const loadTleFile = async () => {
      try {
        const res = await fetch("/data/active_tles.txt", { cache: "no-store" });
        const text = await res.text();

        if (text === lastTleRaw) return;
        lastTleRaw = text;

        const tles = parseTleText(text);
        currentTlesRef.current = tles;

        const newPositions = getSatellitePositions(tles);
        const newIds = new Set(newPositions.map((s) => s.id));

        const added = [...newIds].filter((id) => !trackedSatIds.has(id));
        const removed = [...trackedSatIds].filter((id) => !newIds.has(id));

        if (added.length || removed.length) {
          toast.success(`🔄 ${added.length} added, ${removed.length} removed`);
        }

        added.forEach((id) => {
          const sat = newPositions.find((s) => s.id === id);
          console.log(`🛰️ Tracking: ${sat?.name} [${id}]`);
          trackedSatIds.add(id);
        });

        removed.forEach((id) => {
          console.log(`❌ Lost: ${id}`);
          trackedSatIds.delete(id);
        });

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

    fileCheckInterval = setInterval(loadTleFile, 10000);
    positionUpdateInterval = setInterval(updatePositions, 10);

    return () => {
      clearInterval(fileCheckInterval);
      clearInterval(positionUpdateInterval);
    };
  }, [setSatellites]);

  // Follow the tracked satellite (set viewer's trackedEntity)
  useEffect(() => {
    const viewer = (window as any).cesiumViewer as Cesium.Viewer | undefined;
    if (!viewer || !trackedId) return;

    const trackedEntity = entityRefs.current[trackedId];
    if (trackedEntity) {
      viewer.trackedEntity = trackedEntity;
      toast.success(`🎯 Following: ${trackedEntity.name}`);
    } else {
      viewer.trackedEntity = undefined;
    }
  }, [trackedId]);

  return (
    <>
      {satellites.map((sat) =>
        sat.position ? (
          <Entity
            key={sat.id}
            name={sat.name}
            position={sat.position}
            ref={(e) => {
              if (e && e.cesiumElement) {
                entityRefs.current[sat.id] = e.cesiumElement;
              }
            }}
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
