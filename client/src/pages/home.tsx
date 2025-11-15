import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { decryptApiKey } from "@/lib/encryption";
import { PromptInput } from "@/components/PromptInput";
import { ModeSelection } from "@/components/ModeSelection";
import { QuestionFlow } from "@/components/QuestionFlow";
import { LoadingState } from "@/components/LoadingState";
import { PromptResults } from "@/components/PromptResults";
import type { Settings, Question, PromptResult } from "@shared/schema";

type Stage = "input" | "mode-selection" | "questions" | "loading" | "results";
type LoadingStage = "draft" | "optimizing" | "variations";

export default function Home() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [stage, setStage] = useState<Stage>("input");
  const [userPrompt, setUserPrompt] = useState("");
  const [mode, setMode] = useState<"quick" | "detailed">("quick");
  const [questions, setQuestions] = useState<Array<{ id: string; question: string }>>([]);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>("draft");
  const [result, setResult] = useState<PromptResult | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check settings on mount
  useEffect(() => {
    const saved = localStorage.getItem("ai-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Decrypt API keys when loading
      setSettings({
        ...parsed,
        ai1ApiKey: decryptApiKey(parsed.ai1ApiKey),
        ai2ApiKey: decryptApiKey(parsed.ai2ApiKey),
      });
    }
  }, []);

  const hasSettings = settings?.ai1ApiKey && settings?.ai2ApiKey;

  const handlePromptSubmit = (prompt: string) => {
    if (!hasSettings) return;
    
    setUserPrompt(prompt);
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsAnimating(false);
      setStage("mode-selection");
    }, 1200);
  };

  const handleModeSelect = async (selectedMode: "quick" | "detailed") => {
    setMode(selectedMode);
    
    if (selectedMode === "quick") {
      setStage("loading");
      await generatePrompts();
    } else {
      // Generate questions
      setStage("loading");
      setLoadingStage("draft");
      
      try {
        const response = await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userPrompt,
            ai1Provider: settings!.ai1Provider,
            ai1ApiKey: settings!.ai1ApiKey,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate questions");
        }

        const data = await response.json();
        setQuestions(data.questions);
        setStage("questions");
      } catch (error) {
        console.error("Error generating questions:", error);
        toast({
          title: t("error"),
          description: t("apiError"),
          variant: "destructive",
        });
        setStage("input");
      }
    }
  };

  const handleQuestionsComplete = async (answers: Question[]) => {
    setStage("loading");
    await generatePrompts(answers);
  };

  const generatePrompts = async (questionAnswers?: Question[]) => {
    setLoadingStage("draft");
    
    try {
      const response = await fetch("/api/generate-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt,
          mode,
          questions: questionAnswers,
          ai1Provider: settings!.ai1Provider,
          ai1ApiKey: settings!.ai1ApiKey,
          ai2Provider: settings!.ai2Provider,
          ai2ApiKey: settings!.ai2ApiKey,
        }),
      });

      setLoadingStage("optimizing");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate prompts");
      }

      setLoadingStage("variations");
      
      const data: PromptResult = await response.json();
      setResult(data);
      setStage("results");
    } catch (error) {
      console.error("Error generating prompts:", error);
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("apiError"),
        variant: "destructive",
      });
      setStage("input");
    }
  };

  const handleRegenerate = async () => {
    setStage("loading");
    await generatePrompts();
  };

  const handleNewPrompt = () => {
    setStage("input");
    setUserPrompt("");
    setMode("quick");
    setQuestions([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <Link href="/settings">
            <Button variant="ghost" size="icon" data-testid="button-settings">
              <SettingsIcon className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!hasSettings && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{t("settingsRequired")}</span>
              <Link href="/settings">
                <Button variant="outline" size="sm" data-testid="link-go-to-settings">
                  {t("goToSettings")}
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="min-h-[60vh] flex items-center justify-center py-12">
          {stage === "input" && (
            <PromptInput
              onSubmit={handlePromptSubmit}
              isAnimating={isAnimating}
            />
          )}

          {stage === "mode-selection" && (
            <ModeSelection onSelect={handleModeSelect} />
          )}

          {stage === "questions" && (
            <QuestionFlow
              questions={questions}
              onComplete={handleQuestionsComplete}
            />
          )}

          {stage === "loading" && (
            <LoadingState stage={loadingStage} />
          )}

          {stage === "results" && result && (
            <PromptResults
              result={result}
              onRegenerate={handleRegenerate}
              onNewPrompt={handleNewPrompt}
            />
          )}
        </div>
      </main>
    </div>
  );
}
