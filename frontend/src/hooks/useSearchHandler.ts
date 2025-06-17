import { IonGeocoderService, Viewer } from "cesium";
import type { SatellitePosition } from "../services/satelliteManager";

export function useSearchHandler(viewer: Viewer | null, satellites: SatellitePosition[]) {
  return async function handleSearch(query: string) {
    if (!viewer) return;

    const match = satellites.find((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );

    if (match?.position) {
      console.log("🎯 Satellite found:", match.name);
      viewer.flyTo(viewer.entities.getById(match.id));
      return;
    }

    try {
      const geocoder = new IonGeocoderService({ scene: viewer.scene });
      const results = await geocoder.geocode(query);

      if (results.length > 0) {
        viewer.camera.flyTo({ destination: results[0].destination, duration: 3 });
        console.log("🌍 Location found:", query);
      } else {
        console.warn("No location or satellite found");
      }
    } catch (err) {
      console.error("Geocode error:", err);
    }
  };
}
