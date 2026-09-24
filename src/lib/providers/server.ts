import "server-only";

import type { AgriculturalAnswer, AskRequest, ProviderMode } from "@/lib/contracts";
import { askMansa } from "@/lib/providers/mansa";
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
