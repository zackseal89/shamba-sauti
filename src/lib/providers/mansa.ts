import "server-only";

import { Buffer } from "node:buffer";

import {
  agriculturalAnswerSchema,
  type AgriculturalAnswer,
  type AskRequest,
} from "@/lib/contracts";

export type MansaChatResponse = {
  context?: string;
  data?: {
    id?: string;
    message?: string;
    sources?: string[];
  };
  meta?: {
    usage?: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
    };
    finishReason?: string;
    model?: string;
    latencyMs?: number;
  };
};

export type MansaProblemDetails = {
  type?: string;
  title?: string;
  isError?: boolean;
  detail?: string;
  invalidParams?: Array<{ name: string; reason: string }>;
  context?: string;
  description?: string | null;
};

export async function parseMansaError(
  response: Response,
  serviceName: string,
): Promise<Error> {
  try {
    const payload = (await response.json()) as MansaProblemDetails;
    const detail = payload.detail || payload.title || payload.context;
    if (detail) {
      return new Error(`Mansa ${serviceName} failed (${response.status}): ${detail}`);
    }
  } catch {
    // If response body is not JSON, ignore parsing error
  }
  return new Error(`Mansa ${serviceName} failed with status ${response.status}`);
}

export function extractJsonFromText(value: string): string {
  const trimmed = value.trim();

  // 1. Check for standard markdown code fences ```json ... ``` or ``` ... ```
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch?.[1]) {
    return codeBlockMatch[1].trim();
  }

  // 2. Locate outermost JSON object braces { ... }
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1).trim();
  }

  return trimmed;
}

export function extractSourcesFromText(value: string): string[] {
  const sourcesMatch = value.match(/<sources>([\s\S]*?)<\/sources>/i);
  if (!sourcesMatch?.[1]) return [];

  const lines = sourcesMatch[1].split("\n");
  const urls: string[] = [];
  for (const line of lines) {
    const urlMatch = line.match(/https?:\/\/[^\s<>)"]+/);
    if (urlMatch?.[0]) {
      urls.push(urlMatch[0]);
    }
  }
  return urls;
}

export function parseMansaAnswer(
  value: string,
  externalSources?: string[],
): AgriculturalAnswer {
  const jsonString = extractJsonFromText(value);
  const parsed = JSON.parse(jsonString) as Record<string, unknown>;

  const combinedSources = [
    ...(externalSources ?? []),
    ...extractSourcesFromText(value),
    ...(Array.isArray(parsed.sources) ? (parsed.sources as string[]) : []),
  ];
  const uniqueSources = Array.from(new Set(combinedSources.filter(Boolean)));
  if (uniqueSources.length > 0) {
    parsed.sources = uniqueSources;
  }

  return agriculturalAnswerSchema.parse(parsed);
}

function buildSystemPrompt(language: AskRequest["language"]): string {
  const languageInstructions =
    language === "sw"
      ? "Reply in natural, everyday Kenyan Swahili (Kiswahili cha kawaida cha Kenya kinachoeleweka na wakulima wote nchini). Do NOT use deep, literary, or complex Coastal Swahili (epuka Kiswahili kigumu au cha vitabu/pwani). Use simple, friendly, practical Kenyan phrasing (e.g. 'shamba', 'mbolea', 'wadudu waharibifu', 'afisa wa kilimo', 'kagua mimea')."
      : "Reply in clear, friendly, and practical Kenyan English tailored for local smallholder farmers.";

  return `You are a practical and cautious agricultural advisor for smallholder farmers in Kenya.
${languageInstructions}
Return only valid JSON with these keys: summary, likelyCauses, checks, actions, caution, escalation.
likelyCauses, checks, and actions must be arrays of short strings. Never claim certainty from symptoms alone. Never invent pesticide or fertiliser dosages. Prefer observation, water management, sanitation, soil testing, label compliance, and local extension advice. Escalate rapidly spreading, severe, or unclear cases.`;
}

export async function askMansa(
  input: AskRequest,
  config: { apiKey: string; baseUrl: string },
): Promise<AgriculturalAnswer> {
  const response = await fetch(`${config.baseUrl}/v1/chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Crop: ${input.crop}\nFarmer question: ${input.message}`,
      system: buildSystemPrompt(input.language),
      response_language: input.language === "en" ? "english" : "source",
      temperature: 0.2,
      max_tokens: 1400,
      tools: [{ type: "web_search" }],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 400) {
      const fallbackResponse = await fetch(`${config.baseUrl}/v1/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Crop: ${input.crop}\nFarmer question: ${input.message}`,
          system: buildSystemPrompt(input.language),
          response_language: input.language === "en" ? "english" : "source",
          temperature: 0.2,
          max_tokens: 1200,
          tools: [],
        }),
        cache: "no-store",
      });
      if (fallbackResponse.ok) {
        const payload = (await fallbackResponse.json()) as MansaChatResponse;
        if (!payload.data?.message) {
          throw new Error("Mansa returned an empty answer");
        }
        return parseMansaAnswer(payload.data.message, payload.data.sources);
      }
    }
    throw await parseMansaError(response, "chat");
  }

  const payload = (await response.json()) as MansaChatResponse;
  if (!payload.data?.message) {
    throw new Error("Mansa returned an empty answer");
  }

  return parseMansaAnswer(payload.data.message, payload.data.sources);
}

