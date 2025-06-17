// components/LeftSidebar/CollectionsPanel.tsx
import CollectionCard from "./CollectionCard";
import { useCollectionFiles } from "../../../hooks/useCollectionFiles";
import { setActiveTleFile } from "../../../services/activeCollection";
import toast from "react-hot-toast";

export default function CollectionsPanel() {
  const collections = useCollectionFiles();

  return (
    <div className="flex flex-col gap-1 mt-2">
      {collections.map((col) => (
        <CollectionCard
          key={col.file}
          name={col.name}
          count={col.count}
          onClick={() => {
            const filePath = `/data/collections/${col.file}`;
            setActiveTleFile(filePath);
            toast.success(`📡 Switched to ${col.name} (${col.count} satellites)`);
          }}
        />
      ))}
    </div>
  );
}
