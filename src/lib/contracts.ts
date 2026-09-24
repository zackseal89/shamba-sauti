import { z } from "zod";

export const cropSchema = z.enum(["maize", "beans", "tomatoes"]);
export const languageSchema = z.enum(["sw", "en"]);

const stringOrStringArray = z
  .union([z.string().min(1), z.array(z.string().min(1)).min(1)])
  .transform((val) => (Array.isArray(val) ? val.join(" ") : val));

export const agriculturalAnswerSchema = z.object({
  summary: z.string().min(1),
  likelyCauses: z.array(z.string().min(1)).min(1),
  checks: z.array(z.string().min(1)).min(1),
  actions: z.array(z.string().min(1)).min(1),
  caution: stringOrStringArray,
  escalation: stringOrStringArray,
  sources: z.array(z.string()).optional(),
});

export const askRequestSchema = z.object({
  message: z.string().trim().min(4).max(8_000),
  crop: cropSchema,
  language: languageSchema,
});

export const speechRequestSchema = z.object({
  text: z.string().trim().min(1).max(8_000),
  language: languageSchema,
  voice: z.string().optional(),
});

export const translateTextSchema = z.object({
  text: z.string().trim().min(1).max(8_000),
  from: languageSchema,
  to: languageSchema,
});

export const translateAnswerSchema = z.object({
  answer: agriculturalAnswerSchema,
  from: languageSchema,
  to: languageSchema,
});

export const translateRequestSchema = z.union([
  translateTextSchema,
  translateAnswerSchema,
]);

export type TranslateTextRequest = z.infer<typeof translateTextSchema>;
export type TranslateAnswerRequest = z.infer<typeof translateAnswerSchema>;
export type TranslateRequest = z.infer<typeof translateRequestSchema>;

export type Crop = z.infer<typeof cropSchema>;
export type Language = z.infer<typeof languageSchema>;
export type AgriculturalAnswer = z.infer<typeof agriculturalAnswerSchema>;
export type AskRequest = z.infer<typeof askRequestSchema>;
export type ProviderMode = "mock" | "mansa";

export type AskResponse = {
  answer: AgriculturalAnswer;
  provider: ProviderMode;
};
