import { motion } from "framer-motion";

interface SlidePanelProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  position?: "center" | "left-center" | "right-center";
}

export function SlidePanel({
  isOpen,
  title,
  onClose,
  children,
  position = "center",
}: SlidePanelProps) {
  const positionClass = {
    "center": "left-1/2 -translate-x-1/2",
    "left-center": "left-1/3 -translate-x-1/2",
    "right-center": "left-2/3 -translate-x-1/2",
  }[position];

  return (
    <motion.div
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: isOpen ? 0 : 300, opacity: isOpen ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className={`fixed bottom-6 transform ${positionClass} w-96 z-50
        bg-teal-900/30 backdrop-blur-xl border border-teal-400/30
        rounded-2xl p-4 shadow-2xl`}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-white text-center w-full">{title}</h2>
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-white text-sm leading-none p-0 m-0 bg-transparent border-none shadow-none outline-none hover:text-teal-300 focus:outline-none"
            style={{
              background: "none",
              border: "none",
              boxShadow: "none",
            }}
          >
            ✕
          </button>

      </div>

      {/* 👇 Non-scrollable content */}
      <div className="text-sm text-white text-center">
        {children}
      </div>
    </motion.div>
  );
}
