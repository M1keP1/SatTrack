import { useState } from "react";
import {
  Entity,
  BillboardGraphics,
  LabelGraphics,
  EllipseGraphics,
} from "resium";
import {
  Cartesian3,
  Cartesian2,
  Color,
  VerticalOrigin,
  LabelStyle,
  HeightReference,
  NearFarScalar,
  HorizontalOrigin,
} from "cesium";

interface GroundStation {
  lat: number;
  lon: number;
  alt?: number;
  name: string;
}

interface GroundStationEntityProps {
  station: GroundStation;
}

export default function GroundStationEntity({ station }: GroundStationEntityProps) {
  const { lat, lon, alt = 0, name } = station;
  const [isHovered, setIsHovered] = useState(false);
  const position = Cartesian3.fromDegrees(lon, lat, alt);

  return (
    <>
      {/* 🟢 Soft Ring only on hover */}
      {isHovered && (
        <Entity position={position} name={`${name} Ring`}  >
          <EllipseGraphics
            semiMajorAxis={2_000_000}
            semiMinorAxis={2_000_000}
            material={Color.TRANSPARENT}
            outline={true}
            outlineColor={Color.fromCssColorString("#34d399").withAlpha(0.6)}
            outlineWidth={4}
            height={0}
            heightReference={HeightReference.CLAMP_TO_GROUND}
          />
        </Entity>
      )}

      {/* 🛰️ GS Icon (hoverable but not clickable) */}
      <Entity
        position={position}
        name={name}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BillboardGraphics
          image="/assets/GS1.svg"
          heightReference={HeightReference.NONE}
          verticalOrigin={VerticalOrigin.BOTTOM}
          scale={isHovered ? 1.2 : 1.0}
          scaleByDistance={new NearFarScalar(5.0e6, 0.09, 3.0e7, 0.05)}
          disableDepthTestDistance={0}
          alignedAxis={ Cartesian3.UNIT_Z}


        />
        {isHovered && (
          <LabelGraphics
            text={name}
            font="700 12px monospace"
            fillColor={Color.WHITE}
            outlineColor={Color.BLACK.withAlpha(0.6)}
            outlineWidth={2}
            backgroundColor={Color.BLACK.withAlpha(0.5)}
            backgroundPadding={new Cartesian2(8, 4)}
            pixelOffset={new Cartesian2(0, 10)}
            verticalOrigin={VerticalOrigin.TOP}
            horizontalOrigin={HorizontalOrigin.CENTER}
            style={LabelStyle.FILL_AND_OUTLINE}
          />
        )}
      </Entity>
    </>
  );
}
