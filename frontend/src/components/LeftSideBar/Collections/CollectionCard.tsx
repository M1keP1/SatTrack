import { FaFolder } from "react-icons/fa";

type CollectionCardProps = {
  name: string;
  count: number;
  onClick: () => void;
  active?: boolean;
};

export default function CollectionCard({ name, count, onClick, active }: CollectionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between w-full px-3 py-1.5 rounded-md cursor-pointer transition text-sm
        ${active ? "bg-cyan-600/40" : "hover:bg-white/10"}
      `}
    >
      <div className="flex items-center gap-2 text-white">
        <FaFolder className="text-yellow-400 text-xs" />
        <span className="leading-none">{name}</span>
      </div>

      <span className="text-xs text-white bg-white/10 px-2 py-0.5 rounded-full font-semibold">
        {count}
      </span>
    </div>
  );
}
