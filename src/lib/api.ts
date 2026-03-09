// ============================================================
// CreatorOS – AWS API Service Layer
// Video flow mirrors the working HTML pipeline exactly:
//   upload-video → transcribe-video → poll /process-transcription
// ============================================================

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE) {
  console.warn("[CreatorOS] VITE_API_BASE_URL is not set.");
}

// ─── Raw Lambda Response (matches Python exactly) ─────────────────────────────

interface BedrockRawResponse {
  generatedScript: string;
  hooks: string[];
  captions: string;
  improvements: string[];
  copyrightRisks: string[];
  factIssues: string[];
  platformWarnings: Record<string, string>;
  contentScore: {
    virality: number;
    clarity: number;
    policySafety: number;
  };
}

// creatoros-process-transcription returns { transcript, analysis }
// where analysis is the BedrockRawResponse
interface ProcessTranscriptionResponse {
  status?: string;
  message?: string;
  transcript?: string;
  analysis?: BedrockRawResponse;
}

// ─── Frontend Types ───────────────────────────────────────────────────────────

export interface ContentScores {
  virality: number;
  clarity: number;
  policySafety: number;
}

export interface PlatformWarning {
  platform: string;
  warning: string;
}

export interface SafeguardResult {
  copyrightRisks: string[];
  factualIssues: string[];
  platformWarnings: PlatformWarning[];
}

export interface AnalysisResult {
  scores: ContentScores;
  optimizedScript: string;
  viralHooks: string[];
  caption: string;
  improvements: string[];
  safeguard: SafeguardResult;
}

export interface AnalyzeContentPayload {
  inputType: "idea" | "script" | "video";
  content?: string;
  platforms: string[];
  contentTypes: string[];
}

