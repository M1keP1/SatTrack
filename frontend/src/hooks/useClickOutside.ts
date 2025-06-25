// src/hooks/useClickOutside.ts
import { useEffect } from "react";
import { Cartesian2, Cartesian3 } from "cesium";
import type { Viewer } from "cesium";

export function useClickOutside(
  viewerRef: React.RefObject<Viewer | null>,
  trackedId: string | null,
  setTrackedId: (id: string | null) => void
) {
  useEffect(() => {
    const handleRightClick = (e: MouseEvent) => {
      if (!viewerRef.current || !trackedId) return;
      const viewer = viewerRef.current;

      const canvas = viewer.scene.canvas;
      const rect = canvas.getBoundingClientRect();

      const mousePosition = new Cartesian2(
        e.clientX - rect.left,
        e.clientY - rect.top
      );

      const picked = viewer.scene.pick(mousePosition);

      if (!picked && viewer.trackedEntity) {
        viewer.trackedEntity = undefined;
        setTrackedId(null);
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(0, 0, 20000000),
          duration: 2,
        });
        console.log("🧭 Exited follow mode and reset view (right-click)");
      }
    };

    // Use right-click (contextmenu)
    window.addEventListener("contextmenu", handleRightClick);
    return () => {
      window.removeEventListener("contextmenu", handleRightClick);
    };
  }, [viewerRef, trackedId, setTrackedId]);
}
