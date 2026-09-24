import { languageSchema } from "@/lib/contracts";
import { transcribeQuestion } from "@/lib/providers/server";

export async function POST(request: Request): Promise<Response> {
  try {
    const form = await request.formData();
    const audio = form.get("audio");
    const durationSeconds = Number(form.get("durationSeconds") ?? 1);

    if (!(audio instanceof File) || audio.size === 0 || !Number.isFinite(durationSeconds)) {
      return Response.json({ error: "A valid audio recording is required." }, { status: 400 });
    }

    const language = languageSchema.parse(form.get("language"));
    return Response.json(await transcribeQuestion(audio, language, durationSeconds));
  } catch (error) {
    console.error("Transcription request failed", error);
    return Response.json({ error: "The recording could not be transcribed." }, { status: 400 });
  }
}
