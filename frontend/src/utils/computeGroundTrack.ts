import * as satellite from "satellite.js";
import tzlookup from "tz-lookup";

export type GroundTrackResult = {
  azimuth: number;
  elevation: number;
  range: number;
  visible: boolean;
  nextPassStart?: Date;
  nextPassStartLocal?: string;
  nextPassDuration?: number; 
};

export function computeGroundTrack(
  tle: { line1: string; line2: string },
  groundStation: { lat: number; lon: number; alt: number },
  time: Date = new Date()
): GroundTrackResult | null {
  try {
    const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
    const posVel = satellite.propagate(satrec, time);

    if (!posVel || !posVel.position) {
      console.warn("❌ Satellite position missing during propagation");
      return null;
    }

    const gmst = satellite.gstime(time);
    const satEcf = satellite.eciToEcf(posVel.position, gmst);

  const { azimuth, elevation, rangeSat } = satellite.ecfToLookAngles(
    {
      longitude: groundStation.lon * (Math.PI / 180),
      latitude: groundStation.lat * (Math.PI / 180),
      height: groundStation.alt,
    },
    satEcf as satellite.EcfVec3<number>
  );

    const az = (azimuth * 180) / Math.PI;
    const el = (elevation * 180) / Math.PI;
    const visible = el > 0;

    // Pass prediction loop (look 24h ahead in 30s steps)
    const stepSeconds = 30;
    const maxSteps = (24 * 60 * 60) / stepSeconds;
    let passStart: Date | undefined;
    let passEnd: Date | undefined;
    let inPass = false;

    for (let i = 0; i < maxSteps; i++) {
      const futureDate = new Date(time.getTime() + i * stepSeconds * 1000);
      const gmstF = satellite.gstime(futureDate);
      const futurePosVel = satellite.propagate(satrec, futureDate);
      if (!futurePosVel || !futurePosVel.position) {
        continue;
      }
      const futureEcf = satellite.eciToEcf(futurePosVel.position, gmstF);
      const futureLook = satellite.ecfToLookAngles(
        {
          longitude: groundStation.lon * (Math.PI / 180),
          latitude: groundStation.lat * (Math.PI / 180),
          height: groundStation.alt,
        },
        futureEcf as satellite.EcfVec3<number>
      );
      const futureEl = (futureLook.elevation * 180) / Math.PI;

      if (futureEl > 0 && !inPass) {
        passStart = futureDate;
        inPass = true;
      }

      if (futureEl <= 0 && inPass) {
        passEnd = futureDate;
        break;
      }
    }

    // Local time formatting for passStart
    let localTimeStr: string | undefined = undefined;
    if (passStart) {
      const timezone = tzlookup(groundStation.lat, groundStation.lon);
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        dateStyle: "short",
        timeStyle: "short",
      });
      localTimeStr = formatter.format(passStart);
    }

    return {
      azimuth: az,
      elevation: el,
      range: rangeSat,
      visible,
      nextPassStart: passStart,
      nextPassStartLocal: localTimeStr,
      nextPassDuration:
        passStart && passEnd
          ? (passEnd.getTime() - passStart.getTime()) / 1000
          : undefined,
    };
  } catch (err) {
    console.error("❌ Error in computeGroundTrack:", err);
    return null;
  }
}
