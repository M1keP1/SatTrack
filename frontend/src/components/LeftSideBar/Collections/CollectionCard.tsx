import type { IconType } from "react-icons";

type CollectionCardProps = {
  name: string;
  count: number;
  onClick: () => void;
  active?: boolean;
  icon?: IconType; // optional icon component
};

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
    <div className="flex items-center gap-2">
      <span className="capitalize">{name}</span>
    </div>

    <span className="text-[11px] bg-white/10 text-white px-2 py-[2px] rounded-full font-semibold">
      {count}
    </span>
  </div>

  );
}
