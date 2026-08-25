# DiappyMed Design System

DiappyMed is a French-language mobile application for people living with diabetes. It helps users log glycemia (blood-glucose) readings, calculate and record insulin injections, log meals and physical activity, connect to medical devices over Bluetooth, and review trends in a journal.

The design system in this folder reconstructs DiappyMed's visual language from the Figma source so future designs — slides, prototypes, marketing surfaces, new app screens — stay on-brand without reinventing tokens or components.

## Source

- **Figma file:** `UI Design EkiYou V1.0.0.fig` (mounted as a virtual filesystem during creation). 1 main page, 104 frames covering the full mobile app: splash, onboarding, dashboard, glycémie / injection / repas flows, journal, académie, compte, devices.
- **Top fonts:** Poppins (≈800 instances), Inter (≈1000), Karla (rare numeric accent).
- **Top colors:** black, near-black `rgb(24,23,22)`, neutral grey `rgb(217,217,217)`, slate `rgb(44,44,46)`, white, plus brand teal `rgb(50,177,164)` and deep teal `rgb(12,105,128)`.

## Index

- `README.md` — this file.
- `colors_and_type.css` — color tokens, type scale, shadows, radii, spacing.
- `assets/` — copied SVG icons, illustrations, logos.
- `preview/` — small HTML cards rendered in the Design System tab.
- `ui_kits/diappymed-app/` — recreations of core mobile screens with reusable JSX components.
- `SKILL.md` — entry point for using this design system as an Agent Skill.

## Products represented

DiappyMed has **one product**: a French mobile app (375×812 — iPhone X-class baseline). No marketing site, no admin dashboard appears in the Figma file. Therefore one UI kit covers the whole brand surface.

---

## CONTENT FUNDAMENTALS

**Language.** All copy is **French (France)**. Use `tu` form (informal, second person singular): _"Bonjour Noémie !"_, _"Ta glycémie est parfaite aujourd'hui !"_. Never `vous`-form for in-app empathy moments — the app is positioned as a companion, not an authority.

**Tone.** Warm, encouraging, calmly clinical. The app deals with daily diabetes management — copy avoids drama and avoids medical jargon where possible. It addresses the user by first name on the dashboard. Praise is gentle and earned ("parfaite aujourd'hui"), never confetti-grade.

**Casing.** Sentence case across UI: titles, buttons, list items. **Never ALL CAPS.** Never Title Case. Buttons read as commands or short phrases — _"Se connecter"_, _"Créer un compte"_, _"Ajouter une glycémie"_, _"Modifier"_ — never one-word imperatives like "GO".

**Punctuation.** French typographic spacing where it appears in screens (space before `?` and `!`): _"Vous n'avez pas encore de compte ?"_, _"Bonjour Noémie !"_. Apostrophes are typographic curly `'`, not straight `'`. Em-dashes are rare; commas and short sentences carry the rhythm.

**Voice patterns.**
- **Greetings/affirmation:** _"Bonjour {prénom} !"_, _"Ta glycémie est parfaite aujourd'hui !"_
- **Action labels:** infinitive verbs — _"Se connecter"_, _"Créer un compte"_, _"Ajouter…"_, _"Modifier…"_, _"Connecter un appareil"_
- **Helper / question:** _"Mot de passe oublié ?"_, _"Vous n'avez pas encore de compte ?"_
- **Domain nouns:** _glycémie_ (blood glucose), _injection_, _insuline_ (rapide / lente), _repas_, _aliment_, _activité physique_, _appareil(s) connecté(s)_, _journal de bord_, _académie_, _compte_, _réglages_
- **Units:** **`mg/dL`** for glucose, **`unités`** for insulin doses, **`g`** for carbohydrates. Always include units inline with numbers.
- **Time stamps:** relative + 24-hour: _"Auj. 18:00"_, _"Hier 09:00"_.

**Emoji.** **Not used.** No emoji anywhere in the app. Iconography is custom + Feather-derived line icons.

**Numbers.** French decimal comma — `59,91 g`, not `59.91 g`. Glucose readings are integers (`154 mg/dL`). Insulin doses are usually integers (`6 unités`, `2 unités`).

