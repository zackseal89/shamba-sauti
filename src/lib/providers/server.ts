import "server-only";

import type { AgriculturalAnswer, AskRequest, ProviderMode } from "@/lib/contracts";
import { askMansa, speakMansa, transcribeMansa } from "@/lib/providers/mansa";
import { buildMockAnswer, selectProviderMode } from "@/lib/providers/provider";

function getConfig() {
  const apiKey = process.env.MANSA_API_KEY ?? "";
  const baseUrl = process.env.MANSA_API_BASE_URL ?? "https://api.mymansa.ai";
  const mode = selectProviderMode({
    provider: process.env.MANSA_PROVIDER,
    apiKey,
  });

  return { apiKey, baseUrl, mode };
}

export async function answerQuestion(
  input: AskRequest,
): Promise<{ answer: AgriculturalAnswer; provider: ProviderMode }> {
  const config = getConfig();
  const answer =
    config.mode === "mansa"
      ? await askMansa(input, { apiKey: config.apiKey, baseUrl: config.baseUrl })
      : buildMockAnswer(input);

  return { answer, provider: config.mode };
}

export async function transcribeQuestion(
  audio: File,
  language: "sw" | "en",
  durationSeconds: number,
) {
  const config = getConfig();
  const transcript = config.mode === "mansa"
    ? await transcribeMansa(audio, language, durationSeconds, config)
    : language === "sw"
      ? "Majani ya mahindi yangu yanageuka manjano. Nifanye nini?"
      : "My maize leaves are turning yellow. What should I do?";

  return { transcript, provider: config.mode };
}

export async function createSpeech(text: string, language: "sw" | "en") {
  const config = getConfig();
  if (config.mode === "mock") return { mode: "browser" as const };

  const audio = await speakMansa(text, language, config);
  return { mode: "audio" as const, audio };
}
