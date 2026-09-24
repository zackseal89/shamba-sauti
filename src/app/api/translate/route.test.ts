import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/translate/route";

describe("POST /api/translate", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("returns mock translation for text in mock mode", async () => {
    vi.stubEnv("MANSA_PROVIDER", "mock");

    const response = await POST(
      new Request("http://localhost/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: "Majani ya mahindi yangu yanageuka manjano.",
          from: "sw",
          to: "en",
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.provider).toBe("mock");
    expect(body.translation).toContain("yellow");
  });

  it("returns mock translation for structured answer in mock mode", async () => {
    vi.stubEnv("MANSA_PROVIDER", "mock");

    const response = await POST(
      new Request("http://localhost/api/translate", {
        method: "POST",
        body: JSON.stringify({
          answer: {
            summary: "Majani ya mahindi kuwa manjano yanaweza kusababishwa na upungufu wa naitrojeni.",
            likelyCauses: ["Upungufu wa naitrojeni"],
            checks: ["Angalia majani ya chini"],
            actions: ["Rekebisha mifereji"],
            caution: "Huu ni mwongozo.",
            escalation: "Wasiliana na afisa ugani.",
          },
          from: "sw",
          to: "en",
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.provider).toBe("mock");
    expect(body.answer.summary).toBeDefined();
  });

  it("rejects invalid request payloads", async () => {
    const response = await POST(
      new Request("http://localhost/api/translate", {
        method: "POST",
        body: JSON.stringify({ text: "" }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
