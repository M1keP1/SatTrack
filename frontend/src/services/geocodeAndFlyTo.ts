// src/utils/geocodeAndFlyTo.ts
import { IonGeocoderService, Viewer } from "cesium";

export async function geocodeAndFlyTo(
  viewer: Viewer,
  locationName: string,
  duration: number = 4
): Promise<boolean> {
  try {
    const trimmed = locationName.trim();
    if (!trimmed) return false;

    const geocoderService = new IonGeocoderService({ scene: viewer.scene });
    const results = await geocoderService.geocode(trimmed);

    if (results.length > 0) {
      viewer.trackedEntity = undefined;
      viewer.camera.flyTo({
        destination: results[0].destination,
        duration,
      });
      return true;
    } else {
      console.warn("❌ No geocode results for:", trimmed);
      return false;
    }
  } catch (error) {
    console.error("❌ Geocode error:", error);
    return false;
  }
}
