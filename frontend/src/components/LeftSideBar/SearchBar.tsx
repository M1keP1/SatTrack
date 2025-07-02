/**
 * This file is part of the SatTrack project, submitted for academic purposes only.
 * It is intended solely for evaluation in an educational context.
 */

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";

// ==========================
// 📦 Props
// ==========================

type SearchBarProps = {
  onSearch: (query: string) => void;
  suggestions: string[];
  onSubmitDone?: () => void;
};

// ==========================
// 🔍 SearchBar Component
// ==========================

/**
 * Smart satellite search bar with keyboard/autocomplete suggestions
 * using fuzzy search (Fuse.js) and animated dropdown.
 */
export default function SearchBar({
  onSearch,
  suggestions,
  onSubmitDone,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [matched, setMatched] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [manualInput, setManualInput] = useState(true);

  // ==========================
  // 🔍 Update Matches on Query Change
  // ==========================

  useEffect(() => {
    const term = query.trim().toLowerCase();
    if (term !== "" && !query.startsWith("/")) {
      const fuse = new Fuse(suggestions, {
        includeScore: true,
        threshold: 0.4,
      });

      const results = fuse.search(term);
      const sorted = results
        .sort((a, b) => a.score! - b.score!)
        .map((r) => r.item);

      setMatched(sorted);
    } else {
      setMatched([]);
    }

    setSelectedIndex(0);
  }, [query, suggestions]);

  // ==========================
  // ⌨️ Handle Search Submission
  // ==========================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const finalQuery =
      !manualInput && matched.length > 0
        ? matched[selectedIndex]
        : trimmed;

    onSearch(finalQuery);
    onSubmitDone?.();
    setQuery("");
    setMatched([]);
    setSelectedIndex(0);
  };

  // ==========================
  // ⌨️ Handle Keyboard Navigation
  // ==========================

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (matched.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % matched.length);
      setManualInput(false);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? matched.length - 1 : prev - 1
      );
      setManualInput(false);
    } else if (e.key === "Tab") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        e.shiftKey
          ? (prev - 1 + matched.length) % matched.length
          : (prev + 1) % matched.length
      );
      setManualInput(false);
    } else if (e.key === "Enter") {
      handleSubmit(e);
    } else {
      setManualInput(true);
    }
  };

  // ==========================
  // 🖱️ Handle Suggestion Click
  // ==========================

  const handleSuggestionClick = (satName: string) => {
    onSearch(satName);
    onSubmitDone?.();
    setQuery("");
    setMatched([]);
    setSelectedIndex(0);
  };

  // ==========================
  // ✨ Highlight Matching Text
  // ==========================

  const highlightMatch = (text: string) => {
    const input = query.trim().toLowerCase();
    if (!input) return text;

    const index = text.toLowerCase().indexOf(input);
    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + input.length);
    const after = text.slice(index + input.length);

    return (
      <>
        {before}
        <span className="text-teal-300 font-bold">{match}</span>
        {after}
      </>
    );
  };

  // ==========================
  // 🧱 Render
  // ==========================

  return (
    <form onSubmit={handleSubmit} className="relative z-10 w-full">
      <div className="w-full transition-all duration-300 ease-in-out">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
          <input
            type="text"
            placeholder="Search for satellites..."
            value={
              matched.length > 0 && !manualInput
                ? matched[selectedIndex]
                : query
            }
            onChange={(e) => {
              setQuery(e.target.value);
              setManualInput(true);
            }}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg text-sm bg-white/10 text-white placeholder-white/70 outline-none border border-white/10 focus:border-teal-300 transition-all duration-200"
          />
        </div>

        {/* Autocomplete Dropdown */}
        <AnimatePresence>
          {matched.length > 0 && query.trim() !== "" && !query.startsWith("/") && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, scaleY: 0.8 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.8 }}
              transition={{ duration: 0.2 }}
              className="mt-2 origin-top"
            >
              <ul className="bg-cyan-900/80 backdrop-blur-md text-white rounded-lg shadow-md border border-white/10 text-sm max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                {matched.map((s, i) => (
                  <li
                    key={s}
                    className={`px-3 py-1.5 cursor-pointer transition-colors ${
                      i === selectedIndex
                        ? "bg-teal-600/30 font-semibold"
                        : "hover:bg-white/10"
                    }`}
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {highlightMatch(s)}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