**Microcopy examples (verbatim, from screens):**
- "Bonjour Noémie !"
- "Ta glycémie est parfaite aujourd'hui !"
- "Dernière glycémie" / "Dernière injection d'insuline (rapide)"
- "Insuline active"
- "Repas précédent riche"
- "Hypo/hyperglycémie"
- "Injection lente/rapide"
- "Vous n'avez pas encore de compte ?   Créer un compte"
- "Ou se connecter avec"
- "Se souvenir de moi"

---

## VISUAL FOUNDATIONS

**Format.** All screens are designed at **375×812** (iPhone X portrait). Status bar is the iOS 13+ light/dark variant — never hidden. Bottom of every primary screen carries iOS home-indicator pill.

**Color vibe.** Mostly white canvas with **teal** as the only saturated brand accent. A **purple/lavender** secondary appears in the splash illustration and graph strokes; a **soft coral / pink** appears on hyperglycemia bars; a **soft blue** for hypoglycemia. The overall feel is clinical-calm, not playful — closer to Apple Health than to a consumer fitness app.

**Color usage rules.**
- Teal `--dm-teal` is reserved for the primary CTA, success ticks, the active nav state, and key accents. Don't use it for body text or borders.
- Deep teal `--dm-deep-teal` is the focused/active variant — focused tab labels, focused field outlines.
- Purples are **decorative** — only in illustrations and chart strokes, not UI controls.
- Status colors (coral / blue) are reserved for glycémie state visualization. Don't repurpose them for generic warnings.

**Type.** Two families do most of the work: **Poppins** (display, titles, labels, buttons — 500 / 600 / 700) and **Inter** (body, helper text, status bar — 400 / 500 / 700). **Karla** appears only inside graph bubble labels (`14px`, regular). Letter-spacing is slightly negative (`-0.01em`) on most Poppins labels — gives a tighter, calmer feel.

**Hierarchy.** Page title is `Poppins 700 28/38`, sentence-case, in slate `rgb(44,44,46)` (not pure black). Section labels are `Poppins 600 20`. Body is `Poppins 400 14/21` or `Inter 400 14/20`. Captions and timestamps are `Inter 400 12/18` in muted grey.

**Backgrounds.** Pure white canvas dominates. No gradients, no full-bleed photography, no repeating patterns. The only "decorative" backgrounds are a faint shadow-rect under chart areas (4% black) and the **splash illustration** — a stylized purple/teal organic blob with leaf-like Tracé shapes (`Splash_illustration` group). No textures, no noise. **Avoid gradient-heavy treatments**.

**Illustrations.** One signature splash illustration (purple/teal organic abstract, ~210×250) sits centered above the wordmark on the splash. Smaller decorative figure on the dashboard top-left ("illu-home-bonjour"). All illustrations are flat vector, multi-tone purple, no outlines.

**Animation.** Not extensively defined in the static Figma — recommend: gentle ease-in-out, 200–300 ms, fades and small upward translates (4–8 px). No bounces, no dramatic springs. Loaders are subtle radial spinners.

**Hover states.** This is a mobile design — there's a `Property1=HoverState` button variant, mostly used as a "pressed" treatment on touch. Treat hover/press as **slight darken (≈8%)** of fill, no scale change.

**Press states.** Buttons stay flat, no shrink. The teal CTA loses its halo shadow momentarily when pressed; otherwise no transform. No ripples.

**Borders.** Thin (1px), only where a stroke is structurally needed: input outlines (`1px solid rgb(44,44,46)` on focused login field, `1px solid rgb(199,199,204)` on resting fields), card dividers. Toggle / checkbox tracks use `1–2px solid rgb(12,105,128)` when active.

**Shadows.**
- **Card shadow** — `0 3px 3px rgba(0,0,0,0.16)`. Tight, low, used on every elevated tile (history cards, dashboard tiles, status pills).
- **Brand button glow** — `0 3px 22px rgba(50,177,164,0.37)`. The teal CTA carries this halo — it's how primary action signals itself. Reserve strictly for the brand-color CTA.
- **Soft shadow** — `0 20px 40px rgba(0,0,0,0.04)`. Used on chart bubble labels, very subtle.
- **Nav shadow** — `0 2px 16.5px rgba(155,155,155,0.16)`. Sits above the floating bottom nav.

**Capsules vs gradients.** No protection-gradient overlays anywhere. Status indicators use **solid colored capsules / pills** (e.g. mealtime bars, glycemia pills, activity tags). When a label needs to read against a photo or chart, it gets a **white pill with card shadow**, not a translucent overlay.

