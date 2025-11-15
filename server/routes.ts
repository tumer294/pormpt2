import type { Express } from "express";
import { createServer, type Server } from "http";
import { callAI } from "./ai-providers";
import { rateLimiter } from "./rate-limit";
import {
  generateQuestionsRequestSchema,
  generatePromptRequestSchema,
  type QuestionsResponse,
  type PromptResult,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate questions for detailed mode
  app.post("/api/generate-questions", rateLimiter, async (req, res) => {
    try {
      const data = generateQuestionsRequestSchema.parse(req.body);

      const systemPrompt = `Sen bir prompt mühendisliği uzmanısın. Kullanıcının verdiği prompt için, daha iyi bir prompt oluşturmak amacıyla 3-7 arasında önemli soru sor. 

ÖNEMLI KURALLAR:
- Prompt basit ve açıksa 3-4 soru sor
- Prompt karmaşık ve detaylı ise 5-7 soru sor
- Sorular MUTLAKA şunları içermeli:
  * Hedef kitle (kimler için?)
  * Amaç ve kullanım alanı (ne için kullanılacak?)
  * ÇIKTI YAPISI (eğer metin: madde halinde mi, paragraf mı, liste mi? / eğer görsel: gerçekçi mi, çizim mi, sulu boya mı, dijital sanat mı?)
  * Ton ve stil (resmi mi, samimi mi, teknik mi?)
  * Bağlam ve özel gereksinimler

Soruları JSON formatında döndür:
{
  "questions": [
    {"id": "1", "question": "Soru metni burada"},
    {"id": "2", "question": "Soru metni burada"},
    ...
  ]
}`;

      const response = await callAI(
        data.ai1Provider,
        data.ai1ApiKey,
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Kullanıcının promptu: "${data.userPrompt}"` },
        ]
      );

      if (response.error) {
        console.error(`AI-1 (${data.ai1Provider}) error:`, response.error);
        return res.status(500).json({
          error: `${data.ai1Provider} API hatası: ${response.error}. Lütfen API anahtarınızı kontrol edin.`
        });
      }

      // Parse JSON response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return res.status(500).json({ error: "Invalid AI response format" });
      }

      const questions: QuestionsResponse = JSON.parse(jsonMatch[0]);
      res.json(questions);
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(400).json({ error: String(error) });
    }
  });

  // Generate prompts (quick or detailed mode)
  app.post("/api/generate-prompts", rateLimiter, async (req, res) => {
    try {
      const startTime = Date.now();
      const data = generatePromptRequestSchema.parse(req.body);

      // Build context from questions if in detailed mode
      let contextInfo = "";
      if (data.mode === "detailed" && data.questions) {
        contextInfo = "\n\nKullanıcının verdiği ek bilgiler:\n" +
          data.questions.map(q => `- ${q.question}: ${q.answer}`).join("\n");
      }

      // Step 1: AI-1 generates draft prompt
      const ai1SystemPrompt = `Sen bir prompt mühendisliği uzmanısın. Kullanıcının isteğine göre etkili, optimize edilmiş bir prompt taslağı oluştur. Prompt net, anlaşılır ve kullanıcının hedefine ulaşmasını sağlayacak şekilde olmalı.${contextInfo}`;

      const ai1Response = await callAI(
        data.ai1Provider,
        data.ai1ApiKey,
        [
          { role: "system", content: ai1SystemPrompt },
          { role: "user", content: `Şu konu için prompt oluştur: "${data.userPrompt}"` },
        ]
      );

      if (ai1Response.error) {
        console.error(`AI-1 (${data.ai1Provider}) error:`, ai1Response.error);
        return res.status(500).json({
          error: `${data.ai1Provider} API hatası: ${ai1Response.error}. Lütfen API anahtarınızı kontrol edin.`
        });
      }

      // Step 2: AI-2 optimizes and creates two variations
      const ai2SystemPrompt = `Sen bir üst düzey prompt optimizasyon uzmanısın. Sana verilen taslak promptu analiz et ve iki farklı optimize edilmiş varyasyon oluştur. Her varyasyon benzersiz bir yaklaşım sunmalı ve profesyonel kalitede olmalı.${contextInfo}

İki promptu şu JSON formatında döndür:
{
  "option1": "Birinci optimize prompt burada",
  "option2": "İkinci optimize prompt burada"
}`;

      const ai2Response = await callAI(
        data.ai2Provider,
        data.ai2ApiKey,
        [
          { role: "system", content: ai2SystemPrompt },
          { role: "user", content: `Taslak prompt: "${ai1Response.content}"\n\nBu promptu optimize et ve iki farklı varyasyon oluştur.` },
        ]
      );

      if (ai2Response.error) {
        console.error(`AI-2 (${data.ai2Provider}) error:`, ai2Response.error);
        return res.status(500).json({
          error: `${data.ai2Provider} API hatası: ${ai2Response.error}. Lütfen API anahtarınızı kontrol edin.`
        });
      }

      // Parse JSON response
      const jsonMatch = ai2Response.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return res.status(500).json({ error: "Invalid AI response format" });
      }

      const variations = JSON.parse(jsonMatch[0]);
      const processingTime = (Date.now() - startTime) / 1000;

      const result: PromptResult = {
        option1: variations.option1,
        option2: variations.option2,
        metadata: {
          ai1Provider: data.ai1Provider,
          ai2Provider: data.ai2Provider,
          processingTime,
          mode: data.mode,
        },
      };

      res.json(result);
    } catch (error) {
      console.error("Error generating prompts:", error);
      res.status(400).json({ error: String(error) });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}