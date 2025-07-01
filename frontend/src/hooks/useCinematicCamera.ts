import { useEffect, useRef } from "react";
import { Viewer, Cartesian3, Ellipsoid } from "cesium";

export function useCinematicCamera(viewerRef: React.RefObject<Viewer | null>, showSplash: boolean) {
  const idleRotationRef = useRef<(() => void) | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showSplash || !viewerRef.current) return;

    const viewer = viewerRef.current;
    let angle = 0;

    const startRotation = () => {
    if (!viewer) return;
    stopRotation(); // avoid multiple listeners

    angle = 0;
    idleRotationRef.current = viewer.clock.onTick.addEventListener(() => {
        const cameraPosition = viewer.camera.positionWC;
        const cartographic = Ellipsoid.WGS84.cartesianToCartographic(cameraPosition);

        if (!cartographic) return;

        const heightKm = cartographic.height / 1000;

        // Only rotate if zoomed out enough
        if (heightKm > 3500) {

        angle += 0.01;
        viewer.camera.rotate(Cartesian3.UNIT_Z, -0.00025); // yaw
        viewer.camera.rotate(Cartesian3.UNIT_X, Math.sin(angle) * 0.00002); // wobble
        }

    });
    };


    const stopRotation = () => {
      if (idleRotationRef.current) {
        idleRotationRef.current();
        idleRotationRef.current = null;
      }
    };

    const resetIdleTimer = () => {
      stopRotation();
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        startRotation();
      }, 1000); 
    };

    // Initial start
    startRotation();

    // Listen for user activity
    const events = ["mousemove", "mousedown", "keydown", "wheel"];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));

    return () => {
      stopRotation();
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
    };
  }, [viewerRef, showSplash]);
}
