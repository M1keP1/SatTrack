import { useEffect } from "react";
import { SlidePanel } from "@/components/RightSideBar/slidepanel";

type IdeaPanelProps = {
  onClose: () => void;
  onOpenContact: () => void;
  onOpenEffect?: () => void;
};

export default function IdeaPanel({ onClose, onOpenContact, onOpenEffect }: IdeaPanelProps) {
  useEffect(() => {
    onOpenEffect?.();
  }, []);

  return (
    <SlidePanel isOpen={true} onClose={onClose} title="💡 Showcase Ideas" position="center">
      <div className="space-y-4 text-white text-sm font-mono">
        <p className="text-teal-300/80">
          🚀 Dreaming of showcasing your satellite project?
        </p>

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

        <p className="text-xs text-teal-300/60 italic">
          Perfect for student teams, researchers, or commercial payloads wanting a quick and beautiful presence.
        </p>

        <button
          onClick={() => {
            onClose();
            onOpenContact();
          }}
          className="w-full !bg-teal-600/30 !hover:bg-teal-600/50 transition-colors border border-teal-400/30 rounded py-2 font-bold"
        >
          📬 Contact Me
        </button>
      </div>
    </SlidePanel>
  );
}
