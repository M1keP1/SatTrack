import { SlidePanel } from "@/components/RightSideBar/slidepanel";

interface CloudPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CloudPanel({ isOpen, onClose }: CloudPanelProps) {
  return (
    <SlidePanel
    isOpen={isOpen}
    onClose={onClose}
    title="Cloud Coverage"
    position="right-center"
    >
    <p className="text-xs">☁️ Cloud radar coming soon</p>
    </SlidePanel>

  );
}
