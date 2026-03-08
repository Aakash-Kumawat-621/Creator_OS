import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option]
    );
  };

  return (
    <div ref={ref} className="relative">
      <label className="text-sm text-muted-foreground mb-1.5 block">{label}</label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 bg-secondary/30 border border-border rounded-lg p-3 text-sm text-foreground hover:border-primary/50 transition-all"
      >
        <div className="flex flex-wrap gap-1.5 flex-1 min-h-[24px]">
          {selected.length === 0 ? (
            <span className="text-muted-foreground">Select {label.toLowerCase()}...</span>
          ) : (
            selected.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/20 text-primary text-xs font-medium"
              >
                {s}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(s);
                  }}
                />
              </span>
            ))
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => toggle(option)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                selected.includes(option)
                  ? "bg-primary/15 text-primary"
                  : "text-foreground hover:bg-secondary/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const PLATFORMS = ["YouTube", "TikTok", "Instagram", "X"];
const CONTENT_TYPES = ["Education", "Entertainment", "Lifestyle", "Technology", "Finance"];

interface ContextSectionProps {
  platforms: string[];
  onPlatformsChange: (p: string[]) => void;
  contentTypes: string[];
  onContentTypesChange: (t: string[]) => void;
  onAnalyze: () => void;
  disabled: boolean;
}

export function ContextSection({
  platforms,
  onPlatformsChange,
  contentTypes,
  onContentTypesChange,
  onAnalyze,
  disabled,
}: ContextSectionProps) {
  return (
    <div className="glass-card p-6 space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Context</h2>
      <MultiSelect label="Platforms" options={PLATFORMS} selected={platforms} onChange={onPlatformsChange} />
      <MultiSelect label="Content Types" options={CONTENT_TYPES} selected={contentTypes} onChange={onContentTypesChange} />
      <button
        onClick={onAnalyze}
        disabled={disabled}
        className="w-full py-3.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:opacity-90 glow-purple"
      >
        ⚡ Analyze Content
      </button>
    </div>
  );
}
