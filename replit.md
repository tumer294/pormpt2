# AI Prompt Mühendisi - İki Aşamalı Prompt Optimizasyon Aracı

## Proje Özeti
Yapay zeka destekli iki aşamalı prompt mühendisliği uygulaması. Kullanıcıların hedefleri için güçlü, optimize edilmiş promptlar oluşturmasını sağlayan interaktif bir platform.

## Temel Özellikler

### MVP Özellikleri
1. **Prompt Girişi & Animasyonlar**
   - Ana sayfa prompt input alanı
   - Enter sonrası ışın animasyonu ile mod seçimine geçiş
   - Framer Motion ile akıcı animasyonlar

2. **İki Mod Sistemi**
   - **Sana Güveniyorum**: Otomatik prompt oluşturma
   - **Ayrıntıları Belirle**: 3-5 soru ile detaylı prompt oluşturma

3. **AI Entegrasyonu**
   - AI-1: Taslak prompt üretimi
   - AI-2: Optimizasyon ve iki varyasyon oluşturma
   - Çoklu AI provider desteği (OpenAI, Claude, Gemini, Perplexity, xAI)

4. **Ayarlar Sistemi**
   - AI model seçimi (her aşama için ayrı)
   - API key yönetimi (localStorage'da güvenli saklama)
   - Türkçe/İngilizce dil desteği
   - Tarayıcı dilinden otomatik algılama

5. **Sonuç Ekranı**
   - İki prompt seçeneği gösterimi
   - Kopyalama özelliği
   - Tekrar oluştur / Yeni prompt butonları

## Teknik Mimari

### Frontend
- **Framework**: React + TypeScript + Vite
- **Routing**: Wouter
- **Stil**: Tailwind CSS + Shadcn UI
- **Animasyon**: Framer Motion
- **State**: React Hooks + localStorage
- **i18n**: Custom context-based dil sistemi

### Backend (Yapılacak - Task 2)
- **Framework**: Express.js
- **AI Integration**: OpenAI, Anthropic, Google Gemini, Perplexity, xAI
- **Validation**: Zod schemas

### Veri Modeli
```typescript
// AI Provider types
type AIProvider = "openai-gpt4" | "openai-gpt35" | "claude-sonnet" | 
                  "claude-opus" | "gemini-pro" | "gemini-flash" | 
                  "perplexity" | "xai-grok"

// Settings
interface Settings {
  ai1Provider: AIProvider
  ai1ApiKey: string
  ai2Provider: AIProvider
  ai2ApiKey: string
  language: "tr" | "en"
}

// Prompt Generation Request
interface GeneratePromptRequest {
  userPrompt: string
  mode: "quick" | "detailed"
  questions?: Question[]
  ai1Provider: AIProvider
  ai1ApiKey: string
  ai2Provider: AIProvider
  ai2ApiKey: string
}

// Result
interface PromptResult {
  option1: string
  option2: string
  metadata: {
    ai1Provider: string
    ai2Provider: string
    processingTime: number
    mode: "quick" | "detailed"
  }
}
```

## Proje Yapısı

```
client/
├── src/
│   ├── components/
│   │   ├── PromptInput.tsx       # Ana prompt giriş bileşeni
│   │   ├── ModeSelection.tsx     # Mod seçim kartları
│   │   ├── QuestionFlow.tsx      # Soru-cevap akışı
│   │   ├── LoadingState.tsx      # Yükleme göstergeleri
│   │   └── PromptResults.tsx     # Sonuç ekranı
│   ├── pages/
│   │   ├── home.tsx              # Ana sayfa
│   │   └── settings.tsx          # Ayarlar sayfası
│   ├── contexts/
│   │   └── LanguageContext.tsx   # Dil yönetimi
│   ├── lib/
│   │   └── i18n.ts              # Çeviri sistemi
│   └── App.tsx                   # Ana uygulama
│
shared/
└── schema.ts                      # Paylaşılan tip tanımları

server/
├── routes.ts                      # API endpoints (yapılacak)
└── storage.ts                     # Veri yönetimi (yapılacak)
```

## Kullanıcı Akışı

1. **Başlangıç**
   - Kullanıcı ana sayfada prompt yazar
   - Enter veya butona tıklar

2. **Animasyon**
   - Input kutusu küçülür ve sağa kayar
   - Işın animasyonu ile mod seçimi görünür

3. **Mod Seçimi**
   - "Sana Güveniyorum": Direkt AI işleme geçer
   - "Ayrıntıları Belirle": Soru-cevap aşamasına geçer

4. **Soru-Cevap (Detaylı Mod)**
   - AI dinamik olarak 3-5 soru sorar
   - Kullanıcı her soruya cevap verir
   - Progress bar ile ilerleme gösterilir

5. **AI İşleme**
   - AI-1: Taslak prompt üretir
   - AI-2: Optimize eder ve iki varyasyon oluşturur
   - Loading animasyonları gösterilir

6. **Sonuç**
   - İki prompt seçeneği sunulur
   - Kullanıcı istediğini seçip kopyalar
   - Tekrar oluştur veya yeni prompt seçenekleri

## API Key Güvenliği

- API anahtarları localStorage'da saklanır
- Backend'de şifreleme yapılacak (Task 2)
- API çağrıları backend üzerinden yapılacak
- Frontend'de API key'ler asla açığa çıkmaz

## Dil Desteği

- Tarayıcı dilinden otomatik algılama (`navigator.language`)
- Türkçe (tr) ve İngilizce (en) desteği
- Ayarlardan manuel dil değiştirme
- localStorage'da tercih saklama

## Tasarım Sistemi

### Renkler (Dark Mode Primary)
- **Primary**: Purple (260 95% 65%)
- **Accent/Beam**: Cyan (180 100% 50%)
- **Background**: Dark (240 10% 8%)
- **Card**: Elevated dark (240 10% 12%)

### Tipografi
- **Sans**: Inter
- **Mono**: JetBrains Mono (prompt gösterimi için)

### Animasyonlar
- Beam pulse (ışın nabzı)
- Typing dots (yazı noktaları)
- Slide up (yukarı kayma)
- Shimmer (parıltı yükleme)

## Gelecek Özellikler (Next Phase)

1. Prompt geçmişi saklama (localStorage veya DB)
2. AI performans karşılaştırması
3. Favori promptlar sistemi
4. Paylaşım link oluşturma
5. Etiketleme sistemi

## Geliştirme Notları

### ✅ Yapılan (Task 1 - Schema & Frontend)
✅ Tüm veri modelleri ve TypeScript interface'leri
✅ Design system kurulumu (tailwind.config.ts, index.html)
✅ i18n sistemi (TR/EN) - Tarayıcı dilinden otomatik algılama
✅ Tüm React component'leri
✅ Responsive tasarım
✅ Framer Motion animasyonları
✅ Routing (Home, Settings)
✅ localStorage ile settings yönetimi

### ✅ Yapılan (Task 2 - Backend)
✅ AI provider helper fonksiyonları (OpenAI, Claude, Gemini, Perplexity, xAI)
✅ `/api/generate-questions` endpoint - Dinamik soru üretimi
✅ `/api/generate-prompts` endpoint - İki aşamalı prompt üretimi
✅ Zod validation ile güvenli input handling
✅ Error handling ve response formatting

### 🔄 Yapılıyor (Task 3 - Integration)
✅ Frontend-Backend API bağlantısı
✅ Error handling ile toast notifications
✅ Loading state transitions
- [ ] End-to-end testing
- [ ] Architect review
- [ ] Final polish

## Önemli Kararlar

1. **AI Model Esnekliği**: Kullanıcı her iki AI aşaması için farklı model seçebilir
2. **Güvenlik**: API key'ler backend'de işlenir, frontend'de saklanmaz
3. **UX**: Animasyonlar kullanıcı deneyimini zenginleştirir ama engel olmaz
4. **i18n**: Tarayıcı dilinden otomatik algılama ile kolay kullanım
5. **Modülerlik**: Her component bağımsız, yeniden kullanılabilir

## Son Güncelleme
Task 1 tamamlandı - Tüm frontend component'leri ve schema'lar hazır.
