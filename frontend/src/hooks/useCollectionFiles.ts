import { useEffect, useState } from "react";
import { parseTleText } from "../utils/tleParser";

type CollectionInfo = {
  name: string;
  file: string;
  count: number;
};

export function useCollectionFiles() {
  const [collections, setCollections] = useState<CollectionInfo[]>([]);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const res = await fetch("/data/collections/index.json", { cache: "no-store" });
        const files: string[] = await res.json();
        console.log("📦 Found collection index:", files);

        const loaded: CollectionInfo[] = await Promise.all(
          files.map(async (file) => {
            try {
              const tleRes = await fetch(`/data/collections/${file}`, { cache: "no-store" });
              const text = await tleRes.text();
              const tles = parseTleText(text);
              console.log(`✅ Loaded ${tles.length} TLEs from ${file}`);

              return {
                name: file.replace(".txt", "").replace(/[-_]/g, " "),
                file,
                count: tles.length,
              };
            } catch (err) {
              console.warn(`⚠️ Failed to load ${file}`, err);
              return {
                name: file.replace(".txt", ""),
                file,
                count: 0,
              };
            }
          })
        );

        setCollections(loaded);
      } catch (err) {
        console.error("❌ Failed to load index.json for collections", err);
      }
    };

    loadCollections();
  }, []);

  return collections;
}
