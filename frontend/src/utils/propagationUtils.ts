import {
  twoline2satrec,
  propagate,
  gstime,
  eciToGeodetic,
} from "satellite.js";

export function computeOrbitalState(tle: { line1: string; line2: string }) {
  try {
    const date = new Date();
    const satrec = twoline2satrec(tle.line1.trim(), tle.line2.trim());

    const posVel = propagate(satrec, date);
    if (!posVel || !posVel.position || !posVel.velocity) {
      console.warn("❌ propagate() failed: No position or velocity");
      return null;
    }

    const { x, y, z } = posVel.position;
    const { x: vx, y: vy, z: vz } = posVel.velocity;

    if (
      [x, y, z, vx, vy, vz].some((n) => typeof n !== "number" || isNaN(n))
    ) {
      console.warn("❌ Invalid ECI values");
      return null;
    }

    const gmst = gstime(date);
    const geo = eciToGeodetic(posVel.position, gmst);

    const lat = geo.latitude * (180 / Math.PI);
    const lon = geo.longitude * (180 / Math.PI);
    const alt = geo.height; // in km
    const velocity = Math.sqrt(vx ** 2 + vy ** 2 + vz ** 2); // km/s

    return {
      latitude: lat,
      longitude: lon,
      altitude: alt,
      velocity: velocity,
    };
  } catch (error) {
    console.error("❌ computeOrbitalState error:", error);
    return null;
  }
}
