import { Viewer } from "resium";
import { Ion } from "cesium";
import { useRef } from "react";
import SatelliteEntities from "./SatelliteEntities";

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwOTkzNWYyMS1mMDIzLTRhMWItYWIxZS0wZjdmM2UzZDExYTYiLCJpZCI6MzAzMzk1LCJpYXQiOjE3NDc1MTc4MzB9.xVdwgbTzZJ1XrAk3BCb2K1W4lfkEpNUfAALkXe8pElA";

export default function Globe() {
  const viewerRef = useRef(null);
  

  return (
    <Viewer
      full
      ref={viewerRef}
      baseLayerPicker={false}
      geocoder={false}
      homeButton={false}
      sceneModePicker={false}
      navigationHelpButton={false}
      animation={false}
      timeline={false}
      infoBox={false}
      selectionIndicator={false}
    >
      <SatelliteEntities />
    </Viewer>
  );
}
