import { describe, expect, it } from "vitest";

import { parseMansaAnswer } from "@/lib/providers/mansa";

describe("parseMansaAnswer", () => {
  it("accepts JSON returned inside a markdown code fence", () => {
    const answer = parseMansaAnswer(`\`\`\`json
      {
        "summary": "Check the crop carefully.",
        "likelyCauses": ["Water stress"],
        "checks": ["Feel the soil"],
        "actions": ["Correct the watering pattern"],
        "caution": "This is not a confirmed diagnosis.",
        "escalation": "Contact an extension officer if it spreads."
      }
    \`\`\``);

    expect(answer.summary).toBe("Check the crop carefully.");
    expect(answer.escalation).toContain("extension officer");
  });

  it("rejects incomplete answers", () => {
    expect(() => parseMansaAnswer('{"summary":"Incomplete"}')).toThrow();
  });
});
