import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

type TagInputProps = {
  tags: string[];
  suggestions?: string[];
  placeholder?: string;
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
};

export function TagInput({
  tags,
  suggestions = [],
  placeholder = "Type and press Enter...",
  onAdd,
  onRemove,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s),
  );

  useClickOutside(wrapRef, () => setShowSuggestions(false));

  const handleKeDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const value = input.trim().replace(/,$/, "");
      if (value && !tags.includes(value)) {
        onAdd(value);
      }
      setInput("");
      setShowSuggestions(false);
    }

    if (e.key === "Backspace" && !input && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  };

  const handleSelect = (value: string) => {
    if (!tags.includes(value)) onAdd(value);
    setInput("");
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={wrapRef}>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="w-full h-9 px-3 text-sm border-gray-200 dark:border-gray-700
      rounded-lg bg-white dark:bg-gray-900 trxt-gray-200
      dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600
      outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
      />

      {showSuggestions && input && filtered.length > 0 && (
        <div
          className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white
        dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden z-50"
        >
          {filtered.slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              onPointerDown={() => handleSelect(s)}
              className="w-full text-left px-3 py-2 text-sm text-gray-600
               dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800
               hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}

          {!filtered.find((s) => s.toLowerCase() === input.toLowerCase()) && (
            <button
              type="button"
              onPointerDown={() => handleSelect(input.trim())}
              className="w-full text-left px-3 py-2 text-sm text-gray-400
               dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800
               border-t border-gray-50 dark:border-gray-800 transition-colors"
            >
              Add "{input.trim()}"
            </button>
          )}
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700 rounded-full
                         px-2.5 py-1 text-xs text-gray-600 dark:text-gray-400"
            >
              {tag}
              <button
              type="button"
              onClick={() => onRemove(tag)}
              className="text-gray-400 dark:text-gray-600 hover:text-gray-700
                           dark:hover:text-gray-300 transition-colors leading-none"
              aria-label={`Remove ${tag}`}>
                x
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
