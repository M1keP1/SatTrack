/**
 * 📘 SatTrack SatelliteEntities Component
 * This file renders all tracked satellite entities on the Cesium globe.
 * Includes hover/follow modes, live polling via useSatelliteTracker,
 * and label styling. Built as part of an academic project for UI/HCI purposes.
 */

import { useEffect, useRef, useState } from "react";
import { Entity } from "resium";
import { Color, Entity as CesiumEntity, Viewer as CesiumViewer, Cartesian2 } from "cesium";
import toast from "react-hot-toast";
import { useSatelliteTracker } from "../hooks/useSatelliteTracker";
import type { SatellitePosition } from "../services/satelliteManager";
import {
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  NearFarScalar,
  HorizontalOrigin,
  VerticalOrigin,
  LabelStyle,
} from "cesium";
import { getTLEByNorad } from "@/services/tleService";

type Props = {
  satellites: SatellitePosition[];
  setSatellites: (data: SatellitePosition[]) => void;
  trackedId: string | null;
  setTrackedId: (id: string | null) => void;
  setCurrentTLE?: (tle: { line1: string; line2: string } | null) => void;
};

export default function SatelliteEntities({
  satellites,
  setSatellites,
  trackedId,
  setTrackedId,
  setCurrentTLE,
}: Props) {
  const entityRefs = useRef<Record<string, CesiumEntity>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useSatelliteTracker(setSatellites);

  useEffect(() => {
    const viewer = (window as any).cesiumViewer as CesiumViewer | undefined;
    if (!viewer) return;

    if (trackedId && entityRefs.current[trackedId]) {
      viewer.trackedEntity = entityRefs.current[trackedId];
      toast.success(`🎯 Following: ${entityRefs.current[trackedId].name}`);
    } else {
      viewer.trackedEntity = undefined;
    }
  }, [trackedId]);

  useEffect(() => {
    const viewer = (window as any).cesiumViewer as CesiumViewer | undefined;
    if (!viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((movement: any) => {
      const picked = viewer.scene.pick(movement.endPosition);
      const id = picked?.id?.id ?? null;
      setHoveredId(id);
    }, ScreenSpaceEventType.MOUSE_MOVE);

    return () => handler.destroy();
  }, []);

  useEffect(() => {
    const viewer = (window as any).cesiumViewer as CesiumViewer | undefined;
    if (!viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction(async (movement: any) => {
      const picked = viewer.scene.pick(movement.position);
      const pickedId = picked?.id?.id;
      if (!pickedId) return;

      setTrackedId(pickedId);
      toast.success(`ℹ️ Right Click to exit Follow Mode`);

      try {
        const cleanedId = pickedId.replace(/[Uu]$/, "").trim();
        const tle = await getTLEByNorad(cleanedId);

        if (tle && setCurrentTLE) {
          setCurrentTLE(tle);
          console.log("🛰️ Fetched & set TLE from server for:", pickedId);
        } else {
          console.warn("❌ No TLE found for:", pickedId);
          setCurrentTLE?.(null);
        }
      } catch (err) {
        console.error("❌ Error fetching TLE:", err);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, []);

  return (
    <>
      {satellites.map((sat) =>
        sat.position ? (
          <Entity
            key={sat.id}
            id={sat.id}
            name={sat.name}
            position={sat.position}
            ref={(e) => {
              if (e?.cesiumElement) {
                entityRefs.current[sat.id] = e.cesiumElement;
              }
            }}
            point={{
              pixelSize:
                trackedId === sat.id ? 22 : hoveredId === sat.id ? 18 : 12,
              color:
                trackedId === sat.id
                  ? Color.fromCssColorString("#34d399")
                  : hoveredId === sat.id
                  ? Color.fromCssColorString("#bbf7d0")
                  : Color.WHITE,
              outlineColor: Color.BLACK.withAlpha(0.5),
              outlineWidth: 2,
              scaleByDistance: new NearFarScalar(150, 1.3, 15000000, 0.5),
            }}
            label={
              hoveredId === sat.id || trackedId === sat.id
                ? {
                    text: sat.name,
                    font:
                      trackedId === sat.id
                        ? "700 16px monospace"
                        : "400 13px monospace",
                    fillColor: Color.WHITE,
                    outlineColor: Color.BLACK.withAlpha(0.6),
                    outlineWidth: 2,
                    showBackground: true,
                    backgroundColor: Color.BLACK.withAlpha(0.5),
                    backgroundPadding: new Cartesian2(8, 4),
                    pixelOffset: new Cartesian2(24, 0),
                    horizontalOrigin: HorizontalOrigin.LEFT,
                    verticalOrigin: VerticalOrigin.CENTER,
                    style: LabelStyle.FILL_AND_OUTLINE,
                  }
                : undefined
            }
            description={`<p>${sat.name}</p>`}
          />
        ) : null
      )}
    </>
  );
}
