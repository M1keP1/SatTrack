import { useState, useEffect } from "react";
import "./SearchBar.css";
import toast from "react-hot-toast";

type SearchBarProps = {
  onSearch: (query: string) => void;
  suggestions: string[];
};

export default function SearchBar({ onSearch, suggestions }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [matched, setMatched] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const [manualInput, setManualInput] = useState(true); // Track if user typed or tabbed

  useEffect(() => {
    if (query.startsWith("/")) {
      const term = query.slice(1).toLowerCase();
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(term)
      );
      setMatched(filtered);
      setSelectedIndex(0);
    } else {
      setMatched([]);
      setSelectedIndex(0);
    }
  }, [query, suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = query.trim();
    console.log("🔍 [Submit] Query entered:", trimmed);

    if (trimmed.startsWith("/")) {
      const name = trimmed.slice(1).trim();
      const exact = suggestions.find(
        (s) => s.toLowerCase() === name.toLowerCase()
      );

      if (exact) {
        const formattedQuery = `/${exact}`;
        console.log("✅ [Submit] Found exact match:", exact);
        onSearch(formattedQuery);
        toast.success(`🛰️ Tracking ${exact}`);
      } else {
        console.warn("❌ [Submit] No satellite match found for:", name);
        setInvalid(true);
        toast.error("Satellite not found");
        setTimeout(() => setInvalid(false), 700);
      }
    } else {
      console.log("🌍 [Submit] Falling back to geocode:", trimmed);
      onSearch(trimmed);
    }

    setQuery("");
    setMatched([]);
    setSelectedIndex(0);
  };

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

  const handleSuggestionClick = (satName: string) => {
    const fullQuery = `/${satName}`;
    console.log("🖱️ [Click] Suggestion clicked:", satName);
    setQuery("");
    setMatched([]);
    setSelectedIndex(0);
    onSearch(fullQuery);
    toast.success(`🛰️ Tracking ${satName}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className={`search-input ${invalid ? "shake-error" : ""}`}
        type="text"
        placeholder="Search /ISS or Darmstadt"
        value={
          matched.length > 0 && !manualInput
            ? `/${matched[selectedIndex]}`
            : query
        }
        onChange={(e) => {
          setQuery(e.target.value);
          setManualInput(true);
        }}
        onKeyDown={handleKeyDown}
      />
      {matched.length > 0 && (
        <ul className="suggestions-list">
          {matched.map((s, i) => (
            <li
              key={s}
              className={i === selectedIndex ? "selected" : ""}
              onClick={() => handleSuggestionClick(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
