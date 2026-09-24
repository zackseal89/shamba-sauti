import "server-only";

import {
  agriculturalAnswerSchema,
  type AgriculturalAnswer,
  type AskRequest,
} from "@/lib/contracts";

type MansaChatResponse = {
  data?: { message?: string };
};

function stripCodeFence(value: string): string {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

export function parseMansaAnswer(value: string): AgriculturalAnswer {
  return agriculturalAnswerSchema.parse(JSON.parse(stripCodeFence(value)));
}

function buildSystemPrompt(language: AskRequest["language"]): string {
  const responseLanguage = language === "sw" ? "Swahili" : "English";

  return `You are a cautious agricultural assistant for smallholder farmers in Kenya.
Reply in ${responseLanguage}. Return only valid JSON with these keys: summary, likelyCauses, checks, actions, caution, escalation.
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
      max_tokens: 1200,
      tools: [],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Mansa chat failed with status ${response.status}`);
  }

  const payload = (await response.json()) as MansaChatResponse;
  if (!payload.data?.message) {
    throw new Error("Mansa returned an empty answer");
  }

  return parseMansaAnswer(payload.data.message);
}
