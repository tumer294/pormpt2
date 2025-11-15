import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isAnimating: boolean;
}

export function PromptInput({ onSubmit, isAnimating }: PromptInputProps) {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={
        isAnimating
          ? { opacity: 0.3, scale: 0.4 }
          : { opacity: 1, scale: 1 }
      }
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="backdrop-blur-xl bg-card/50 border border-card-border rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
            <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder={t("inputPlaceholder")}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[120px] resize-none text-base bg-background/50"
            data-testid="input-prompt"
          />
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t("pressEnter")}</p>
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              size="lg"
              data-testid="button-generate"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t("generateButton")}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
