import { Viewer } from "resium";
import { Ion } from "cesium";
import SatelliteEntities from "./SatelliteEntities";
import type { Viewer as CesiumViewer } from "cesium";
import type { SatellitePosition } from "../services/satelliteManager";

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwOTkzNWYyMS1mMDIzLTRhMWItYWIxZS0wZjdmM2UzZDExYTYiLCJpZCI6MzAzMzk1LCJpYXQiOjE3NDc1MTc4MzB9.xVdwgbTzZJ1XrAk3BCb2K1W4lfkEpNUfAALkXe8pElA";

type GlobeProps = {
  viewerRef: React.MutableRefObject<CesiumViewer | null>;
  satellites: SatellitePosition[];
  setSatellites: (data: SatellitePosition[]) => void;
  trackedId: string | null;
};

const Globe: React.FC<GlobeProps> = ({ viewerRef, satellites, setSatellites, trackedId }) => {

  return (
    <Viewer
      full
      ref={(viewer) => {
        if (viewer && viewer.cesiumElement) {
          viewerRef.current = viewer.cesiumElement;
          (window as any).cesiumViewer = viewer.cesiumElement;
        }
      }}
      animation={false}
      timeline={false}
      baseLayerPicker={false}
      geocoder={false}
      homeButton={false}
      infoBox={false}
      sceneModePicker={false}
      selectionIndicator={false}
      navigationHelpButton={false}
      fullscreenButton={false}
    >
      <SatelliteEntities 
      satellites={satellites} 
      setSatellites={setSatellites}
      trackedId={trackedId} 
      />
    </Viewer>
  );
};

export default Globe;
