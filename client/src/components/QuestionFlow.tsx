import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bot, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@shared/schema";

interface QuestionFlowProps {
  questions: Array<{ id: string; question: string }>;
  onComplete: (answers: Question[]) => void;
}

export function QuestionFlow({ questions, onComplete }: QuestionFlowProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (!currentAnswer.trim()) return;

    const newAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentIndex === questions.length - 1) {
      const finalAnswers: Question[] = questions.map((q) => ({
        id: q.id,
        question: q.question,
        answer: newAnswers[q.id],
      }));
      onComplete(finalAnswers);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t("questionProgress", { current: currentIndex + 1, total: questions.length })}
          </span>
          <span className="font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/20 shrink-0">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 space-y-4">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg font-medium text-foreground"
                >
                  {currentQuestion.question}
                </motion.p>

                <Input
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Cevabınızı yazın..."
                  className="text-base"
                  autoFocus
                  data-testid={`input-question-${currentIndex}`}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={!currentAnswer.trim()}
                size="lg"
                data-testid="button-next-question"
              >
                {currentIndex === questions.length - 1 ? t("generatePrompts") : t("nextQuestion")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
