import type { RefObject } from "react";
import type { Viewer } from "cesium";
import { useState } from "react";
import SearchBar from "./SearchBar";
import { FiChevronLeft } from "react-icons/fi";
import { FaSatellite } from "react-icons/fa";
import CollectionsPanel from "./Collections/CollectionsPanel";
import { GroundStationPanel } from "./GroundStationPanel/GroundStationPanel";

type SidebarProps = {
  onSearch: (query: string) => void;
  satelliteNames: string[];
  viewerRef: RefObject<Viewer | null>;
};

export default function Sidebar({ onSearch, satelliteNames, viewerRef }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Expanded Sidebar */}
      {!collapsed && (
        <div className="fixed top-0 left-0 w-72 h-full z-50 bg-cyan-900/30 backdrop-blur-md text-white shadow-xl flex flex-col transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2 font-bold text-lg">
              <FaSatellite />
              <span>SatTrack</span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="text-white/80 hover:text-white"
            >
              <FiChevronLeft size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4 p-4 overflow-y-auto">
            <SearchBar onSearch={onSearch} suggestions={satelliteNames} />
            <GroundStationPanel viewerRef={viewerRef} />
            
            {/* Collections Panel */}
            <div className="bg-cyan-700/20 border border-cyan-300/20 backdrop-blur-sm rounded-xl p-4 shadow-sm w-full max-h-[70vh] overflow-y-auto">
              <CollectionsPanel />
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Floating Button */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed top-4 left-2 z-50 p-2 rounded-full shadow-md
                     bg-cyan-800/30 backdrop-blur-md border border-cyan-300/20
                     text-white hover:bg-cyan-600/40 transition"
        >
          <FaSatellite size={18} />
        </button>
      )}
    </>
  );
}
