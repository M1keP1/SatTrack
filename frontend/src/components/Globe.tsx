import { Viewer } from "resium";
import { Ion } from "cesium";
import SatelliteEntities from "./SatelliteEntities";
import type { Viewer as CesiumViewer } from "cesium";
import type { SatellitePosition } from "../services/satelliteManager";
import { useEffect } from "react";
import * as Cesium from "cesium";

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwOTkzNWYyMS1mMDIzLTRhMWItYWIxZS0wZjdmM2UzZDExYTYiLCJpZCI6MzAzMzk1LCJpYXQiOjE3NDc1MTc4MzB9.xVdwgbTzZJ1XrAk3BCb2K1W4lfkEpNUfAALkXe8pElA";

type GlobeProps = {
  viewerRef: React.MutableRefObject<CesiumViewer | null>;
  satellites: SatellitePosition[];
  setSatellites: (data: SatellitePosition[]) => void;
  trackedId: string | null;
  setTrackedId: (id: string | null) => void;
  setCurrentTLE: (tle: { line1: string; line2: string } | null) => void;
};

const Globe: React.FC<GlobeProps> = ({ viewerRef, satellites, setSatellites, trackedId, setTrackedId, setCurrentTLE }) => {

    useEffect(() => {
      setTimeout(() => {
        const viewer = viewerRef.current;
        if (!viewer) {
          console.error("❌ Cesium viewer still not ready.");
          return;
        }
  
        console.log("🌌 Setting custom skybox");
        viewer.scene.skyBox = new Cesium.SkyBox({
          sources: {
            positiveX: "/skybox/px.png",
            negativeX: "/skybox/nx.png",
            positiveY: "/skybox/py.png",
            negativeY: "/skybox/ny.png",
            positiveZ: "/skybox/pz.png",
            negativeZ: "/skybox/nz.png",
          },
        });
        viewer.scene.skyAtmosphere.show = false;
        viewer.scene.globe.show = true;
      }, 3099); // wait 1s after mount
    }, []);
    
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
      setTrackedId={setTrackedId}
      setCurrentTLE={setCurrentTLE}
    />

    </Viewer>
    

  );
};

export default Globe;
