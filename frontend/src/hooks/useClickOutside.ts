// src/hooks/useClickOutside.ts
import { useEffect } from "react";
import { Cartesian3 } from "cesium";
import type { Viewer } from "cesium";

export function useClickOutside(
  viewerRef: React.RefObject<Viewer | null>,
  trackedId: string | null,
  setTrackedId: (id: string | null) => void
) {
  useEffect(() => {
    const resetCameraView = () => {
      if (!viewerRef.current) return;
      viewerRef.current.camera.flyTo({
        destination: Cartesian3.fromDegrees(0, 0, 20000000),
        duration: 2,
      });
      console.log("🔄 Resetting camera to default view.");
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.closest(".sidebar-container") ||
        target.closest(".suggestions-list") ||
        target.closest(".search-input")
      )
        return;

      if (trackedId) {
        console.log("👆 Clicked outside, exiting follow mode.");
        setTrackedId(null);
        resetCameraView();
      }
    };

    const timeout = setTimeout(() => {
      window.addEventListener("click", handleClick);
    }, 100);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("click", handleClick);
    };
  }, [trackedId]);
}
