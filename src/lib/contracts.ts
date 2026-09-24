import { z } from "zod";

export const cropSchema = z.enum(["maize", "beans", "tomatoes"]);
export const languageSchema = z.enum(["sw", "en"]);

export const agriculturalAnswerSchema = z.object({
  summary: z.string().min(1),
  likelyCauses: z.array(z.string().min(1)).min(1),
  checks: z.array(z.string().min(1)).min(1),
  actions: z.array(z.string().min(1)).min(1),
  caution: z.string().min(1),
  escalation: z.string().min(1),
});

export const askRequestSchema = z.object({
  message: z.string().trim().min(4).max(8_000),
  crop: cropSchema,
  language: languageSchema,
});

export const speechRequestSchema = z.object({
  text: z.string().trim().min(1).max(8_000),
  language: languageSchema,
});

export type Crop = z.infer<typeof cropSchema>;
export type Language = z.infer<typeof languageSchema>;
export type AgriculturalAnswer = z.infer<typeof agriculturalAnswerSchema>;
export type AskRequest = z.infer<typeof askRequestSchema>;
export type ProviderMode = "mock" | "mansa";

export type AskResponse = {
  answer: AgriculturalAnswer;
  provider: ProviderMode;
};
