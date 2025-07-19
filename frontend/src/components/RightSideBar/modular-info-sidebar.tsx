/**
 * This file is part of the SatTrack project, submitted for academic purposes only.
 * It is intended solely for evaluation in an educational context.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { SatelliteInfoPanel } from "./satellite-info-panel";
import { AIChatComponent } from "./ai-chat-component";
import { useSatelliteDetails } from "@/hooks/useSatelliteDetails";

// ==========================
// 📦 Props
// ==========================

interface ModularInfoSidebarProps {
  selectedNoradId: string | null;
  onExpandedChange?: (expanded: boolean) => void;
  tle?: { line1: string; line2: string } | null;
  groundStation?: { lat: number; lon: number; name: string } | null;
  isGroundStationEnabled?: boolean;
  onOpenSkyglow?: () => void;
  onOpenCloud?: () => void;
  onOpenSettings?: () => void;
  onOpenContact?: () => void;
  onOpenPromo?: () => void;
}

// ==========================
// 📘 ModularInfoSidebar Component
// ==========================

/**
 * Sidebar showing satellite details and an optional AI chat panel.
 * Expands to 36rem when AI is active, otherwise stays compact.
 */
export function ModularInfoSidebar({
  selectedNoradId,
  tle,
  groundStation,
  isGroundStationEnabled,
  onOpenSkyglow,
  onOpenCloud,
  onOpenSettings,
  onOpenContact,
  onOpenPromo,
}: ModularInfoSidebarProps) {
  const [aiExpanded, setAiExpanded] = useState(false);
  const satellite = useSatelliteDetails(selectedNoradId);

  // Toggle AI panel visibility
  const handleAiToggle = () => setAiExpanded(true);
  const handleAiClose = () => setAiExpanded(false);

  // ==========================
  // 🧱 Render
  // ==========================

  return (
    <div
      className={`fixed right-0 top-0 bottom-0 ${
        aiExpanded ? "w-[36rem]" : "w-72"
      } bg-teal-900/20 backdrop-blur border-l border-teal-400/30 text-white flex flex-col z-100 overflow-hidden transition-all duration-300`}
    >
      {aiExpanded ? (
        // 🤖 AI Assistant Panel
        <AIChatComponent onClose={handleAiClose} />
      ) : (
        // 🛰️ Default Satellite Info View
        <div className="flex flex-col h-full transition-all duration-300 ease-out">
          
          {/* Ask AI Button */}
          <div className="p-4 border-b border-teal-400/20 flex-shrink-0">
            <Button
              onClick={handleAiToggle}
              className="w-full !bg-teal-600/30 backdrop-blur-sm border border-teal-400/30 rounded-lg p-3 text-sm text-white hover:bg-teal-600/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-400/20 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Ask AI Agent
            </Button>
          </div>

          {/* Satellite Information */}
          <div className="flex-1 p-4 overflow-y-auto">
            <SatelliteInfoPanel
              selectedSatellite={
                satellite
                  ? { ...satellite, noradId: Number(satellite.noradId) }
                  : null
              }
              tle={tle ?? null}
              groundStation={
                groundStation
                  ? { lat: groundStation.lat, lon: groundStation.lon, alt: 0 }
                  : null
              }
              isGroundStationEnabled={isGroundStationEnabled ?? false}
              onOpenSkyglow={onOpenSkyglow ?? (() => {})}
              onOpenCloud={onOpenCloud ?? (() => {})}
              onOpenSettings={onOpenSettings}
              onOpenContact={onOpenContact}
              onOpenPromo={onOpenPromo}
            />
          </div>
        </div>
      )}
    </div>
  );
}
