import { useState } from "react";
import { motion } from "framer-motion";
import { InputSection } from "@/components/dashboard/InputSection";
import { ContextSection } from "@/components/dashboard/ContextSection";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { ResultsDashboard } from "@/components/dashboard/ResultsDashboard";
import { analyzeContent, analyzeVideo, AnalysisResult } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type InputType = "idea" | "script" | "video";
type AppState = "input" | "loading" | "results";

const Index = () => {
  const [inputType, setInputType] = useState<InputType>("idea");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [appState, setAppState] = useState<AppState>("input");
  const [loadingMessage, setLoadingMessage] = useState("Analyzing content…");
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const { toast } = useToast();

  const canAnalyze =
    (inputType !== "video" ? content.trim().length > 0 : file !== null) &&
    platforms.length > 0 &&
    contentTypes.length > 0;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setAppState("loading");
    setLoadingMessage("Connecting to AI…");

    try {
      let result: AnalysisResult;

      if (inputType === "video" && file) {
        result = await analyzeVideo({
          file,
          platforms,
          contentTypes,
          onStep: setLoadingMessage,
        });
      } else {
        setLoadingMessage("Analyzing with AI…");
        result = await analyzeContent({
          inputType,
          content,
          platforms,
          contentTypes,
        });
      }

      setResults(result);
      setAppState("results");
    } catch (err) {
      console.error(err);
      toast({
        title: "Analysis failed",
        description:
          err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setAppState("input");
    }
  };

  const handleReset = () => {
    setAppState("input");
    setContent("");
    setFile(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-surface)" }}>
      {appState === "results" && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <button
            onClick={handleReset}
            className="text-sm px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          >
            ← New Analysis
          </button>
        </div>
      )}

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {appState === "input" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Hero */}
            <div className="text-center space-y-3 py-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                AI Content <span className="gradient-text">Strategy</span>
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Analyze, optimize, and safeguard your content for maximum reach across every platform.
              </p>
            </div>

            {/* Input + Context Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InputSection
                  inputType={inputType}
                  onInputTypeChange={setInputType}
                  content={content}
                  onContentChange={setContent}
                  file={file}
                  onFileChange={setFile}
                />
              </div>
              <div>
                <ContextSection
                  platforms={platforms}
                  onPlatformsChange={setPlatforms}
                  contentTypes={contentTypes}
                  onContentTypesChange={setContentTypes}
                  onAnalyze={handleAnalyze}
                  disabled={!canAnalyze}
                />
              </div>
            </div>
          </motion.div>
        )}

        {appState === "loading" && <LoadingState message={loadingMessage} />}

        {appState === "results" && results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ResultsDashboard results={results} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;
