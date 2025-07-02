/**
 * This file is part of the SatTrack project, submitted for academic purposes only.
 * It is intended solely for evaluation in an educational context.
 */

import { useEffect } from "react";
import { SlidePanel } from "@/components/RightSideBar/slidepanel";

// ==========================
// 💡 Props
// ==========================

type IdeaPanelProps = {
  onClose: () => void;
  onOpenContact: () => void;
  onOpenEffect?: () => void;
};

// ==========================
// 💡 IdeaPanel Component
// ==========================

/**
 * Displays promotional options for users to showcase their satellite
 * missions via subdomains, embeds, or public pages.
 */
export default function IdeaPanel({ onClose, onOpenContact, onOpenEffect }: IdeaPanelProps) {
  // Play entry animation or call effect
  useEffect(() => {
    onOpenEffect?.();
  }, []);

  return (
    <SlidePanel isOpen={true} onClose={onClose} title="💡 Showcase Ideas" position="center">
      <div className="space-y-4 text-white text-sm font-mono">
        {/* Intro */}
        <p className="text-teal-300/80">
          🚀 Dreaming of showcasing your satellite project?
        </p>

        {/* Feature List */}
        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="text-cyan-400">Get a custom subdomain</span> like:
            <span className="italic"> yoursat.SatTrack.app</span>
          </li>
          <li>
            <span className="text-emerald-400">Embed live widgets</span> of your satellite into your own website.
          </li>
          <li>
            <span className="text-amber-400">Create a public mission page</span> with TLEs, visuals, and info.
          </li>
          <li>
            <span className="text-pink-400">Get support for club or academic demos</span>.
          </li>
        </ul>

        {/* Description */}
        <p className="text-xs text-teal-300/60 italic">
          Perfect for student teams, researchers, or commercial payloads wanting a quick and beautiful presence.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => {
            onClose();         // Close current panel
            onOpenContact();   // Open contact form
          }}
          className="w-full !bg-teal-600/30 !hover:bg-teal-600/50 transition-colors border border-teal-400/30 rounded py-2 font-bold"
        >
          📬 Contact Me
        </button>
      </div>
    </SlidePanel>
  );
}
