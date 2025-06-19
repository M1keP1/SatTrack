import { Cartesian3, Viewer } from "cesium";
import type { RefObject } from "react";
import { getCoordinatesByName } from "@/services/getCoordinatesByName";

export function useSetGroundStation(viewerRef: RefObject<Viewer>) {
  const flyToLocation = (
    lat: number,
    lon: number,
    altitude = 1000,
    duration = 4
  ) => {
    if (!viewerRef.current) return;

    const destination = Cartesian3.fromDegrees(lon, lat, altitude);
    viewerRef.current.trackedEntity = undefined;
    viewerRef.current.camera.flyTo({ destination, duration });
  };

  const flyToLocationByName = async (
    name: string,
    altitude = 1000,
    duration = 4
  ) => {
    if (!viewerRef.current) return;

    const coords = await getCoordinatesByName(viewerRef.current, name);
    if (!coords) return;

    flyToLocation(coords.lat, coords.lon, altitude, duration);
  };

  return { flyToLocation, flyToLocationByName };
}
