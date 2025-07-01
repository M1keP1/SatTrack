import { useCallback, useRef } from "react";
import { Cartesian3, Viewer } from "cesium";

export function usePanelCameraZoom(viewerRef: React.RefObject<Viewer | null>) {
  const defaultViewRef = useRef<{
    position: Cartesian3;
    direction: Cartesian3;
    up: Cartesian3;
  } | null>(null);

  const saveDefaultView = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    defaultViewRef.current = {
      position: viewer.camera.positionWC.clone(),
      direction: viewer.camera.direction.clone(),
      up: viewer.camera.up.clone(),
    };
  }, [viewerRef]);

  const zoomTo = useCallback((zoomKm: number) => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(0, 0, zoomKm * 1000),
      duration: 1.2,
    });
  }, [viewerRef]);

  const zoomOut = () => zoomTo(10000000); // Far out (e.g. black background)
  
  const zoomIn = useCallback(() => {
    const viewer = viewerRef.current;
    const defaultView = defaultViewRef.current;
    if (!viewer || !defaultView) return;

    viewer.camera.flyTo({
      destination: defaultView.position,
      orientation: {
        direction: defaultView.direction,
        up: defaultView.up,
      },
      duration: 1.2,
    });
  }, [viewerRef]);

  return {
    zoomTo,
    zoomOut,
    zoomIn,
    saveDefaultView, // ← use this after splash or wherever you want to "set" the default view
  };
}
