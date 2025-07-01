import type { RefObject } from "react";
import type { Viewer } from "cesium";
import { useState } from "react";
import SearchBar from "./SearchBar";
import CollectionsPanel from "./Collections/CollectionsPanel";
import { GroundStationPanel } from "./GroundStationPanel/GroundStationPanel";

type SidebarProps = {
  onSearch: (query: string) => void;
  satelliteNames: string[];
  viewerRef: RefObject<Viewer | null>;
  ongroundStationChange?: (location: { lat: number; lon: number; name: string } | null) => void;
};

export default function Sidebar({ onSearch, satelliteNames, viewerRef, ongroundStationChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [groundStationActive, setGroundStationActive] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);

  return (
    <>
      {/* Static Sidebar */}
      {!collapsed && (
        <div className="fixed top-0 left-0 w-80 h-full z-50 bg-teal-900/10 backdrop-blur border-r border-teal-400/30 text-teal-400 font-mono flex flex-col shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative flex items-center justify-center px-4 py-3 border-b !border-teal-400/20 !bg-transparent">
            {/* ❌ Close Button — right corner, customizable */}
            <button
              onClick={() => setCollapsed(true)}
              className="absolute !right-3 !top-3 !p-0 !m-0 !border-none !bg-transparent 
                        text-2xl font-normal leading-none text-white select-none 
                        hover:scale-110 transition-transform duration-200"
              title="Close Sidebar"
            >
              ✖️
            </button>

              <div className="flex items-center gap-2 text-white font-mono text-3xl select-none -ml-2 relative">
                {/* 🛰️ Tooltip Trigger */}
                <div className="relative group">
                  <span className="animate-pulse text-xl relative top-0.5 cursor-help">🛰️</span>

                  {/* Tooltip */}
                  <div className="absolute top-full left-0 -translate-x-4 mt-2 z-50 hidden group-hover:block bg-black/90 text-white text-xs p-3 rounded-md shadow-lg border border-white/20 w-64">
                    <p><strong>Credits:</strong></p>
                    <ul className="list-disc pl-4">
                      <li>
                        🌐 <a href="https://cesium.com/ion/" target="_blank" rel="noopener noreferrer" className="underline text-cyan-300">Cesium Ion</a> — Globe rendering
                      </li>
                      <li>
                        📡 <a href="https://celestrak.org" target="_blank" rel="noopener noreferrer" className="underline text-cyan-300">CelesTrak</a> — TLEs & NORAD data
                      </li>
                    </ul>
                    <p className="mt-2 text-amber-200">
                      ⚠️ This site is new — some data might be inconsistent, and lots of cool features are coming soon!
                    </p>
                  </div>
                </div>

                {/* SatTrack™ Title */}
                <span>
                  SatTrack<span className="text-base align-super ml-1">™</span>
                </span>
              </div>


              </div>



          

          {/* Body */}
          <div className="flex flex-col gap-4 p-4 overflow-y-auto">
            <div className="bg-teal-900/30 border border-teal-400/20 backdrop-blur-sm rounded-xl p-3 shadow-sm w-full font-mono text-teal-400">
              <SearchBar onSearch={onSearch} suggestions={satelliteNames} />
            </div>

            <div className="bg-teal-900/30 border border-teal-400/20 backdrop-blur-sm rounded-xl p-3 shadow-sm w-full font-mono text-teal-400">
              <GroundStationPanel
                viewerRef={viewerRef}
                onGroundStationChange={ongroundStationChange}
                groundStationActive={groundStationActive}
                setGroundStationActive={setGroundStationActive}
                userLocation={userLocation}
                setUserLocation={setUserLocation}
              />

            </div>

            <div className="bg-teal-900/30 border border-teal-400/20 backdrop-blur-sm rounded-xl p-4 shadow-sm w-full max-h-[70vh] overflow-y-auto font-mono text-teal-400">
              <CollectionsPanel />
            </div>
          </div>
        </div>
      )}

      {/* Expand Button */}
      {collapsed && (
        <div className="fixed top-4 left-5 z-50">
          <div className="relative rounded-xl p-1 bg-teal-400/5 backdrop-blur-sm border border-teal-400/20 shadow-inner">
            {/* Ping Animation */}
            <span className="absolute inset-0 rounded-full bg-teal-400/10 animate-ping" />

            {/* Expand Button */}
            <button
              onClick={() => setCollapsed(false)}
              className="relative p-2 rounded-full border !border-teal-400/20 
                         !bg-teal-400/10 backdrop-blur-md !text-teal-300 font-mono text-xl 
                         shadow-md hover:scale-110 transition-transform duration-200"
              title="Expand Sidebar"
            >
              📡
            </button>
          </div>
        </div>
      )}
    </>
  );
}
