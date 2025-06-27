import { SlidePanel } from "@/components/RightSideBar/slidepanel";

interface SkyglowPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

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
          If you know how to access or process sky brightness datasets (e.g. World Atlas, VIIRS), please reach out!
        </p>
        <p className="mt-2 text-teal-300 underline cursor-pointer">
          
        </p>
      </div>
    </SlidePanel>
  );
}
