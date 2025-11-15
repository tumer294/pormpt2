# AI-Powered Prompt Engineering Tool - Design Guidelines

## Design Approach

**Reference-Based Approach** drawing inspiration from:
- **Linear**: Clean typography, smooth micro-interactions, modern color palette
- **ChatGPT**: Focused input areas, clear conversation flow, minimal distractions
- **Vercel**: Gradient accents, glass-morphism effects, sophisticated animations
- **Midjourney**: Creative loading states, engaging AI processing feedback

**Core Principle**: Create a sophisticated, future-forward interface that makes AI collaboration feel magical while maintaining functional clarity.

---

## Color Palette

### Dark Mode (Primary)
- **Background**: 
  - Base: 240 10% 8%
  - Surface: 240 10% 12%
  - Elevated: 240 8% 16%
- **Primary Brand**: 
  - Main: 260 95% 65% (vibrant purple)
  - Hover: 260 95% 70%
  - Active: 260 95% 60%
- **Accent**: 
  - Beam/Glow: 180 100% 50% (cyan) - for the splitting beam animation
  - Success: 142 76% 45% (emerald)
- **Text**:
  - Primary: 240 10% 95%
  - Secondary: 240 5% 70%
  - Muted: 240 5% 50%
- **Border**: 240 10% 20%

### Light Mode (Secondary)
- **Background**:
  - Base: 0 0% 100%
  - Surface: 240 20% 98%
  - Elevated: 240 20% 96%
- **Primary Brand**: 260 80% 50%
- **Text**:
  - Primary: 240 10% 10%
  - Secondary: 240 5% 30%

---

## Typography

**Font Families**:
- **Primary**: 'Inter', sans-serif (via Google Fonts CDN)
- **Monospace**: 'JetBrains Mono', monospace (for prompt display)

**Scale**:
- Hero/Title: text-4xl font-bold (36px)
- Section Headers: text-2xl font-semibold (24px)
- Body: text-base font-medium (16px)
- Small/Caption: text-sm (14px)
- Tiny/Labels: text-xs (12px)

**Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4, p-6, p-8
- Section spacing: space-y-6, space-y-8, space-y-12
- Container gaps: gap-4, gap-6, gap-8

**Container Widths**:
- Main workspace: max-w-4xl mx-auto
- Prompt display area: max-w-3xl
- Full-width sections: w-full with inner max-w-6xl

**Grid System**:
- Two-option split: grid-cols-1 md:grid-cols-2 gap-6
- Question-answer layout: Single column with max-w-2xl

---

## Component Library

### 1. Hero Input Section
- **Centered full-viewport landing**: min-h-screen flex items-center
- **Large gradient-backed input area**: 
  - Glass-morphism effect: backdrop-blur-xl bg-white/5 border border-white/10
  - Rounded corners: rounded-2xl
  - Generous padding: p-8
  - Subtle glow effect on focus
- **Input field**:
  - Large text area: min-h-[120px]
  - Placeholder in Turkish: "Promptunuzu buraya yazın..."
  - Auto-resize as user types
  - Submit with Enter key or gradient button

### 2. Beam Animation Transition
- **Shrinking effect**: Scale down input box from scale-100 to scale-50
- **Positioning**: Translate to right side (translate-x-[40%])
- **Beam visual**: 
  - Horizontal cyan gradient line (180 100% 50%)
  - Width animation from 0% to 100%
  - Pulse/glow effect using box-shadow
  - Splits into two beams (one going up, one going down)
- **Duration**: 1.2s total animation
- **Timing**: ease-out curve

### 3. Two-Option Selection Cards
- **Layout**: Two side-by-side cards with equal height
- **Left Card - "Sana Güveniyorum"**:
  - Icon: Sparkles or Magic Wand (Heroicons)
  - Title: text-xl font-semibold
  - Description: 2-3 satır açıklama metni
  - Gradient border on hover
  - Purple accent glow
- **Right Card - "Ayrıntıları Belirle"**:
  - Icon: Adjustments/Sliders
  - Same styling as left
  - Cyan accent glow
- **Hover state**: Scale up slightly (scale-105), increase glow
- **Interactive cursor**: cursor-pointer

### 4. Question-Answer Flow (Ayrıntılı Mod)
- **Question card**:
  - AI avatar/icon on left
  - Question text with typing animation
  - Fade in from bottom
