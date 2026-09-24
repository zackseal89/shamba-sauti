import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FarmerAssistant } from "@/components/farmer-assistant/farmer-assistant";

const answer = {
  summary: "Angalia muundo wa umanjano kwenye majani.",
  likelyCauses: ["Upungufu wa naitrojeni"],
  checks: ["Angalia majani ya chini"],
  actions: ["Pima udongo kabla ya kuweka mbolea"],
  caution: "Huu si utambuzi wa uhakika.",
  escalation: "Wasiliana na afisa ugani ikiwa dalili zinasambaa.",
};

describe("FarmerAssistant", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("fills the Swahili sample question and renders structured guidance", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ answer, provider: "mock" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    const user = userEvent.setup();
    render(<FarmerAssistant initialProvider="mock" />);

    await user.click(screen.getByRole("button", { name: /tumia swali la mfano/i }));
    expect(screen.getByRole("textbox")).toHaveValue(
      "Majani ya mahindi yangu yanageuka manjano. Nifanye nini?",
    );

    await user.click(screen.getByRole("button", { name: /pata ushauri/i }));

    expect(await screen.findByText(answer.summary)).toBeInTheDocument();
    expect(screen.getByText(answer.escalation)).toBeInTheDocument();
  });

  it("keeps the question available when the API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "Unavailable" }), { status: 502 }),
      ),
    );
    const user = userEvent.setup();
    render(<FarmerAssistant initialProvider="mock" />);

    const question = screen.getByRole("textbox");
    await user.type(question, "Majani yana madoa ya kahawia");
    await user.click(screen.getByRole("button", { name: /pata ushauri/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(question).toHaveValue("Majani yana madoa ya kahawia");
  });

  it("keeps text input available when microphone permission is denied", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    const user = userEvent.setup();
    render(<FarmerAssistant initialProvider="mock" />);

    await user.click(screen.getByRole("button", { name: /rekodi|record/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/microphone|kipaza sauti/i);
    expect(screen.getByRole("textbox")).toBeEnabled();
  });
});
