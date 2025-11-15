import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Copy, RotateCw, Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { PromptResult } from "@shared/schema";

interface PromptResultsProps {
  result: PromptResult;
  onRegenerate: () => void;
  onNewPrompt: () => void;
}

export function PromptResults({ result, onRegenerate, onNewPrompt }: PromptResultsProps) {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<1 | 2 | null>(null);
  const [copiedOption, setCopiedOption] = useState<1 | 2 | null>(null);

  const handleCopy = async (option: 1 | 2) => {
    const text = option === 1 ? result.option1 : result.option2;
    await navigator.clipboard.writeText(text);
    setCopiedOption(option);
    setTimeout(() => setCopiedOption(null), 2000);
  };

  const handleSelect = (option: 1 | 2) => {
    setSelectedOption(option);
    handleCopy(option);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Results Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Option 1 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            className={`p-6 space-y-4 transition-all ${
              selectedOption === 1
                ? "border-2 border-primary shadow-lg shadow-primary/20"
                : selectedOption === 2
                ? "opacity-50"
                : ""
            }`}
            data-testid="card-option-1"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {t("option")} 1
              </h3>
              {selectedOption === 1 && (
                <div className="flex items-center gap-2 text-primary">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">{t("copied")}</span>
                </div>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              <pre className="font-mono text-sm bg-muted/50 p-4 rounded-lg whitespace-pre-wrap break-words">
                {result.option1}
              </pre>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleSelect(1)}
                className="flex-1"
                variant={selectedOption === 1 ? "default" : "outline"}
                data-testid="button-select-option-1"
              >
                {selectedOption === 1 ? t("copied") : t("selectPrompt")}
              </Button>
              <Button
                onClick={() => handleCopy(1)}
                variant="ghost"
                size="icon"
                data-testid="button-copy-option-1"
              >
                {copiedOption === 1 ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Option 2 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            className={`p-6 space-y-4 transition-all ${
              selectedOption === 2
                ? "border-2 border-primary shadow-lg shadow-primary/20"
                : selectedOption === 1
                ? "opacity-50"
                : ""
            }`}
            data-testid="card-option-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {t("option")} 2
              </h3>
              {selectedOption === 2 && (
                <div className="flex items-center gap-2 text-primary">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">{t("copied")}</span>
                </div>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              <pre className="font-mono text-sm bg-muted/50 p-4 rounded-lg whitespace-pre-wrap break-words">
                {result.option2}
              </pre>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleSelect(2)}
                className="flex-1"
                variant={selectedOption === 2 ? "default" : "outline"}
                data-testid="button-select-option-2"
              >
                {selectedOption === 2 ? t("copied") : t("selectPrompt")}
              </Button>
              <Button
                onClick={() => handleCopy(2)}
                variant="ghost"
                size="icon"
                data-testid="button-copy-option-2"
              >
                {copiedOption === 2 ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Button
          onClick={onRegenerate}
          variant="outline"
          size="lg"
          data-testid="button-regenerate"
        >
          <RotateCw className="w-4 h-4 mr-2" />
          {t("regenerate")}
        </Button>
        <Button
          onClick={onNewPrompt}
          size="lg"
          data-testid="button-new-prompt"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("newPrompt")}
        </Button>
      </motion.div>

      {/* Metadata */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-muted-foreground"
      >
        <p>
          AI-1: {result.metadata.ai1Provider} • AI-2: {result.metadata.ai2Provider} •{" "}
          {result.metadata.processingTime.toFixed(1)}s
        </p>
      </motion.div>
    </div>
  );
}
