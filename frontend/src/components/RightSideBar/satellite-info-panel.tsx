
interface SatelliteInfo {
  noradId: number;
  name: string;
  longitude: number;
  latitude: number;
  altitude: number;
  velocity: number; 
  satelliteType: string;
  operator: string;
}

interface SatelliteInfoPanelProps {
  selectedSatellite: SatelliteInfo | null;
}

export function SatelliteInfoPanel({ selectedSatellite }: SatelliteInfoPanelProps) {
  const displayData = selectedSatellite || {
    noradId: 0,
    name: "",
    longitude: 0,
    latitude: 0,
    altitude: 0,
    velocity: 0, 
    satelliteType: "",
    operator: ""
  };

  return (
    <div className="flex-1 flex flex-col space-y-3 min-h-0">
      {/* Coordinates Section */}
      <div className="grid grid-cols-2 gap-2 flex-shrink-0">
        <div className="bg-teal-800/20 backdrop-blur-sm rounded-lg p-2 border border-teal-400/20 text-center">
          <div className="text-xs text-teal-300/80 mb-1">Longitude</div>
          <div className="text-sm font-mono text-teal-400 font-bold">
            {selectedSatellite ? `${displayData.longitude.toFixed(2)}°` : "---.--°"}
          </div>
        </div>
        <div className="bg-teal-800/20 backdrop-blur-sm rounded-lg p-2 border border-teal-400/20 text-center">
          <div className="text-xs text-teal-300/80 mb-1">Latitude</div>
          <div className="text-sm font-mono text-teal-400 font-bold">
            {selectedSatellite ? `${displayData.latitude.toFixed(2)}°` : "---.--°"}
          </div>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="bg-teal-800/20 backdrop-blur-sm rounded-lg p-2 border border-teal-400/20 text-center">
          <div className="text-xs text-teal-300/70 mb-1">NORAD ID</div>
          <div className="text-sm font-mono text-white font-semibold">
            {selectedSatellite ? displayData.noradId : "-----"}
          </div>
        </div>

        <div className="bg-teal-800/20 backdrop-blur-sm rounded-lg p-2 border border-teal-400/20 text-center">
          <div className="text-xs text-teal-300/70 mb-1">Satellite Name</div>
          <div className="text-xs text-white font-medium">
            {selectedSatellite ? displayData.name : "No satellite selected"}
          </div>
        </div>

        <div className="bg-teal-800/20 backdrop-blur-sm rounded-lg p-2 border border-teal-400/20 text-center">
          <div className="text-xs text-teal-300/70 mb-1">Altitude</div>
          <div className="text-sm font-mono text-emerald-400 font-bold">
            {selectedSatellite ? `${displayData.altitude.toFixed(1)} km` : "--- km"}
          </div>
        </div>

        <div className="bg-teal-800/20 backdrop-blur-sm rounded-lg p-2 border border-teal-400/20 text-center">
          <div className="text-xs text-teal-300/70 mb-1">Velocity</div>
          <div className="text-sm font-mono text-cyan-400 font-bold">
            {selectedSatellite && !isNaN(displayData.velocity)
              ? `${displayData.velocity.toFixed(2)} km/s`
              : "--- km/s"}
          </div>

        </div>
      </div>

      {/* Ground Station View Section */}
      <div className="bg-teal-800/20 backdrop-blur-sm rounded-lg p-3 border border-teal-400/20 flex-shrink-0">
        <h3 className="text-xs font-medium text-white mb-2 text-center">Ground Station View</h3>
        
        {/* Horizon View */}
        <div className="relative w-full h-24 mx-auto mb-2 bg-gradient-to-t from-teal-900/40 to-transparent rounded-lg border border-teal-400/20 overflow-hidden">
          {/* Horizon line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-teal-400/60"></div>
          
          {/* Compass directions */}
          <div className="absolute bottom-1 left-2 text-xs text-teal-300/60">W</div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-teal-300/60">S</div>
          <div className="absolute bottom-1 right-2 text-xs text-teal-300/60">E</div>
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs text-teal-300/60">N</div>
          
          {/* Satellite position indicator */}
          <div className="absolute bottom-4 left-2/3 w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 left-2/3 text-xs text-teal-400 transform -translate-x-1/2">SAT</div>
          
          {/* Elevation angle arc */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
            <path
              d="M 20 80 Q 100 40 180 80"
              fill="none"
              stroke="rgba(20, 184, 166, 0.4)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          </svg>
        </div>
        
        <div className="grid grid-cols-3 gap-1 mb-3 text-xs">
          <div className="text-center bg-teal-900/30 rounded p-1 border border-teal-400/20">
            <div className="text-teal-300/80 mb-0.5">Azimuth</div>
            <div className="text-teal-400 font-mono">127°</div>
          </div>
          <div className="text-center bg-teal-900/30 rounded p-1 border border-teal-400/20">
            <div className="text-teal-300/80 mb-0.5">Elevation</div>
            <div className="text-teal-400 font-mono">45°</div>
          </div>
          <div className="text-center bg-teal-900/30 rounded p-1 border border-teal-400/20">
            <div className="text-teal-300/80 mb-0.5">Range</div>
            <div className="text-teal-400 font-mono">850km</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-center bg-teal-900/30 rounded p-1.5 border border-teal-400/20">
            <div className="text-xs text-teal-300/80 mb-0.5">Next Pass</div>
            <div className="text-emerald-400 font-mono text-xs">14:23 UTC</div>
          </div>
          <div className="text-center bg-teal-900/30 rounded p-1.5 border border-teal-400/20">
            <div className="text-xs text-teal-300/80 mb-0.5">Duration</div>
            <div className="text-white font-mono text-xs">6m 42s</div>
          </div>
        </div>

        {/* Ground Station View button */}
        <button className="w-full bg-teal-600/30 backdrop-blur-sm border border-teal-400/40 rounded-lg p-2 text-sm text-white hover:bg-teal-600/40 transition-colors mb-2 font-medium">
          Ground Station View
        </button>

        {/* Skyglow and Cloud buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-teal-900/40 backdrop-blur-sm border border-teal-400/30 rounded-lg p-2 text-xs text-white hover:bg-teal-800/40 transition-colors">
            Skyglow
          </button>
          <button className="bg-teal-900/40 backdrop-blur-sm border border-teal-400/30 rounded-lg p-2 text-xs text-white hover:bg-teal-800/40 transition-colors">
            Cloud
          </button>
        </div>
      </div>
    </div>
  );
}