import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Sparkles, Globe, X } from "lucide-react";
import { aiProviders, type AIProvider, type Settings } from "@shared/schema";
import { encryptApiKey, decryptApiKey } from "@/lib/encryption";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [settings, setSettings] = useState<Settings>({
    ai1Provider: "gemini-2-5-flash",
    ai1ApiKey: "",
    ai2Provider: "gemini-2-5-pro",
    ai2ApiKey: "",
    language: language,
  });

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

  const handleSave = () => {
    if (!settings.ai1ApiKey || !settings.ai2ApiKey) {
      toast({
        title: t("error"),
        description: "Lütfen tüm API anahtarlarını girin",
        variant: "destructive",
      });
      return;
    }

    // Encrypt API keys before saving
    const encryptedSettings = {
      ...settings,
      ai1ApiKey: encryptApiKey(settings.ai1ApiKey),
      ai2ApiKey: encryptApiKey(settings.ai2ApiKey),
    };

    localStorage.setItem("ai-settings", JSON.stringify(encryptedSettings));
    setLanguage(settings.language);
    
    toast({
      title: t("settingsSaved"),
      description: "Ayarlarınız başarıyla kaydedildi",
    });

    // Ana sayfaya yönlendir
    setTimeout(() => setLocation("/"), 500);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <SettingsIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("settings")}</h1>
              <p className="text-muted-foreground">{t("aiConfiguration")}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="hover:bg-primary/10"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* AI Configuration */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">{t("aiConfiguration")}</h2>
          </div>

          {/* AI-1 Configuration */}
          <div className="space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-chart-2/20 text-chart-2 text-sm font-mono">AI-1</span>
              {t("ai1Label")}
            </Label>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="ai1-provider">{t("selectModel")}</Label>
                <Select
                  value={settings.ai1Provider}
                  onValueChange={(value) => setSettings({ ...settings, ai1Provider: value as AIProvider })}
                >
                  <SelectTrigger id="ai1-provider" data-testid="select-ai1-provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aiProviders.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {t(`providers.${provider}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai1-key">{t("apiKey")}</Label>
                <Input
                  id="ai1-key"
                  type="password"
                  placeholder={t("apiKeyPlaceholder")}
                  value={settings.ai1ApiKey}
                  onChange={(e) => setSettings({ ...settings, ai1ApiKey: e.target.value })}
                  data-testid="input-ai1-key"
                />
              </div>
            </div>
          </div>

          {/* AI-2 Configuration */}
          <div className="space-y-4 pt-4 border-t border-border">
            <Label className="text-base font-semibold flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-primary/20 text-primary text-sm font-mono">AI-2</span>
              {t("ai2Label")}
            </Label>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="ai2-provider">{t("selectModel")}</Label>
                <Select
                  value={settings.ai2Provider}
                  onValueChange={(value) => setSettings({ ...settings, ai2Provider: value as AIProvider })}
                >
                  <SelectTrigger id="ai2-provider" data-testid="select-ai2-provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aiProviders.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {t(`providers.${provider}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai2-key">{t("apiKey")}</Label>
                <Input
                  id="ai2-key"
                  type="password"
                  placeholder={t("apiKeyPlaceholder")}
                  value={settings.ai2ApiKey}
                  onChange={(e) => setSettings({ ...settings, ai2ApiKey: e.target.value })}
                  data-testid="input-ai2-key"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Language Settings */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">{t("language")}</h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">{t("language")}</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => setSettings({ ...settings, language: value as "tr" | "en" })}
            >
              <SelectTrigger id="language" data-testid="select-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tr">{t("turkish")}</SelectItem>
                <SelectItem value="en">{t("english")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            size="lg"
            className="min-w-[200px]"
            data-testid="button-save-settings"
          >
            {t("saveSettings")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
