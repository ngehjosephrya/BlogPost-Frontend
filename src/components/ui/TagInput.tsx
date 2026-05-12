import { useState, useRef, useEffect } from "react";

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
        (s) => s.toLowerCase().includes(input.toLowerCase()) && 
        !tags.includes(s)
    );

    useEffect(() => {
        function handleClick(e: MouseEvent){
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick)
    }, []);

}
