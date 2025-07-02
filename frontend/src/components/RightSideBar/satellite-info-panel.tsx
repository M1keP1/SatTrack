/**
 * This file is part of the SatTrack project, submitted for academic purposes only.
 * It is intended solely for evaluation in an educational context.
 */

import { usePassPrediction, type GroundTrackResult } from "@/hooks/usePassPrediction";
import { useEffect } from "react";

// ==========================
// 📦 Props
// ==========================

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
  tle: { line1: string; line2: string } | null;
  groundStation: { lat: number; lon: number; alt: number } | null;
  isGroundStationEnabled: boolean;
  onOpenSkyglow: () => void;
  onOpenCloud: () => void;
  onOpenSettings?: () => void;
  onOpenContact?: () => void;
  onOpenPromo?: () => void;
}

// ==========================
// 🛰️ Satellite Info Panel
// ==========================

/**
 * Displays detailed satellite information along with ground station visibility,
 * pass prediction data, external links, and controls to open overlays and settings.
 */
export function SatelliteInfoPanel({
  selectedSatellite,
  tle,
  groundStation,
  isGroundStationEnabled,
  onOpenSkyglow,
  onOpenCloud,
  onOpenSettings,
  onOpenContact,
  onOpenPromo,
}: SatelliteInfoPanelProps) {
  const displayData = selectedSatellite || {
    noradId: 0,
    name: "",
    longitude: 0,
    latitude: 0,
    altitude: 0,
    velocity: 0,
    satelliteType: "",
    operator: "",
  };

  // Log changes for debugging
  useEffect(() => {
    console.log("🔍 [SatelliteInfoPanel] Props changed:", {
      tle,
      groundStation,
      isGroundStationEnabled,
    });
  }, [tle, groundStation, isGroundStationEnabled]);

  // Calculate pass prediction based on current TLE and ground station
  const passData: GroundTrackResult | null = usePassPrediction(
    tle,
    groundStation,
    isGroundStationEnabled
  );

  console.log("📡 usePassPrediction returned:", passData);

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto space-y-4">
      
      {/* ========================== */}
      {/* 🌍 Coordinates */}
      {/* ========================== */}
      <div className="grid grid-cols-2 gap-2 flex-shrink-0">
        {["Longitude", "Latitude"].map((label, i) => (
          <div key={label} className="bg-teal-800/20 backdrop-blur-sm rounded-lg p-2 border border-teal-400/20 text-center">
            <div className="text-xs text-teal-300/80 mb-1">{label}</div>
            <div className="text-sm font-mono text-teal-400 font-bold">
              {selectedSatellite
                ? `${i === 0 ? displayData.longitude.toFixed(2) : displayData.latitude.toFixed(2)}°`
                : "---.--°"}
            </div>
          </div>
        ))}
      </div>

      {/* ========================== */}
      {/* 📋 Satellite Details */}
      {/* ========================== */}
      <div className="flex-1 space-y-3 overflow-hidden">
        {[
          { label: "NORAD ID", value: selectedSatellite ? displayData.noradId : "-----" },
          { label: "Satellite Name", value: selectedSatellite ? displayData.name : "No satellite selected" },
          {
            label: "Altitude",
            value: selectedSatellite ? `${displayData.altitude.toFixed(1)} km` : "--- km",
          },
          {
            label: "Velocity",
            value: selectedSatellite && !isNaN(displayData.velocity)
              ? `${displayData.velocity.toFixed(2)} km/s`
              : "--- km/s",
          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-teal-800/20 backdrop-blur-sm rounded-lg p-2 border border-teal-400/20 text-center">
            <div className="text-xs text-teal-300/70 mb-1">{label}</div>
            <div className={`text-sm font-mono font-bold ${
              label === "Altitude"
                ? "text-emerald-400"
                : label === "Velocity"
                ? "text-cyan-400"
                : "text-white font-semibold"
            }`}>{value}</div>
          </div>
        ))}
      </div>

      {/* ========================== */}
      {/* 🧭 Ground Station Panel */}
      {/* ========================== */}
      <div className="bg-teal-800/20 backdrop-blur-sm rounded-lg p-3 border border-teal-400/20 ">
        <h3 className={`text-xs font-medium text-center mb-2 ${
          isGroundStationEnabled ? "text-white" : "text-amber-400"
        }`}>
          {isGroundStationEnabled ? "Ground Station View" : "⚠️ Ground Station View Disabled"}
        </h3>

        {/* Compass + Elevation Arc */}
        <div className="relative w-full h-24 mx-auto mb-2 bg-gradient-to-t from-teal-900/40 to-transparent rounded-lg border border-teal-400/20 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-teal-400/60" />
          <div className="absolute bottom-1 left-2 text-xs text-teal-300/60">W</div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-teal-300/60">S</div>
          <div className="absolute bottom-1 right-2 text-xs text-teal-300/60">E</div>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-xs text-teal-300/60">N</div>
          <div className="absolute bottom-4 left-2/3 w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          <div className="absolute bottom-6 left-2/3 text-xs text-teal-400 -translate-x-1/2">SAT</div>

          {/* Arc Path */}
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

        {/* Azimuth, Elevation, Range */}
        <div className="grid grid-cols-3 gap-1 mb-3 text-xs">
          {[
            { label: "Azimuth", value: passData?.azimuth, suffix: "°" },
            { label: "Elevation", value: passData?.elevation, suffix: "°" },
            { label: "Range", value: passData?.range, suffix: " km" },
          ].map(({ label, value, suffix }) => (
            <div key={label} className="text-center bg-teal-900/30 rounded p-1 border border-teal-400/20">
              <div className="text-teal-300/80 mb-0.5">{label}</div>
              <div className="text-teal-400 font-mono">
                {value != null ? `${Math.round(value)}${suffix}` : `--${suffix}`}
              </div>
            </div>
          ))}
        </div>

        {/* Next Pass & Duration */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-center bg-teal-900/30 rounded p-1.5 border border-teal-400/20">
            <div className="text-xs text-teal-300/80 mb-0.5">Next Pass</div>
            <div className="text-teal-400 font-mono">  
              {passData?.nextPassStartLocal
                ? new Date(passData.nextPassStartLocal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "--:--"}
            </div>
          </div>
          <div className="text-center bg-teal-900/30 rounded p-1.5 border border-teal-400/20">
            <div className="text-xs text-teal-300/80 mb-0.5">Duration</div>
            <div className="text-teal-400 font-mono">
              {passData?.nextPassDuration
                ? `${Math.floor(passData.nextPassDuration / 60)}m ${Math.round(passData.nextPassDuration % 60)}s`
                : "--"}
            </div>
          </div>
        </div>

        {/* External Tool Link */}
        <a
          href="https://stellarium-web.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-teal-600/30 backdrop-blur-sm border border-teal-400/40 rounded-lg p-2 text-sm text-cyan-400 hover:bg-teal-600/40 transition-colors mb-2 font-medium"
        >
          Stellarium Ground Station View
        </a>
        <p className="text-xs text-teal-300/60 text-center -mt-2 mb-3">
          (Manual satellite search required)
        </p>

        {/* Overlay Toggles */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenSkyglow}
            className="font-mono !bg-teal-900/40 backdrop-blur-sm border border-teal-400/30 rounded-lg p-2 text-xs text-white hover:bg-teal-800/40 transition-colors"
          >
            Skyglow
          </button>
          <button
            onClick={onOpenCloud}
            className="font-mono !bg-teal-900/40 backdrop-blur-sm border border-teal-400/30 rounded-lg p-2 text-xs text-white hover:bg-teal-800/40 transition-colors"
          >
            Cloud
          </button>
        </div>
      </div>

      {/* ========================== */}
      {/* ⚙️ Footer Links */}
      {/* ========================== */}
      <div className="font-mono bg-teal-800/20 backdrop-blur-sm rounded-lg p-3 border border-teal-400/20 text-center mt-3 space-y-2">
        <div className="flex justify-center gap-3">
          <a
            href="https://buymeacoffee.com/sattrack"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl transition-transform hover:scale-110"
            title="Support SatTrack"
          >
            💙
          </a>

          <a
            onClick={() => onOpenContact?.()}
            className="text-2xl transition-transform hover:scale-110 cursor-pointer"
            title="Contact / Get Updates"
          >
            📬
          </a>

          <a
            onClick={onOpenPromo}
            className="text-xl hover:scale-110 transition-transform cursor-pointer"
            title="Showcase your satellite"
          >
            💡
          </a>

          <a
            onClick={() => alert("Supporters orbit coming soon!")}
            className="text-2xl transition-transform hover:scale-110 cursor-pointer"
            title="Supporters Orbit"
          >
            👩‍🚀
          </a>

          <a
            onClick={onOpenSettings}
            className="text-2xl transition-transform hover:scale-110 cursor-pointer"
            title="Settings"
          >
            ⚙️
          </a>
        </div>
      </div>
    </div>
  );
}
