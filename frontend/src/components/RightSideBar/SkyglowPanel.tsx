/**
 * This file is part of the SatTrack project, submitted for academic purposes only.
 * It is intended solely for evaluation in an educational context.
 */

import { SlidePanel } from "@/components/RightSideBar/slidepanel";

// ==========================
// 🌌 Props
// ==========================

interface SkyglowPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ==========================
// 🌌 SkyglowPanel Component
// ==========================

/**
 * Displays a placeholder for upcoming sky brightness overlay features.
 * Meant to support integration of datasets like VIIRS or World Atlas.
 */
export function SkyglowPanel({ isOpen, onClose }: SkyglowPanelProps) {
  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="🌌 Skyglow Map"
      position="left-center"
    >
      <div className="text-sm font-mono text-white text-center px-2">
        <p className="mb-2">🚧 Skyglow data integration is coming soon.</p>
        <p>
          If you know how to access or process sky brightness datasets
          (e.g. World Atlas, VIIRS), please reach out!
        </p>
        
        {/* Placeholder for future call-to-action or contact link */}
        <p className="mt-2 text-teal-300 underline cursor-pointer">
          {/* Contact link can be inserted here */}
        </p>
      </div>
    </SlidePanel>
  );
}
