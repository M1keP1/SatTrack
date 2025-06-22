import { useEffect, useState } from "react";
import { computeGroundTrack } from "@/utils/computeGroundTrack";

export interface GroundTrackResult {
  azimuth: number;
  elevation: number;
  range: number;
  visible: boolean;
  nextPassStart?: Date;
  nextPassStartLocal?: string;
  nextPassDuration?: number;
}

type GroundStation = {
  lat: number;
  lon: number;
  alt: number;
};

type TLE = {
  line1: string;
  line2: string;
};

export function usePassPrediction(
  tle: TLE | null,
  groundStation: GroundStation | null,
  isEnabled: boolean = true,
  intervalMs: number = 10000 // 10 seconds
): GroundTrackResult | null {
  const [data, setData] = useState<GroundTrackResult | null>(null);

  useEffect(() => {
    if (!tle || !groundStation || !isEnabled) {
      console.warn("⚠️ Skipping prediction: missing inputs", {
        tle,
        groundStation,
        isEnabled
      });
      setData(null);
      return;
    }

    console.log("🔁 [usePassPrediction] Inputs changed, recomputing...", {
      tle,
      groundStation,
      isEnabled
    });

    const update = () => {
      const result = computeGroundTrack(tle, groundStation);
      console.log("📈 Prediction computed:", result);
      if (result) setData(result);
    };

    update(); 
    const interval = setInterval(update, intervalMs);
    return () => clearInterval(interval);
  }, [
    tle?.line1,
    tle?.line2,
    groundStation?.lat,
    groundStation?.lon,
    groundStation?.alt,
    isEnabled,
    intervalMs
  ]);

  return data;
}