export async function transcribeMansa(
  audio: File,
  language: "sw" | "en",
  durationSeconds: number,
  config: { apiKey: string; baseUrl: string },
): Promise<string> {
  const audioBase64 = Buffer.from(await audio.arrayBuffer()).toString("base64");
  const targetLanguage = language === "sw" ? "Swahili" : "English";
  const safeMimeType = audio.type || "audio/webm";
  const safeFilename = audio.name || (safeMimeType.includes("wav") ? "question.wav" : "question.webm");

  const sendRequest = async () => {
    return fetch(`${config.baseUrl}/v1/transcribe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audioBase64,
        language: targetLanguage,
        mimeType: safeMimeType,
        filename: safeFilename,
        durationSeconds: Math.max(1, Math.round(durationSeconds)),
      }),
      cache: "no-store",
    });
  };

  let response = await sendRequest();
  if (!response.ok && [502, 503, 504].includes(response.status)) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    response = await sendRequest();
  }

  if (!response.ok) {
    throw await parseMansaError(response, "transcription");
  }

  const payload = (await response.json()) as { data?: { transcript?: string } };
  if (!payload.data?.transcript) {
    throw new Error("Mansa returned an empty transcript");
  }
  return payload.data.transcript;
}

export async function speakMansa(
  text: string,
  language: "sw" | "en",
  config: { apiKey: string; baseUrl: string },
  options?: { voice?: string },
): Promise<ArrayBuffer> {
  const defaultVoice = language === "en" ? "east_african_female" : "female";
  const voice = options?.voice || defaultVoice;

  const response = await fetch(`${config.baseUrl}/v1/audio/speech`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      language: language === "sw" ? "Swahili" : "English",
      voice,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw await parseMansaError(response, "speech");
  }
  return response.arrayBuffer();
}

export async function translateMansa(
  text: string,
  from: "sw" | "en",
  to: "sw" | "en",
  config: { apiKey: string; baseUrl: string },
  tone: "natural" | "precise" | "formal" = "natural",
): Promise<string> {
  const response = await fetch(`${config.baseUrl}/v1/translate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      from: from === "sw" ? "Swahili" : "English",
      to: to === "sw" ? "Swahili" : "English",
      tone,
      context:
        to === "sw"
          ? "Everyday conversational Kenyan Swahili for smallholder farmers"
          : "Practical agricultural advisory in Kenya",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw await parseMansaError(response, "translate");
  }

  const payload = (await response.json()) as {
    data?: { translation?: string };
  };
  if (!payload.data?.translation) {
    throw new Error("Mansa returned an empty translation");
  }
  return payload.data.translation;
}