- **Input types**:
  - Text input for open responses
  - Radio buttons for multiple choice
  - Checkboxes for multi-select
  - All with modern styling: rounded borders, focus states
- **Progress indicator**: 
  - Step counter: "Soru 2/4"
  - Linear progress bar at top
  - Percentage filled with primary color

### 5. Loading/Processing States
- **Progress bar**:
  - Full-width at top: w-full h-1
  - Animated gradient fill
  - Indeterminate animation (moving shine)
- **"AI Düşünüyor..." text**:
  - Centered, text-lg
  - Typing dots animation (three dots pulsing)
  - Subtle bounce animation
- **Skeleton loaders**:
  - For prompt preview areas
  - Shimmer effect: linear-gradient animation
  - Rounded rectangles matching final content

### 6. Two Prompt Results Display
- **Side-by-side layout**: grid-cols-1 lg:grid-cols-2 gap-8
- **Each prompt card**:
  - Header: "Seçenek 1" / "Seçenek 2"
  - Monospace font for prompt text
  - Dark background with syntax-like highlighting
  - Max height with scroll: max-h-96 overflow-y-auto
  - Custom scrollbar styling
- **Action buttons per card**:
  - "Bu Promptu Seç" - Primary button
  - "Kopyala" - Secondary outline button
  - Success feedback on copy (checkmark animation)
- **Comparison indicator**: 
  - Visual highlighting of selected option
  - Dim/fade the non-selected option

### 7. Navigation Elements
- **Header** (if needed):
  - Logo/App name on left
  - "Yeni Prompt" button on right
  - Sticky positioning: sticky top-0
  - Glass-morphism backdrop
- **Action buttons**:
  - Primary: Solid purple background, white text
  - Secondary: Outline with purple border, purple text
  - Ghost: No border, hover background
  - All with rounded-lg, px-6 py-3

### 8. Micro-interactions
- **Button hover**: Scale-105, brightness increase
- **Card hover**: Subtle lift (shadow-xl), border glow
- **Input focus**: Ring-2 ring-primary, glow effect
- **Copy success**: Checkmark icon with scale animation + brief color flash
- **Error states**: Shake animation, red border flash

---

## Animation Strategy

**Use Framer Motion for**:
- Page transitions (fade + slide)
- Beam split animation
- Card entrance animations (stagger children)
- Button interactions
- Scale/opacity changes

**Timing**:
- Quick interactions: 200ms
- Standard transitions: 400ms
- Dramatic effects (beam): 1200ms
- Easing: ease-out for most, ease-in-out for reversible

**Animation Budget**: Focus animations on:
1. Beam split effect (hero moment)
2. Option card appearances
3. Typing/loading indicators
4. Prompt result reveal
Avoid: Background parallax, scroll-triggered animations, continuous loops (except loading states)

---

## Responsive Behavior

**Breakpoints**:
- Mobile: Base styles, single column
- Tablet (md): 768px - two columns where appropriate
- Desktop (lg): 1024px - full multi-column layouts

**Mobile Adjustments**:
- Stack two-option cards vertically
- Reduce padding: p-4 instead of p-8
- Smaller text sizes
- Full-width buttons
- Simplified beam animation (less dramatic split)

---

## Images

**No hero images required** - this is a tool-focused application. Visual interest comes from:
- Gradient backgrounds
- Glass-morphism effects
- Animated UI elements
- Iconography (Heroicons for all icons)

**Icon Usage**:
- Sparkles/Stars for AI magic
- Adjustments for customization
- Lightning for speed
- Check for success states
- Copy icon for clipboard actions

---

## Accessibility

- Maintain dark mode as primary (reduce eye strain for long sessions)
- All interactive elements have visible focus states (ring-2)
- Color contrast ratio minimum 4.5:1 for text
- Keyboard navigation fully supported
- Loading states announced to screen readers
- Success/error feedback both visual and textual

---

## Turkish Language Implementation

All interface text in Turkish:
- "Sana Güveniyorum" / "Ayrıntıları Belirle"
- "AI düşünüyor..."
- "Bu Promptu Seç"
- "Kopyala"
- "Yeni Prompt Oluştur"
- "Tekrar Oluştur"
- Question prompts in natural Turkish

---

This design creates a premium, AI-forward experience that feels both professional and magical, with generous use of modern visual effects while maintaining functional clarity.