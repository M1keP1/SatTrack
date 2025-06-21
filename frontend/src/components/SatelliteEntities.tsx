// components/SatelliteEntities.tsx
import { useEffect, useRef } from "react";
import { Entity } from "resium";
import { Color, Cartesian2, Entity as CesiumEntity, Viewer as CesiumViewer } from "cesium";
import toast from "react-hot-toast";
import { useSatelliteTracker } from "../hooks/useSatelliteTracker";
import type { SatellitePosition } from "../services/satelliteManager";
import { ScreenSpaceEventHandler, ScreenSpaceEventType } from "cesium";

type Props = {
  satellites: SatellitePosition[];
  setSatellites: (data: SatellitePosition[]) => void;
  trackedId: string | null;
  setTrackedId: (id: string | null) => void;
};

export default function SatelliteEntities({ satellites, setSatellites, trackedId,setTrackedId }: Props) {
  const entityRefs = useRef<Record<string, CesiumEntity>>({});

  // Handle TLE polling and updates
  useSatelliteTracker(setSatellites);

  // Track selected satellite in viewer
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
      const picked = viewer.scene.pick(movement.position);
      if (picked?.id?.id) {
        setTrackedId(picked.id.id); 
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
