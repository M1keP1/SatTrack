/**
 * This file is part of the SatTrack project, submitted for academic purposes only.
 * It is intended solely for evaluation in an educational context.
 */

import { SlidePanel } from "@/components/RightSideBar/slidepanel";
import { useEffect, useState } from "react";
import { useToasterStore } from "react-hot-toast";

// ==========================
// 🛠️ SettingsPanel Component
// ==========================

/**
 * Displays toggle options for visual and audio settings.
 * Automatically closes when a toast appears (after a toggle).
 * Currently all toggles are placeholders for future implementation.
 */
export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { toasts } = useToasterStore();
  const [isClosing, setIsClosing] = useState(false);

  // ==========================
  // ⏳ Auto-Close Logic
  // ==========================

  useEffect(() => {
    const isToastVisible = toasts.some((t) => t.visible);
    if (isToastVisible && !isClosing) {
      setIsClosing(true);
      setTimeout(() => onClose(), 250); // small delay for fade-out animation
    }
  }, [toasts]);

  // ==========================
  // 🧱 Render Panel
  // ==========================

  return (
    <div
      className={`transition-all duration-300 ${
        isClosing ? "opacity-0 -translate-y-3 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      <SlidePanel
        isOpen={true}
        onClose={() => {
          setIsClosing(true);
          setTimeout(() => onClose(), 250);
        }}
        title="🛠️ Settings"
        position="top-center"
      >
        {/* Settings Placeholder */}
        <div className="pt-4 space-y-4 mt-1 font-mono text-white text-sm">
          {[
            "Satellite Trails",
            "Satellite Orbits",
            "Coverage Circles",
            "Sound Effects",
            "Display All Names",
          ].map((label) => (
            <div key={label} className="flex items-center justify-between">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  disabled
                  className="w-4 h-4 text-teal-400 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
                />
                <span>{label}</span>
              </label>
              <span className="text-xs text-gray-400 italic">Coming soon</span>
            </div>
          ))}
        </div>
      </SlidePanel>
    </div>
  );
}