**Layout rules.**
- Side gutter: **21–29 px** on iPhone-X width (29 px is most common for forms; 21 px for dashboard tiles).
- Vertical rhythm: 8-pt grid with 4-pt allowed for tight clusters.
- The **bottom nav** is fixed (`top: 685` — that's `812 − 127`), with a 40 px transparent overhang and a notched cutout for the central FAB.
- Status bar is always present and matches dark/light page chrome (white time on dark hero pages, black time on white pages).
- Floating elements (FAB-style chart bubble label) use absolute positioning with the soft shadow, never a hard stroke.

**Transparency / blur.** Used sparingly. Two cases observed:
1. Subtle illustration overlays at `opacity: 0.08–0.58` (decorative, e.g. shadow blob behind splash mascot, axis labels at 58% opacity).
2. `backdrop-filter: blur(10px)` on a few small mono icons — likely an export artifact; treat as **optional** and skip in production. **No frosted-glass panels.**

**Imagery temperament.** When app uses photos (food thumbnails in "Ajouter un aliment"), they're warm, soft-lit, neutrally styled. Slight saturation reduction is fine. Avoid black-and-white treatment; avoid grain.

**Corner radii.** A two-tier system: `6px` (buttons, cards, dashboard tiles) and `10px` (inputs). Pills are fully rounded (`100px` or `radius:50%`). The bubble-graph labels use `16px / 160px` — visually a stadium pill. **Avoid 12 / 14 / 24 px** — they aren't in the system.

**Cards.** White fill, `6px` radius, **card shadow** (`0 3px 3px rgba(0,0,0,0.16)`), no border. Padding is typically `12–16 px`. Cards are flat — no header strip, no left border accent, no gradient. **Avoid the "rounded box with colored left border" cliché — DiappyMed never does this.**

**Density.** Comfortable, not dense. Touch targets are 42 px tall (button) or 44 px (input). The dashboard breathes — large white margins between sections.

---

## ICONOGRAPHY

DiappyMed uses **two coexisting icon styles**:

1. **Custom domain glyphs** — small flat-fill SVGs for diabetes-specific concepts: `glycemie.svg` (blood-drop), `injection.svg` (syringe), `bluetooth.svg`. These are tiny (≈9–16 px), single-color (`rgb(0,0,0)` or white inverted on colored backgrounds), and only used in dashboard tiles and status pills. They live in `assets/icons/`.

2. **Feather Icons** (line, 2 px stroke, rounded caps) — used for general UI: check, chevron, bluetooth (the "feather" variant), more-vertical, calculator, arrow-up, etc. The Figma file labels them `Regular15pxXxx` — 15 px nominal.

**Guidance.**
- For domain concepts (glycémie, insuline, repas, activité, appareil) **use the custom SVGs** in `assets/icons/`.
- For everything else (navigation chrome, settings rows, list affordances) **use Feather** — load from CDN: `https://unpkg.com/feather-icons` or vendored SVGs. Feather's stroke style and proportions match the Figma source.
- **Stroke weight:** 1.5–2 px, rounded line-cap and line-join.
- **Icon sizes:** 16, 20, 24 px. Tab-bar icons render around 24×24 inside a 32×32 container.
- **Color:** match text color of the row (`--dm-fg`, or `--dm-deep-teal` when active). Never multi-color.

**Emoji.** Not used. Don't add emoji to any DiappyMed surface.

**Unicode glyphs.** Not used as icons. The bullet dot in legends is a tiny SVG circle, not `•`.

**Logos.** The wordmark is the typeset string **"Diappymed"** in **Poppins Medium 22px** (sometimes 28 with the splash illustration above it). There is no separate logo mark in the file — the splash illustration acts as a brand symbol but isn't isolated as a standalone logo. Treat the wordmark as the official mark for now. **(Caveat — flag for the user: confirm if there is a separate logo asset elsewhere.)**

---

## Caveats & substitutions

- **Fonts** — Poppins, Inter, Karla are all free Google Fonts; the Figma uses standard weights. Loaded via Google Fonts CDN in `colors_and_type.css`. No font files needed.
- **Logo** — Only a wordmark exists in the Figma file. If a real logomark exists, please share it and I'll integrate.
- **Iconography** — Domain-specific SVGs are exact copies. General UI icons substitute Feather (closest stroke match). If there's an internal icon library, please attach.
- **Animation specs** — Inferred (no Lottie / motion file in the source). Confirmed direction: gentle, no bounces.
