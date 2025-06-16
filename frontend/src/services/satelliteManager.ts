import { Cartesian3 } from "cesium";
import { twoline2satrec, propagate, gstime, eciToGeodetic } from "satellite.js";
import type { TleEntry } from "../utils/tleParser";

export type SatellitePosition = {
  name: string;
  id: string;
  position: Cartesian3 | null;
};

export function computePositionFromTLE(tle: TleEntry): SatellitePosition {
  const satrec = twoline2satrec(tle.line1, tle.line2);
  const date = new Date();

  const posVel = propagate(satrec, date);
  if (!posVel.position) return { name: tle.name, id: tle.line1.split(" ")[1], position: null };

  const gmst = gstime(date);
  const geo = eciToGeodetic(posVel.position, gmst);

  const position = Cartesian3.fromRadians(geo.longitude, geo.latitude, geo.height * 1000);
  return {
    name: tle.name,
    id: tle.line1.split(" ")[1],
    position,
  };
}

export function getSatellitePositions(tles: TleEntry[]): SatellitePosition[] {
  return tles.map(computePositionFromTLE);
}
