/**
 * This file is part of the SatTrack project, submitted for academic purposes only.
 * It is intended solely for evaluation in an educational context.
 */

import { SlidePanel } from "@/components/RightSideBar/slidepanel";

// ==========================
// ☁️ CloudPanel Props
// ==========================

interface CloudPanelProps {
  isOpen: boolean;
  onClose: () => void;
  groundStation?: { lat: number; lon: number; name: string };
}

// ==========================
// ☁️ CloudPanel Component
// ==========================

/**
 * Displays a weather overlay panel with live cloud and radar data.
 * Uses RainViewer API, centered around the selected ground station.
 */
export function CloudPanel({ isOpen, onClose, groundStation }: CloudPanelProps) {
  // Fallback to Darmstadt if no station selected
  const lat = groundStation?.lat ?? 49.8728;
  const lon = groundStation?.lon ?? 8.6512;
  const locationName = groundStation?.name ?? "Darmstadt";

  // RainViewer iframe URL with clouds & radar layers
  const iframeSrc = `https://www.rainviewer.com/map.html?loc=${lat.toFixed(
    4
  )},${lon.toFixed(
    4
  )},6&layer=radar,clouds,satellite&c=3&o=83&oCS=1&lm=1&sm=1&sn=1&ts=2&menu=0`;

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="☁️ Cloud Radar Map"
      position="right-center"
    >
      {/* ℹ️ Info text + tooltip */}
      <div className="text-xs mb-2 font-mono text-white flex items-center gap-1">
        Weather view centered on: <span className="text-teal-300">{locationName}</span>
        <div className="relative group">
          <span className="cursor-pointer text-teal-300">ℹ️</span>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-[11px] font-mono text-white bg-black/80 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Track precipitation with Rain Viewer's live radar map, updated every 10 minutes via NOAA, EUMETNET, and 1000+ global radar sources. Monitor rain, snow, and storms in real-time worldwide.
            <hr className="my-1 border-white/20" />
            Data source:&nbsp;
            <a
              href="https://www.rainviewer.com/api.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-300 underline"
            >
              RainViewer API
            </a>
          </div>
        </div>
      </div>

      {/* 🌍 Embedded Map */}
      <div className="relative w-full h-72 overflow-hidden rounded-lg border border-white/20">
        <iframe
          src={iframeSrc}
          width="100%"
          height="135%"
          style={{
            border: "0",
            marginTop: "-23%", // centers the map better visually
            borderRadius: "0.5rem",
          }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </SlidePanel>
  );
}
