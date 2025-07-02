// ════════════════════════════════════════════════════════════════════════
// 📁 satelliteManager.ts
// 🛰️ Utility functions for computing satellite positions from TLEs
// 🔒 Submitted as part of an academic project (SatTrack)
// 📌 Purpose: Educational demonstration only. Not intended for production.
// ════════════════════════════════════════════════════════════════════════

import { Cartesian3 } from "cesium";
import { twoline2satrec, propagate, gstime, eciToGeodetic } from "satellite.js";
import type { TleEntry } from "../utils/tleParser";

// ════════════════════════════════════════════════════════════════════════
// 📦 SatellitePosition Type
// Represents a satellite's basic metadata and computed position.
// ════════════════════════════════════════════════════════════════════════
export type SatellitePosition = {
  name: string;
  id: string;
  position: Cartesian3 | null;
  tle: {
    line1: string;
    line2: string;
  };
};

// ════════════════════════════════════════════════════════════════════════
// 🔭 computePositionFromTLE
// Description:
//   - Converts a TLE entry into a satellite.js record
//   - Propagates its current position
//   - Returns a Cesium-compatible Cartesian3 coordinate (or null if failed)
// ════════════════════════════════════════════════════════════════════════
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

// ════════════════════════════════════════════════════════════════════════
// 📡 getSatellitePositions
// Description:
//   - Maps a list of TLEs into real-time positions for all satellites.
// ════════════════════════════════════════════════════════════════════════
export function getSatellitePositions(tles: TleEntry[]): SatellitePosition[] {
  return tles.map(computePositionFromTLE);
}