// ─── apiFetch ─────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await res.text();

  if (!res.ok) {
    try {
      const parsed = JSON.parse(text);
      const bodyStr = typeof parsed.body === "string" ? parsed.body : text;
      const body = JSON.parse(bodyStr);
      throw new Error(body.error || bodyStr);
    } catch {
      throw new Error(`API error ${res.status}: ${text}`);
    }
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response: ${text.slice(0, 200)}`);
  }

  // Unwrap API Gateway format 1.0 envelope { statusCode, body: "..." }
  if (
    parsed !== null &&
    typeof parsed === "object" &&
    "body" in (parsed as Record<string, unknown>) &&
    typeof (parsed as Record<string, unknown>).body === "string"
  ) {
    try {
      return JSON.parse((parsed as Record<string, string>).body) as T;
    } catch {
      throw new Error("Failed to parse Lambda body JSON");
    }
  }

  return parsed as T;
}

// ─── Normalise Lambda → Frontend ──────────────────────────────────────────────

function normaliseAnalysisResult(raw: BedrockRawResponse): AnalysisResult {
  const platformWarnings: PlatformWarning[] = Object.entries(raw.platformWarnings ?? {})
    .filter(([, warning]) => warning && warning.trim() !== "")
    .map(([platform, warning]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      warning,
    }));

  return {
    optimizedScript: raw.generatedScript ?? "",
    viralHooks: Array.isArray(raw.hooks) ? raw.hooks : [],
    caption: raw.captions ?? "",
    improvements: Array.isArray(raw.improvements) ? raw.improvements : [],
    scores: {
      virality: raw.contentScore?.virality ?? 0,
      clarity: raw.contentScore?.clarity ?? 0,
      policySafety: raw.contentScore?.policySafety ?? 0,
    },
    safeguard: {
      copyrightRisks: Array.isArray(raw.copyrightRisks) ? raw.copyrightRisks : [],
      factualIssues: Array.isArray(raw.factIssues) ? raw.factIssues : [],
      platformWarnings,
    },
  };
}

// ─── Upload Video (presigned URL flow) ───────────────────────────────────────
// 1. POST /upload-video → get { uploadUrl, videoKey }
// 2. PUT file directly to S3 using uploadUrl

export async function uploadVideo(file: File): Promise<string> {
  const { uploadUrl, videoKey } = await apiFetch<{
    uploadUrl: string;
    videoKey: string;
  }>("/upload-video", { method: "POST" });

  // Send PUT directly to S3 presigned URL.
  // credentials:"omit" prevents browser from adding auth headers that break the signature.
  // Content-Type must exactly match what Lambda passed to generate_presigned_url.
  const s3Res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4" },
    body: file,
    credentials: "omit",
  });

  if (!s3Res.ok) {
    const errText = await s3Res.text().catch(() => "");
    throw new Error(`S3 upload failed (${s3Res.status}): ${errText.slice(0, 300)}`);
  }

  return videoKey;
}

// ─── Start Transcription ──────────────────────────────────────────────────────

export async function startTranscription(videoKey: string): Promise<string> {
  const data = await apiFetch<{ transcriptionJobName: string }>("/transcribe-video", {
    method: "POST",
    body: JSON.stringify({ videoKey }),
  });
  if (!data.transcriptionJobName) throw new Error("No transcriptionJobName returned");
  return data.transcriptionJobName;
}

// ─── Poll /process-transcription ─────────────────────────────────────────────
// Mirrors the working HTML page exactly.
// POST /process-transcription every 5s until data.analysis exists.

async function pollProcessTranscription(
  jobName: string,
  platforms: string[],
  contentTypes: string[],
  onProgress?: (attempt: number) => void,
  maxAttempts = 72,
  intervalMs = 5000
): Promise<AnalysisResult> {
  for (let i = 0; i < maxAttempts; i++) {
    onProgress?.(i);

    const data = await apiFetch<ProcessTranscriptionResponse>("/process-transcription", {
      method: "POST",
      body: JSON.stringify({
        transcriptionJobName: jobName,
        platforms,
        contentTypes,
      }),
    });

    // Lambda returns { analysis: {...} } once complete
    if (data.analysis) {
      return normaliseAnalysisResult(data.analysis);
    }

    // Still IN_PROGRESS — wait and retry
    await sleep(intervalMs);
  }

  throw new Error("Transcription timed out. Please try a shorter video.");
}

// ─── Full Video Pipeline ──────────────────────────────────────────────────────

export interface VideoAnalysisOptions {
  file: File;
  platforms: string[];
  contentTypes: string[];
  onStep?: (step: string) => void;
}

export async function analyzeVideo(opts: VideoAnalysisOptions): Promise<AnalysisResult> {
  const { file, platforms, contentTypes, onStep } = opts;

  onStep?.("Uploading video to S3…");
  const videoKey = await uploadVideo(file);

  onStep?.("Starting transcription job…");
  const jobName = await startTranscription(videoKey);

  return pollProcessTranscription(
    jobName,
    platforms,
    contentTypes,
    (attempt) => {
      const elapsed = Math.round((attempt * 5) / 60);
      onStep?.(
        attempt === 0
          ? "Transcribing audio… (60–90 seconds, please wait)"
          : `Still transcribing… (~${elapsed}m elapsed)`
      );
    }
  );
}

// ─── Analyze Content (Idea / Script) ─────────────────────────────────────────

export async function analyzeContent(payload: AnalyzeContentPayload): Promise<AnalysisResult> {
  const raw = await apiFetch<BedrockRawResponse>("/analyze-content", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normaliseAnalysisResult(raw);
}

// ─── Save / Get Project ───────────────────────────────────────────────────────

export async function saveProject(
  scriptId: string,
  result: AnalysisResult
): Promise<{ projectId: string }> {
  return apiFetch<{ projectId: string }>("/save-project", {
    method: "POST",
    body: JSON.stringify({
      scriptId,
      script: result.optimizedScript,
      hooks: result.viralHooks,
      captions: result.caption,
    }),
  });
}

export async function getProject(projectId: string) {
  return apiFetch(`/project/${encodeURIComponent(projectId)}`);
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
