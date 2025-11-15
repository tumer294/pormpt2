import type { AIProvider } from "@shared/schema";

interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AIResponse {
  content: string;
  error?: string;
}

// OpenAI Integration
async function callOpenAI(
  apiKey: string,
  model: string,
  messages: AIMessage[]
): Promise<AIResponse> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { content: "", error: error.error?.message || "OpenAI API error" };
    }

    const data = await response.json();
    return { content: data.choices[0].message.content };
  } catch (error) {
    return { content: "", error: String(error) };
  }
}

// Anthropic Claude Integration
async function callClaude(
  apiKey: string,
  model: string,
  messages: AIMessage[]
): Promise<AIResponse> {
  try {
    const systemMessage = messages.find(m => m.role === "system")?.content || "";
    const userMessages = messages.filter(m => m.role !== "system");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model,
        system: systemMessage,
        messages: userMessages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { content: "", error: error.error?.message || "Claude API error" };
    }

    const data = await response.json();
    return { content: data.content[0].text };
  } catch (error) {
    return { content: "", error: String(error) };
  }
}

// Google Gemini Integration
async function callGemini(
  apiKey: string,
  model: string,
  messages: AIMessage[]
): Promise<AIResponse> {
  try {
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8000,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { content: "", error: error.error?.message || "Gemini API error" };
    }

    const data = await response.json();
    
    // Check if response has valid structure
    if (!data.candidates || !data.candidates[0]) {
      console.error("Invalid Gemini response - no candidates:", JSON.stringify(data));
      return { content: "", error: "API yanıt vermedi" };
    }

    const candidate = data.candidates[0];
    
    // Check for finish reason issues
    if (candidate.finishReason === "MAX_TOKENS") {
      console.error("Gemini hit MAX_TOKENS limit");
      return { content: "", error: "Token limiti aşıldı. Lütfen daha kısa bir prompt deneyin." };
    }
    
    if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
      console.error("Invalid Gemini response structure:", JSON.stringify(data));
      return { content: "", error: `API yanıtı geçersiz (${candidate.finishReason || 'unknown reason'})` };
    }
    
    return { content: candidate.content.parts[0].text };
  } catch (error) {
    console.error("Gemini API error:", error);
    return { content: "", error: String(error) };
  }
}

// Perplexity Integration
async function callPerplexity(
  apiKey: string,
  messages: AIMessage[]
): Promise<AIResponse> {
  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { content: "", error: error.error?.message || "Perplexity API error" };
    }

    const data = await response.json();
    return { content: data.choices[0].message.content };
  } catch (error) {
    return { content: "", error: String(error) };
  }
}

// xAI Grok Integration
async function callXAI(
  apiKey: string,
  model: string,
  messages: AIMessage[]
): Promise<AIResponse> {
  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { content: "", error: error.error?.message || "xAI API error" };
    }

    const data = await response.json();
    return { content: data.choices[0].message.content };
  } catch (error) {
    return { content: "", error: String(error) };
  }
}

// Main function to call appropriate AI provider
export async function callAI(
  provider: AIProvider,
  apiKey: string,
  messages: AIMessage[]
): Promise<AIResponse> {
  switch (provider) {
    case "openai-gpt4o":
      return callOpenAI(apiKey, "gpt-4o", messages);
    case "openai-gpt4-turbo":
      return callOpenAI(apiKey, "gpt-4-turbo", messages);
    case "openai-gpt4":
      return callOpenAI(apiKey, "gpt-4", messages);
    case "openai-gpt35-turbo":
      return callOpenAI(apiKey, "gpt-3.5-turbo", messages);
    case "claude-sonnet-4":
      return callClaude(apiKey, "claude-sonnet-4-20250514", messages);
    case "claude-sonnet-35":
      return callClaude(apiKey, "claude-3-5-sonnet-20241022", messages);
    case "claude-opus":
      return callClaude(apiKey, "claude-3-opus-20240229", messages);
    case "claude-haiku":
      return callClaude(apiKey, "claude-3-haiku-20240307", messages);
    case "gemini-2-5-pro":
      return callGemini(apiKey, "gemini-2.5-pro", messages);
    case "gemini-2-5-flash":
      return callGemini(apiKey, "gemini-2.5-flash", messages);
    case "gemini-2-5-flash-lite":
      return callGemini(apiKey, "gemini-2.5-flash-lite", messages);
    case "gemini-2-5-flash-tts":
      return callGemini(apiKey, "gemini-2.5-flash-tts", messages);
    case "gemini-2-0-flash":
      return callGemini(apiKey, "gemini-2.0-flash", messages);
    case "gemini-2-0-flash-lite":
      return callGemini(apiKey, "gemini-2.0-flash-lite", messages);
    case "gemini-2-0-flash-exp":
      return callGemini(apiKey, "gemini-2.0-flash-exp", messages);
    case "gemini-2-0-flash-live":
      return callGemini(apiKey, "gemini-2.0-flash-live", messages);
    case "gemini-2-5-flash-live":
      return callGemini(apiKey, "gemini-2.5-flash-live", messages);
    case "gemini-2-5-flash-native-audio-dialog":
      return callGemini(apiKey, "gemini-2.5-flash-native-audio-dialog", messages);
    case "gemini-robotics-er-1-5-preview":
      return callGemini(apiKey, "gemini-robotics-er-1.5-preview", messages);
    case "learnlm-2-0-flash-experimental":
      return callGemini(apiKey, "learnlm-2.0-flash-experimental", messages);
    case "perplexity-sonar":
      return callPerplexity(apiKey, messages);
    case "xai-grok-2":
      return callXAI(apiKey, "grok-2-1212", messages);
    case "xai-grok-beta":
      return callXAI(apiKey, "grok-beta", messages);
    default:
      return { content: "", error: "Unsupported AI provider" };
  }
}
