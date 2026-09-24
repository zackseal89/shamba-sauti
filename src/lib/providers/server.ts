import "server-only";

import type { AgriculturalAnswer, AskRequest, ProviderMode } from "@/lib/contracts";
import { askMansa, speakMansa, transcribeMansa, translateMansa } from "@/lib/providers/mansa";
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

export async function createSpeech(text: string, language: "sw" | "en", voice?: string) {
  const config = getConfig();
  if (config.mode === "mock") return { mode: "browser" as const };

  const audio = await speakMansa(text, language, config, { voice });
  return { mode: "audio" as const, audio };
}

export async function translateText(
  text: string,
  from: "sw" | "en",
  to: "sw" | "en",
) {
  const config = getConfig();
  if (from === to) return { translation: text, provider: config.mode };

  const translation =
    config.mode === "mansa"
      ? await translateMansa(text, from, to, config)
      : from === "sw"
        ? "My maize leaves are turning yellow. What should I do?"
        : "Majani ya mahindi yangu yanageuka manjano. Nifanye nini?";

  return { translation, provider: config.mode };
}

export async function translateStructuredAnswer(
  answer: AgriculturalAnswer,
  from: "sw" | "en",
  to: "sw" | "en",
): Promise<{ answer: AgriculturalAnswer; provider: ProviderMode }> {
  const config = getConfig();
  if (from === to) return { answer, provider: config.mode };

  if (config.mode === "mock") {
    const mock = buildMockAnswer({ crop: "maize", language: to, message: "" });
    return {
      answer: {
        ...mock,
        sources: answer.sources,
      },
      provider: config.mode,
    };
  }

  const packedText = [
    answer.summary,
    answer.likelyCauses.join(" \n--item--\n "),
    answer.checks.join(" \n--item--\n "),
    answer.actions.join(" \n--item--\n "),
    answer.caution,
    answer.escalation,
  ].join("\n===SECTION===\n");

  try {
    const translatedRaw = await translateMansa(packedText, from, to, config);
    const sections = translatedRaw.split(/\n?===SECTION===\n?/).map((s) => s.trim());

    if (sections.length >= 6) {
      const splitItems = (raw: string) =>
        raw
          .split(/\n?--item--\n?/)
          .map((s) => s.trim())
          .filter(Boolean);

      const likelyCauses = splitItems(sections[1]);
      const checks = splitItems(sections[2]);
      const actions = splitItems(sections[3]);

      const translatedAnswer: AgriculturalAnswer = {
        summary: sections[0] || answer.summary,
        likelyCauses: likelyCauses.length > 0 ? likelyCauses : answer.likelyCauses,
        checks: checks.length > 0 ? checks : answer.checks,
        actions: actions.length > 0 ? actions : answer.actions,
        caution: sections[4] || answer.caution,
        escalation: sections[5] || answer.escalation,
        sources: answer.sources,
      };

      return { answer: translatedAnswer, provider: config.mode };
    }
  } catch (err) {
    console.warn("Full structured translation failed, falling back to summary", err);
  }

  const summaryTr = await translateMansa(answer.summary, from, to, config);
  return {
    answer: {
      ...answer,
      summary: summaryTr,
    },
    provider: config.mode,
  };
}


