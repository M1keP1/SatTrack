import { IonGeocoderService, Rectangle, Viewer, Math as CesiumMath } from "cesium";

export async function getCoordinatesByName(
  viewer: Viewer,
  name: string
): Promise<{ lat: number; lon: number } | null> {
  try {
    const geocoder = new IonGeocoderService({ scene: viewer.scene });
    const results = await geocoder.geocode(name);

    if (results.length === 0) return null;

    const destination = results[0].destination;
    
    if ("x" in destination && "y" in destination && "z" in destination) {
      // Cartesian3
      const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(destination);
      const lat = CesiumMath.toDegrees(cartographic.latitude);
      const lon = CesiumMath.toDegrees(cartographic.longitude);
      return { lat, lon };

    } else if (
      destination &&
      typeof destination.west === "number" &&
      typeof destination.south === "number" &&
      typeof destination.east === "number" &&
      typeof destination.north === "number"
    ) {
      // Rectangle → Use center point
      const center = Rectangle.center(destination);
      const lat = CesiumMath.toDegrees(center.latitude);
      const lon = CesiumMath.toDegrees(center.longitude);
      return { lat, lon };
    }

    console.warn("❌ Unknown destination format:", destination);
    return null;

  } catch (err) {
    console.error("❌ Geocoding failed:", err);
    return null;
  }
}
