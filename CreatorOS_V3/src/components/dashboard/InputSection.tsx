import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileVideo, Lightbulb, FileText, Film } from "lucide-react";

type InputType = "idea" | "script" | "video";

interface InputSectionProps {
  inputType: InputType;
  onInputTypeChange: (type: InputType) => void;
  content: string;
  onContentChange: (content: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const tabs: { id: InputType; label: string; icon: React.ReactNode }[] = [
  { id: "idea", label: "Idea", icon: <Lightbulb className="w-4 h-4" /> },
  { id: "script", label: "Script", icon: <FileText className="w-4 h-4" /> },
  { id: "video", label: "Video", icon: <Film className="w-4 h-4" /> },
];

export function InputSection({
  inputType,
  onInputTypeChange,
  content,
  onContentChange,
  file,
  onFileChange,
}: InputSectionProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped?.type.startsWith("video/")) onFileChange(dropped);
    },
    [onFileChange]
  );

  return (
    <div className="glass-card p-6 space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Content Input</h2>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-secondary/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onInputTypeChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
              inputType === tab.id
                ? "bg-primary text-primary-foreground shadow-lg glow-purple"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {inputType !== "video" ? (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder={
                inputType === "idea"
                  ? "Describe your content idea..."
                  : "Paste your full script here..."
              }
              className="w-full h-48 bg-secondary/30 border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-mono text-sm"
            />
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 h-48 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
              dragOver
                ? "border-primary bg-primary/10"
                : file
                ? "border-neon-green/50 bg-neon-green/5"
                : "border-border hover:border-primary/50 bg-secondary/20"
            }`}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "video/*";
              input.onchange = (e) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (f) onFileChange(f);
              };
              input.click();
            }}
          >
            {file ? (
              <>
                <FileVideo className="w-10 h-10 text-neon-green" />
                <span className="text-sm text-foreground font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </span>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Drag & drop a video or click to browse
                </span>
                <span className="text-xs text-muted-foreground">MP4, MOV, WebM</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
