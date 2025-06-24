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
    title="Skyglow"
    position="left-center"
    >
    <p className="text-xs">🌌 Sky brightness data coming soon</p>
    </SlidePanel>

  );
}
