/**
 * @file CollectionCard.tsx
 * @description UI component for rendering a clickable satellite collection card inside the sidebar.
 * Each card displays the collection name, satellite count, and active state styling.
 * 
 */

import type { IconType } from "react-icons";

// ==========================
// 📦 Props
// ==========================

/**
 * Props for the CollectionCard component.
 * 
 * @property {string} name - Name of the satellite collection
 * @property {number} count - Number of satellites in the collection
 * @property {() => void} onClick - Callback when card is clicked
 * @property {boolean} [active] - Whether the card is currently selected
 * @property {IconType} [icon] - Optional icon component (currently unused)
 */
type CollectionCardProps = {
  name: string;
  count: number;
  onClick: () => void;
  active?: boolean;
  icon?: IconType;
};

// ==========================
// 🧩 Component
// ==========================

/**
 * CollectionCard component
 * Renders a collection item with a name and count badge. Highlights if active.
 */
export default function CollectionCard({
  name,
  count,
  onClick,
  active,
}: CollectionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between w-full px-3 py-2 rounded-md cursor-pointer transition text-sm
        ${active ? "bg-cyan-700 text-white" : "hover:bg-white/10 text-white/90"}
      `}
    >
      {/* Collection name and optional icon */}
      <div className="flex items-center gap-2">
        {/* TODO: Add icon support in future if needed */}
        <span className="capitalize">{name}</span>
      </div>

      {/* Satellite count badge */}
      <span className="text-[11px] bg-white/10 text-white px-2 py-[2px] rounded-full font-semibold">
        {count}
      </span>
    </div>
  );
}
