# Product

## Register

product

## Users

Thai-first users checking the day's weather and the personal-health implications of it. They open the app a few times a day, often on a phone, often quickly: "what's the air like, do I need a jacket, is the UV bad right now". They want a clear read on the atmosphere and one or two useful suggestions, not a dashboard that performs AI at them.

A second, lighter user is a casual visitor landing from the marketing page (a separate surface, not in this codebase), curious what the product does before signing up.

The app serves the user, not the other way around. Design helps them act; it does not perform for them.

## Product Purpose

Aether AI turns real-time atmospheric conditions (weather, AQI, UV, humidity) into localized, health-aware guidance for daily decisions. The product exists so a person can glance once and know what to wear, whether to go out, and how the air will treat them.

Success is not a feature checklist. It is the user closing the app with one fewer decision to make.

## Brand Personality

Quiet. Precise. Observant.

Like a well-tuned weather instrument: present, accurate, never loud. The brand trusts the data to do the talking. The product reads like a careful local forecaster, not a marketing site.

Three words: **calm, considered, honest.**

## Anti-references

This product must not look like:

- **The current Aether AI implementation.** Glassmorphism by default, side-stripe borders, bento card grids, hero-metric temperature display, robot-watermark icons, glowing progress bars, decorative background orbs, uniform page-enter motion, cyan accent on everything.
- **The marketing PDF at `C:\Users\Admin\Downloads\Typhoon_AI_Weather_Assistant.pdf`.** Itself heavy AI slop: glass cards, gradient text headings, glowing orbs, emoji icons, lens flares, identical 3×2 bento with heart/noodle/lightbulb, glowing arrows connecting nodes, big phone mockups floating in clouds. The product is the opposite of that pitch deck.
- **2026 AI-default scaffolds.** Cream/sand body backgrounds, identical card grids, tiny uppercase tracked eyebrows on every section, numbered `01 · 02 · 03` markers above every heading, gradient text, bento layouts as a reflex.
- **Generic SaaS chrome.** Not Linear / Vercel / Stripe / Notion templates. No glass nav, no SaaS-blue accents, no identical card components, no marketing-ese.
- **Tron / sci-fi chrome.** No neon-on-black, no hex-grid backgrounds, no Mass-Effect glow. The product is a tool, not a setting.
- **AI-on-the-sleeve iconography.** No robot emojis, no "AI-Powered" badges, no sparkle/star "magic" icons, no "Aether Intelligence" signature on every AI message. The output is the proof. If the response is good, the user does not need a label telling them it is AI.

## Design Principles

1. **Show, don't decorate.** Every visual element earns its place by serving the data. If removing it would not change the user's decision, remove it. No decorative background orbs, no watermarks, no glow for its own sake.
2. **Restrained palette, one accent.** Tinted neutrals toward the brand hue, plus one saffron accent (≤10% of surface) used for emphasis and only emphasis. Status colors are deliberately muted.
3. **Localized intelligence is the brand.** The product is Thai-first, so the data and the suggestions are local. The interface gets out of the way of the language and the numbers; the user is here for both.
4. **Vary the layout.** A dashboard of identical icon-plus-label-plus-value cards is a tell. Real interfaces give different content different shapes: a hero for the dominant number, a strip for the forecast, a row of definitions for the metrics.
5. **Calm motion, never reflex.** No uniform fadeInUp on every page, no spinning indicator that has nothing to indicate, no shimmer on a bar that is not loading. Motion follows meaning.

## Accessibility & Inclusion

- WCAG 2.1 AA minimum: 4.5:1 body text against its background, 3:1 for large text and non-text UI.
- All interactive elements reachable and operable by keyboard alone, with visible focus states.
- `prefers-reduced-motion: reduce` honored for every animation. Decorative motion is dropped, not just shortened.
- Status colors paired with text or icon (not color alone) so color-blind users get the same signal.
- Sufficient touch targets on mobile (≥44×44 CSS px).
- Localized Thai microcopy where the user has set Thai; English as fallback.
