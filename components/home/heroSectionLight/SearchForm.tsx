import { FormEvent, useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

const PLACEHOLDERS = [
  "How have global surface temperature anomalies trended since 1880?",
  "What is the latest rise in atmospheric CO2 ppm recorded at Mauna Loa?",
  "How do national fossil CO2 emissions compare for the past five years?",
  "What is the incidence rate of COVID-19 per 100k in Finnish healthcare districts?",
  "Show projected global population growth through 2100.",
  "How has spending on pharmaceuticals shifted over the last five years?",
  "What is the historical cost trend for genome sequencing per megabase?",
];

const TYPING_SPEED = 45;
const DELETING_SPEED = 25;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 400;

const SearchForm: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const indexRef = useRef(0);
  const charRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFocusedRef = useRef(false);

  useEffect(() => {
    isFocusedRef.current = isFocused;
  }, [isFocused]);

  useEffect(() => {
    const tick = (phase: "typing" | "pausing" | "deleting" | "waiting") => {
      if (isFocusedRef.current) {
        timeoutRef.current = setTimeout(() => tick(phase), 200);
        return;
      }

      const current = PLACEHOLDERS[indexRef.current];

      if (phase === "typing") {
        charRef.current += 1;
        setPlaceholder(current.slice(0, charRef.current));
        if (charRef.current < current.length) {
          timeoutRef.current = setTimeout(() => tick("typing"), TYPING_SPEED);
        } else {
          timeoutRef.current = setTimeout(() => tick("deleting"), PAUSE_AFTER_TYPE);
        }
      } else if (phase === "deleting") {
        charRef.current -= 1;
        setPlaceholder(current.slice(0, charRef.current));
        if (charRef.current > 0) {
          timeoutRef.current = setTimeout(() => tick("deleting"), DELETING_SPEED);
        } else {
          indexRef.current = (indexRef.current + 1) % PLACEHOLDERS.length;
          timeoutRef.current = setTimeout(() => tick("typing"), PAUSE_AFTER_DELETE);
        }
      }
    };

    timeoutRef.current = setTimeout(() => tick("typing"), 600);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = searchQuery.trim();
    if (!message) return;
    window.dispatchEvent(new CustomEvent("queryless:open", { detail: { message } }));
    setSearchQuery("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full rounded-2xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
    >
      <input
        id="search-form-input"
        type="text"
        name="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? "" : placeholder}
        aria-label="Ask AI assistant"
        className="flex-1 px-6 py-4 text-[15px] text-gray-800 placeholder-gray-400 outline-none"
      />
      <button
        type="submit"
        className="bg-accent hover:bg-accent-600 transition-colors px-6 py-4 text-white font-semibold flex items-center gap-2 whitespace-nowrap"
      >
        <MagnifyingGlassIcon width={18} />
        <span className="hidden sm:inline">Ask AI</span>
      </button>
    </form>
  );
};

export default SearchForm;
