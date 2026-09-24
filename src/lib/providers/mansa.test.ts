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

  it("handles live Mansa output with web sources and array caution/escalation", () => {
    const liveOutput = `\`\`\`json
    {
      "summary": "Fall armyworm risk detected.",
      "likelyCauses": ["Larval feeding in whorl"],
      "checks": ["Check 20 plants for windowpane holes"],
      "actions": ["Handpick larvae or apply registered insecticide"],
      "caution": [
        "Do not apply unlabelled chemicals.",
        "Rotate modes of action to prevent resistance."
      ],
      "escalation": [
        "Alert sub-county agricultural officer if more than 30% infested."
      ]
    }
    \`\`\`

    <sources>
    - https://www.kalro.org/fall-armyworm
    - https://cabi.org/plantwise
    </sources>`;

    const answer = parseMansaAnswer(liveOutput);

    expect(answer.summary).toBe("Fall armyworm risk detected.");
    expect(answer.caution).toContain("Do not apply unlabelled chemicals.");
    expect(answer.escalation).toContain("sub-county agricultural officer");
    expect(answer.sources).toHaveLength(2);
    expect(answer.sources?.[0]).toBe("https://www.kalro.org/fall-armyworm");
  });

  it("rejects incomplete answers", () => {
    expect(() => parseMansaAnswer('{"summary":"Incomplete"}')).toThrow();
  });
});
