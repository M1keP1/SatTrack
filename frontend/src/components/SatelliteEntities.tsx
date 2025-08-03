import { useEffect, useRef, useState } from "react";
import { Entity } from "resium";
import {
  Color,
  Cartesian2,
  Cartesian3,
  Cartographic,
  Ellipsoid,
  Math as CesiumMath,
  Entity as CesiumEntity,
  Viewer as CesiumViewer,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  NearFarScalar,
  HorizontalOrigin,
  VerticalOrigin,
  LabelStyle,
} from "cesium";
import toast from "react-hot-toast";
import { useSatelliteTracker } from "../hooks/useSatelliteTracker";
import { getTLEByNorad } from "@/services/tleService";
import type { SatellitePosition } from "../services/satelliteManager";

type Props = {
  satellites: SatellitePosition[];
  setSatellites: (data: SatellitePosition[]) => void;
  trackedId: string | null;
  setTrackedId: (id: string | null) => void;
  setCurrentTLE?: (tle: { line1: string; line2: string } | null) => void;
  activeGroundStation: { lat: number; lon: number; alt?: number } | null;
};

// ✅ Line-of-sight visibility calculation
function isVisibleFromGroundStation(
  satellitePosition: Cartesian3,
  groundStation: { lat: number; lon: number; alt?: number }
): boolean {
  const ellipsoid = Ellipsoid.WGS84;
  const gsCartographic = Cartographic.fromDegrees(
    groundStation.lon,
    groundStation.lat,
    groundStation.alt || 0
  );
  const gsCartesian = ellipsoid.cartographicToCartesian(gsCartographic);
  const gsToSat = Cartesian3.subtract(satellitePosition, gsCartesian, new Cartesian3());
  const gsNormal = ellipsoid.geodeticSurfaceNormal(gsCartesian, new Cartesian3());
  const angleRad = Cartesian3.angleBetween(gsToSat, gsNormal);
  const ELEVATION_THRESHOLD_DEG = 5; 
  return angleRad < CesiumMath.toRadians(90 - ELEVATION_THRESHOLD_DEG);
 
}

export default function SatelliteEntities({
  satellites,
  setSatellites,
  trackedId,
  setTrackedId,
  setCurrentTLE,
  activeGroundStation,
}: Props) {
  const entityRefs = useRef<Record<string, CesiumEntity>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useSatelliteTracker(setSatellites);

  // 🛰️ Track entity when clicked
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

  // 🖱️ Handle hover
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

  // 👆 Handle left click
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
        setCurrentTLE?.(tle || null);
      } catch (err) {
        console.error("❌ Error fetching TLE:", err);
        setCurrentTLE?.(null);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, []);

  return (
    <>
      {satellites.map((sat) => {
        if (!sat.position) return null;

        let isInRange = false;
        if (activeGroundStation && sat.position) {
          isInRange = isVisibleFromGroundStation(sat.position, activeGroundStation);
        }

        return (
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
                  : isInRange
                  ? Color.fromCssColorString("#34d399").withAlpha(0.9)
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
        );
      })}
    </>
  );
}
