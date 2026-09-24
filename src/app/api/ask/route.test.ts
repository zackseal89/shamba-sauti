import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/ask/route";

describe("POST /api/ask", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("returns a structured demo answer when mock mode is selected", async () => {
    vi.stubEnv("MANSA_PROVIDER", "mock");

    const response = await POST(
      new Request("http://localhost/api/ask", {
        method: "POST",
        body: JSON.stringify({
          crop: "maize",
          language: "sw",
          message: "Majani ya mahindi yangu yanageuka manjano.",
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.provider).toBe("mock");
    expect(body.answer.actions.length).toBeGreaterThan(0);
  });

  it("returns field errors for an invalid question", async () => {
    const response = await POST(
      new Request("http://localhost/api/ask", {
        method: "POST",
        body: JSON.stringify({ crop: "coffee", language: "sw", message: "" }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
