import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface LoadingStateProps {
  stage: "draft" | "optimizing" | "variations";
}

export function LoadingState({ stage }: LoadingStateProps) {
  const { t } = useLanguage();

  const stageText = {
    draft: t("generatingDraft"),
    optimizing: t("optimizing"),
    variations: t("creatingVariations"),
  };

  const stageProgress = {
    draft: 33,
    optimizing: 66,
    variations: 90,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* AI Thinking Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center gap-2">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
            className="w-3 h-3 rounded-full bg-primary"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
            className="w-3 h-3 rounded-full bg-primary"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
            className="w-3 h-3 rounded-full bg-primary"
          />
        </div>

        <h3 className="text-2xl font-bold text-foreground">{t("aiThinking")}</h3>
        <p className="text-muted-foreground">{stageText[stage]}</p>
      </motion.div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={stageProgress[stage]} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{t("generatingDraft")}</span>
          <span>{t("optimizing")}</span>
          <span>{t("creatingVariations")}</span>
        </div>
      </div>

      {/* Skeleton Loaders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-48 rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:1000px_100%]"
          />
        ))}
      </div>
    </div>
  );
}
