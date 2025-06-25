import { Cartesian3 } from "cesium";
import { twoline2satrec, propagate, gstime, eciToGeodetic } from "satellite.js";
import type { TleEntry } from "../utils/tleParser";

export type SatellitePosition = {
  name: string;
  id: string;
  position: Cartesian3 | null;
  tle: {
    line1: string;
    line2: string;
  };
};

export function computePositionFromTLE(tle: TleEntry): SatellitePosition {
  const satrec = twoline2satrec(tle.line1, tle.line2);
  const date = new Date();
  const posVel = propagate(satrec, date);
  const gmst = gstime(date);

  const idMatch = tle.line1.match(/(\d{5}[A-Z]?)/);
  const id = idMatch ? idMatch[1] : tle.name;

  if (!posVel || !posVel.position) {
    return {
      name: tle.name,
      id,
      position: null,
      tle: { line1: tle.line1, line2: tle.line2 },
    };
  }

  const geo = eciToGeodetic(posVel.position, gmst);
  const position = Cartesian3.fromRadians(geo.longitude, geo.latitude, geo.height * 1000);

  return {
    name: tle.name,
    id,
    position,
    tle: { line1: tle.line1, line2: tle.line2 },
  };
}


export function getSatellitePositions(tles: TleEntry[]): SatellitePosition[] {
  return tles.map(computePositionFromTLE);
}
