import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { SatelliteInfoPanel } from "./satellite-info-panel";
import { AIChatComponent } from "./ai-chat-component";
import { useSatelliteDetails } from "@/hooks/useSatelliteDetails";

interface ModularInfoSidebarProps {
  selectedNoradId: string | null;
  onExpandedChange?: (expanded: boolean) => void;
}

export function ModularInfoSidebar({ selectedNoradId }: ModularInfoSidebarProps) {
  const [aiExpanded, setAiExpanded] = useState(false);
console.log("ModularInfoSidebar received:", selectedNoradId);
const satellite = useSatelliteDetails(selectedNoradId);


  const handleAiToggle = () => {
    setAiExpanded(true);
  };

  const handleAiClose = () => {
    setAiExpanded(false);
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-72 bg-teal-900/20 backdrop-blur-xl border-l border-teal-400/30 text-white flex flex-col z-50 overflow-hidden">
      {aiExpanded ? (
        <AIChatComponent 
           
          onClose={handleAiClose} 
        />
      ) : (
        <div className="flex flex-col h-full transition-all duration-300 ease-out">
          {/* AI Toggle Button at Top */}
          <div className="p-4 border-b border-teal-400/20 flex-shrink-0">
            <Button
              onClick={handleAiToggle}
              className="w-full bg-teal-600/30 backdrop-blur-sm border border-teal-400/30 rounded-lg p-3 text-sm text-white hover:bg-teal-600/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-400/20 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Ask AI Assistant
            </Button>
          </div>

          {/* Satellite Info Panel */}
          <div className="flex-1 p-4 flex flex-col min-h-0">
            <SatelliteInfoPanel selectedSatellite={satellite ? { ...satellite, noradId: Number(satellite.noradId) } : null} />
          </div>
        </div>
      )}
    </div>
  );
}