import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/speech/route";

describe("POST /api/speech", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("selects browser speech in mock mode", async () => {
    vi.stubEnv("MANSA_PROVIDER", "mock");
    const response = await POST(
      new Request("http://localhost/api/speech", {
        method: "POST",
        body: JSON.stringify({ text: "Habari mkulima", language: "sw" }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.mode).toBe("browser");
  });
});
