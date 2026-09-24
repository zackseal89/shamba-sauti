// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/transcribe/route";

describe("POST /api/transcribe", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("returns a deterministic transcript in mock mode", async () => {
    vi.stubEnv("MANSA_PROVIDER", "mock");
    const form = new FormData();
    form.set("audio", new File(["voice"], "question.webm", { type: "audio/webm" }));
    form.set("language", "sw");
    form.set("durationSeconds", "2");

    const response = await POST(
      new Request("http://localhost/api/transcribe", { method: "POST", body: form }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.provider).toBe("mock");
    expect(body.transcript).toContain("mahindi");
  });

  it("rejects requests without an audio file", async () => {
    const response = await POST(
      new Request("http://localhost/api/transcribe", {
        method: "POST",
        body: new FormData(),
      }),
    );

    expect(response.status).toBe(400);
  });
});
