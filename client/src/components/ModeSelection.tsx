import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Sparkles, Sliders } from "lucide-react";
import { motion } from "framer-motion";

interface ModeSelectionProps {
  onSelect: (mode: "quick" | "detailed") => void;
}

export function ModeSelection({ onSelect }: ModeSelectionProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
    >
      {/* Quick Mode */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-primary to-chart-2 rounded-lg opacity-75"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <Card
          onClick={() => onSelect("quick")}
          className="relative p-8 cursor-pointer hover-elevate active-elevate-2 transition-all border-2 hover:border-primary/50 bg-background"
          data-testid="card-quick-mode"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/20">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{t("quickMode")}</h3>
            <p className="text-muted-foreground">{t("quickModeDesc")}</p>
          </div>
        </Card>
      </motion.div>

      {/* Detailed Mode */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-chart-2 to-primary rounded-lg opacity-75"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <Card
          onClick={() => onSelect("detailed")}
          className="relative p-8 cursor-pointer hover-elevate active-elevate-2 transition-all border-2 hover:border-chart-2/50 bg-background"
          data-testid="card-detailed-mode"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-chart-2/20">
              <Sliders className="w-8 h-8 text-chart-2" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{t("detailedMode")}</h3>
            <p className="text-muted-foreground">{t("detailedModeDesc")}</p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
