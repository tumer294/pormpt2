import { z } from "zod";

// AI Provider Types
export const aiProviders = [
  "openai-gpt4o",
  "openai-gpt4-turbo",
  "openai-gpt4",
  "openai-gpt35-turbo",
  "claude-sonnet-4",
  "claude-sonnet-35",
  "claude-opus",
  "claude-haiku",
  "gemini-2-5-pro",
  "gemini-2-5-flash",
  "gemini-2-5-flash-lite",
  "gemini-2-5-flash-tts",
  "gemini-2-0-flash",
  "gemini-2-0-flash-lite",
  "gemini-2-0-flash-exp",
  "gemini-2-0-flash-live",
  "gemini-2-5-flash-live",
  "gemini-2-5-flash-native-audio-dialog",
  "gemini-robotics-er-1-5-preview",
  "learnlm-2-0-flash-experimental",
  "perplexity-sonar",
  "xai-grok-2",
  "xai-grok-beta",
] as const;

export type AIProvider = typeof aiProviders[number];

export const aiProviderSchema = z.enum(aiProviders);

// AI Provider Display Names
export const aiProviderNames: Record<AIProvider, string> = {
  "openai-gpt4o": "OpenAI GPT-4o",
  "openai-gpt4-turbo": "OpenAI GPT-4 Turbo",
  "openai-gpt4": "OpenAI GPT-4",
  "openai-gpt35-turbo": "OpenAI GPT-3.5 Turbo",
  "claude-sonnet-4": "Claude Sonnet 4",
  "claude-sonnet-35": "Claude 3.5 Sonnet",
  "claude-opus": "Claude 3 Opus",
  "claude-haiku": "Claude 3 Haiku",
  "gemini-2-5-pro": "Google Gemini 2.5 Pro",
  "gemini-2-5-flash": "Google Gemini 2.5 Flash",
  "gemini-2-5-flash-lite": "Google Gemini 2.5 Flash Lite",
  "gemini-2-5-flash-tts": "Google Gemini 2.5 Flash TTS",
  "gemini-2-0-flash": "Google Gemini 2.0 Flash",
  "gemini-2-0-flash-lite": "Google Gemini 2.0 Flash Lite",
  "gemini-2-0-flash-exp": "Google Gemini 2.0 Flash Experimental",
  "gemini-2-0-flash-live": "Google Gemini 2.0 Flash Live",
  "gemini-2-5-flash-live": "Google Gemini 2.5 Flash Live",
  "gemini-2-5-flash-native-audio-dialog": "Google Gemini 2.5 Flash Native Audio",
  "gemini-robotics-er-1-5-preview": "Google Gemini Robotics ER 1.5",
  "learnlm-2-0-flash-experimental": "Google LearnLM 2.0 Flash",
  "perplexity-sonar": "Perplexity Sonar",
  "xai-grok-2": "xAI Grok-2",
  "xai-grok-beta": "xAI Grok Beta",
};

// Settings Schema
export const settingsSchema = z.object({
  ai1Provider: aiProviderSchema,
  ai1ApiKey: z.string().min(1, "API anahtarı gerekli"),
  ai2Provider: aiProviderSchema,
  ai2ApiKey: z.string().min(1, "API anahtarı gerekli"),
  language: z.enum(["tr", "en"]),
});

export type Settings = z.infer<typeof settingsSchema>;

// Question Schema for detailed mode
export const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export type Question = z.infer<typeof questionSchema>;

// Prompt Generation Request
export const generatePromptRequestSchema = z.object({
  userPrompt: z.string().min(1),
  mode: z.enum(["quick", "detailed"]),
  questions: z.array(questionSchema).optional(),
  ai1Provider: aiProviderSchema,
  ai1ApiKey: z.string(),
  ai2Provider: aiProviderSchema,
  ai2ApiKey: z.string(),
});

export type GeneratePromptRequest = z.infer<typeof generatePromptRequestSchema>;

// Generated Prompt Result
export const promptResultSchema = z.object({
  option1: z.string(),
  option2: z.string(),
  metadata: z.object({
    ai1Provider: z.string(),
    ai2Provider: z.string(),
    processingTime: z.number(),
    mode: z.enum(["quick", "detailed"]),
  }),
});

export type PromptResult = z.infer<typeof promptResultSchema>;

// Questions Generation Request
export const generateQuestionsRequestSchema = z.object({
  userPrompt: z.string().min(1),
  ai1Provider: aiProviderSchema,
  ai1ApiKey: z.string(),
});

export type GenerateQuestionsRequest = z.infer<typeof generateQuestionsRequestSchema>;

// Questions Response
export const questionsResponseSchema = z.object({
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
  })),
});

export type QuestionsResponse = z.infer<typeof questionsResponseSchema>;
