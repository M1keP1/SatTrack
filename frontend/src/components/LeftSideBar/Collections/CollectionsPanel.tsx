import { useState } from "react";
import CollectionCard from "./CollectionCard";
import { useCollectionFiles } from "../../../hooks/useCollectionFiles";
import { setActiveTleFile } from "../../../services/activeCollection";
import { toast } from "react-hot-toast";
import {
  FaCloudSun,
  FaBroadcastTower,
  FaSatellite,
  FaGlobe,
  FaFolder,
  FaGlobeEurope,
} from "react-icons/fa";

export default function CollectionsPanel() {
  const collections = useCollectionFiles();
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const handleClick = (filePath: string, name: string, count?: number) => {
    setActiveTleFile(filePath);
    setActiveFile(filePath);
    toast.success(`📡 Switched to ${name} (${count} satellites)`);
  };

  const getIconForName = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("weather")) return FaCloudSun;
    if (lower.includes("comms") || lower.includes("communication")) return FaBroadcastTower;
    if (lower.includes("esa") || lower.includes("station") || lower.includes("iss")) return FaSatellite;
    if (lower.includes("earth") || lower.includes("global")) return FaGlobe;
    return FaFolder;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-sm w-full max-h-[80vh] overflow-y-auto">
      {/* 🌐 Collections header */}
      <div className="flex items-center justify-between text-white text-sm mb-4">
        <div className="flex items-center gap-2 font-semibold">
          <FaGlobeEurope className="text-cyan-400" />
          <span>Collections</span>
        </div>
        <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full font-medium">
          99+
        </span>
      </div>

      {/* 🛰️ Collection list */}
      <div className="flex flex-col gap-1">
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
    </div>
  );
}
