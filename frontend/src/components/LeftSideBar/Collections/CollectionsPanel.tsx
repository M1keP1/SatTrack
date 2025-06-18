import { useState } from "react";
import CollectionCard from "./CollectionCard";
import { useCollectionFiles } from "../../../hooks/useCollectionFiles";
import { setActiveTleFile } from "../../../services/activeCollection";
import { FaCloudSun, FaBroadcastTower, FaSatellite, FaGlobe, FaFolder } from "react-icons/fa";
import toast from "react-hot-toast";

export default function CollectionsPanel() {
  const collections = useCollectionFiles();
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const handleClick = (filePath: string, name: string, count?: number) => {
    setActiveTleFile(filePath);
    setActiveFile(filePath);
    toast.success(`📡 Switched to ${name} (${count} satellites)`);
  };

  // Helper to determine icon based on name
  const getIconForName = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("weather")) return FaCloudSun;
    if (lower.includes("comms") || lower.includes("communication")) return FaBroadcastTower;
    if (lower.includes("esa") || lower.includes("disaster") || lower.includes("station")) return FaSatellite;
    if (lower.includes("global") || lower.includes("earth")) return FaGlobe;
    return FaFolder;
  };

  return (
    <div className="flex flex-col gap-1 mt-2">
      {collections.map((col) => {
        const filePath = `/data/collections/${col.file}`;
        const Icon = getIconForName(col.name);
        return (
          <CollectionCard
            key={col.file}
            name={col.name}
            count={col.count}
            onClick={() => handleClick(filePath, col.name, col.count)}
            active={activeFile === filePath}
            icon={Icon}
          />
        );
      })}
    </div>
  );
}
