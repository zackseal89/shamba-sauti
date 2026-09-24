import { describe, expect, it } from "vitest";

import { agriculturalAnswerSchema } from "@/lib/contracts";
import { buildMockAnswer, selectProviderMode } from "@/lib/providers/provider";

describe("selectProviderMode", () => {
  it("uses mock mode unless live Mansa is explicitly selected with a key", () => {
    expect(selectProviderMode({ provider: "mock", apiKey: "secret" })).toBe("mock");
    expect(selectProviderMode({ provider: "mansa", apiKey: "" })).toBe("mock");
    expect(selectProviderMode({ provider: "mansa", apiKey: "secret" })).toBe("mansa");
  });
});

describe("buildMockAnswer", () => {
  it("returns a complete, safety-conscious Swahili maize answer", () => {
    const answer = buildMockAnswer({
      crop: "maize",
      language: "sw",
      message: "Majani ya mahindi yangu yanageuka manjano.",
    });

    expect(() => agriculturalAnswerSchema.parse(answer)).not.toThrow();
    expect(answer.caution).toMatch(/hakikisha|uhakika/i);
    expect(answer.escalation).toMatch(/afisa|mtaalamu/i);
  });
});
