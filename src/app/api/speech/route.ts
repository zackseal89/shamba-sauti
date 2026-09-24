import { speechRequestSchema } from "@/lib/contracts";
import { createSpeech } from "@/lib/providers/server";

export async function POST(request: Request): Promise<Response> {
  try {
    const input = speechRequestSchema.parse(await request.json());
    const result = await createSpeech(input.text, input.language);
    if (result.mode === "browser") return Response.json(result);

    return new Response(result.audio, {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Speech request failed", error);
    return Response.json({ error: "Speech is unavailable right now." }, { status: 502 });
  }
}
