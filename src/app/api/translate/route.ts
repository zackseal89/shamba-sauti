import { ZodError } from "zod";

import { translateRequestSchema } from "@/lib/contracts";
import { translateStructuredAnswer, translateText } from "@/lib/providers/server";

export async function POST(request: Request): Promise<Response> {
  try {
    const input = translateRequestSchema.parse(await request.json());

    if ("answer" in input) {
      const result = await translateStructuredAnswer(input.answer, input.from, input.to);
      return Response.json(result);
    }

    const result = await translateText(input.text, input.from, input.to);
    return Response.json(result);
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return Response.json(
        { error: "A valid text or answer with language pairing is required." },
        { status: 400 },
      );
    }

    console.error("Translation request failed", error);
    return Response.json(
      { error: "Translation is unavailable right now." },
      { status: 502 },
    );
  }
}
