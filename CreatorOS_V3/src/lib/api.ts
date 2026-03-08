// ============================================================
// CreatorOS – AWS API Service Layer
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

// ─── Frontend-Facing Types ────────────────────────────────────────────────────

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
// Handles API Gateway payload format 1.0 (body is a JSON string)
// and format 2.0 (body is parsed directly).

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
    // Try to extract a readable error message from Lambda's body
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

  // Unwrap API Gateway format 1.0 envelope
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
// Maps Lambda field names to the frontend's expected shape.

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

// ─── Upload Video ─────────────────────────────────────────────────────────────
// Step 1: Ask Lambda for a presigned S3 URL + videoKey
// Step 2: PUT the file directly to S3 using that presigned URL
// This matches creatoros-upload-video which returns { uploadUrl, videoKey }

export async function uploadVideo(file: File): Promise<string> {
  // Step 1 — get presigned URL from Lambda
  const { uploadUrl, videoKey } = await apiFetch<{
    uploadUrl: string;
    videoKey: string;
  }>("/upload-video", { method: "POST" });

  // Step 2 — PUT file directly to S3 (bypasses API Gateway size limits)
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4" },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error(`S3 upload failed: ${uploadRes.status} ${uploadRes.statusText}`);
  }

  return videoKey; // e.g. "videos/abc123.mp4"
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

// ─── Poll Transcription ───────────────────────────────────────────────────────
// GET /transcription/{jobName}
// → { status: "COMPLETED"|"IN_PROGRESS"|"QUEUED"|"FAILED", transcript?: string }

type TranscriptionStatus = "IN_PROGRESS" | "QUEUED" | "COMPLETED" | "FAILED";

async function getTranscriptionStatus(
  jobName: string
): Promise<{ status: TranscriptionStatus; transcript?: string }> {
  return apiFetch(`/transcription/${encodeURIComponent(jobName)}`);
}

export async function waitForTranscript(
  jobName: string,
  onProgress?: (attempt: number) => void,
  maxAttempts = 72,
  intervalMs = 5000
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    onProgress?.(i);
    const result = await getTranscriptionStatus(jobName);

    if (result.status === "COMPLETED") {
      if (!result.transcript) throw new Error("Transcription completed but no transcript returned");
      return result.transcript;
    }

    if (result.status === "FAILED") throw new Error("Transcription job failed in AWS");

    await sleep(intervalMs);
  }

  throw new Error(`Transcription timed out after ${maxAttempts} attempts`);
}

// ─── Analyze Content ──────────────────────────────────────────────────────────

export async function analyzeContent(payload: AnalyzeContentPayload): Promise<AnalysisResult> {
  const raw = await apiFetch<BedrockRawResponse>("/analyze-content", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normaliseAnalysisResult(raw);
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

  const transcript = await waitForTranscript(jobName, (attempt) => {
    const elapsed = Math.round((attempt * 5) / 60);
    onStep?.(`Transcribing audio… (~${elapsed}m elapsed)`);
  });

  onStep?.("Running AI analysis…");
  return analyzeContent({ inputType: "video", content: transcript, platforms, contentTypes });
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
