import { ZodError } from "zod";

import { askRequestSchema } from "@/lib/contracts";
import { answerQuestion } from "@/lib/providers/server";

export async function POST(request: Request): Promise<Response> {
  try {
    const input = askRequestSchema.parse(await request.json());
    const result = await answerQuestion(input);
    return Response.json(result);
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return Response.json(
        { error: "Please check the crop, language, and question, then try again." },
        { status: 400 },
      );
    }

    console.error("Agricultural answer request failed", error);
    return Response.json(
      { error: "The assistant could not answer right now. Your question is still saved." },
      { status: 502 },
    );
  }
}
