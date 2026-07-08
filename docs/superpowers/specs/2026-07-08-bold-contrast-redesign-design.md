# Design: "Bold Contrast" Frontend Redesign

## Context

The site went through a "unified design system" redesign on 2026-07-04 (commit `6bc00d8`): blue primary, Inter + JetBrains Mono, card-based sections with shadows, and a hero with gradient blobs, floating animated icons, and fake terminal-window mockups. Despite the polish, it reads as a generic "AI SaaS template" rather than a distinctive personal portfolio.

This redesign replaces that visual system with a **neubrutalist-lite "Bold Contrast" direction**: black/white base, thick solid borders, zero shadows/gradients, and a single loud accent color sampled from the site's actual logo mark (`client/public/favicon-square.png`, `#1068BD`) rather than an invented brand color.

An earlier pass at this same problem explored an "editorial/typography-first" direction (warm paper palette, serif display type, faded numbered lists) — that direction was explicitly rejected as feeling old/vintage rather than modern. This spec supersedes it entirely; no serif type or warm/cream tones are used anywhere.

## Goals

- Replace the generic-SaaS visual language (soft shadows, gradient blobs, pill badges, floating decorative icons) with a bold, graphic, unmistakably contemporary look.
- Derive the accent color from the project's actual brand asset instead of an arbitrary choice.
- Keep the redesign to the public-facing site; leave internal/admin surfaces untouched.
- Preserve all existing functionality, data-testid hooks, and content structure — this is a visual system change, not a content or IA change.

## Non-Goals / Out of Scope

- Admin dashboard (`pages/admin/*`, `pages/admin-dashboard.tsx`), auth page (`pages/auth-page.tsx`), and the image tool (`pages/image-tool.tsx`) are not restyled. They keep the current design system.
- No changes to routing, data fetching, content schema, or section visibility/reordering logic.
- No changes to the actual logo image asset used in the nav (`/logo.png`) — only its color is sampled for use as the site accent; the image itself is unchanged.
- Not introducing any new font family. Inter and JetBrains Mono (already loaded) are the only typefaces.

## Visual Language

### Color

Single accent, used boldly (solid fills, hard borders, highlight blocks) rather than sparingly or as a soft tint:

| Token | Light mode | Dark mode |
|---|---|---|
| `--background` | `hsl(0 0% 98%)` (#FAFAFA) | `hsl(0 0% 5%)` (#0D0D0D) |
| `--foreground` | `hsl(0 0% 4%)` (#0A0A0A) | `hsl(0 0% 97%)` (#F7F7F7) |
| `--border` / `--card-border` | `hsl(0 0% 8%)` — solid, high-contrast, 2px | `hsl(0 0% 88%)` — solid, high-contrast, 2px |
| `--card` | equal to `--background` (no tint — borders carry the separation, not surface color) | equal to `--background` |
| `--primary` / accent | `hsl(210 84% 40%)` (#1068BD, sampled from `favicon-square.png`) | `hsl(210 90% 60%)` (brightened for dark-bg contrast) |
| `--primary-foreground` | `hsl(0 0% 98%)` | `hsl(0 0% 5%)` |

Shadows are eliminated: all `--shadow-*` tokens resolve to `none`, and `surface-card` / `surface-card-interactive` drop `shadow-sm`/`hover:shadow-md` entirely. Hover/active feedback comes from border or fill-color changes, not elevation.

### Shape

- Border width standardizes on **2px solid** wherever a boundary is shown (cards, nav frame, buttons' secondary variant, list dividers) — thin 1px hairlines are retired.
- `--radius` shrinks from `.5rem` to `.25rem` (sharp-to-minimal corners; small enough to avoid soft/rounded "SaaS" read, not so sharp everywhere becomes visually harsh on text-heavy areas).
- No gradients, no blurred decorative shapes, no backdrop-blur glass effect on the nav.

### Typography

- No new font is added. Headlines use **Inter at 800/900 weight** with tight tracking (`tracking-tighter` / `-0.03em`) instead of the current 700 weight — this is the entire typographic differentiation from body text, achieved with zero additional font payload.
- Eyebrow labels/section labels/tags switch from the current pill-badge treatment to **uppercase JetBrains Mono**, no background chrome.
- Body text stays Inter at existing weights/sizes.
- The unused `--font-serif` token in `index.css`/`tailwind.config.ts` is removed since nothing references it.

### Motion

Kept at the "minimal" level already validated: simple fade/slide-up on scroll-into-view for section entrances (existing `whileInView` pattern in `SectionHeader` and section grids stays). Removed entirely:
- Floating/bouncing icon animations in the hero
- Gradient blob elements
- Fake terminal-window mockups
- The bouncing scroll-down arrow (replaced with a static icon button, no `animate-bounce`)

## Shared Components

These are edited once and cascade to every section that uses them:

- **`SectionHeader.tsx`** — drop the `section-eyebrow` pill (rounded-full background badge); replace with a plain uppercase mono label, no background. Title keeps `SectionHeader`'s existing size scale but at the new heavier weight.
- **`index.css` utilities** — `surface-card` becomes `border-2 border-card-border bg-card` (no radius-heavy rounding, no shadow); `surface-card-interactive` becomes a border/fill color transition instead of `hover:shadow-md hover:-translate-y-0.5`. The `.section-eyebrow` pill utility class is removed (superseded by the mono-label pattern above).
- **`Navigation.tsx`** — scrolled state switches from `bg-background/85 backdrop-blur-xl` to a solid `bg-background` with a `border-b-2 border-border`; the active-link indicator (currently an animated `motion.span` underline in `bg-primary`) keeps its animation but renders as a bolder 2-3px accent-colored bar. Mobile menu, scroll-spy logic, and all `data-testid`s are unchanged.
- **`Footer.tsx`** — recolors to the new tokens and 2px border treatment; no structural change.
- **`ContentRenderer.tsx`** — the pill-style image/link caption chrome (`rounded-full`, `backdrop-blur-sm`) restyles to the bordered, non-blurred treatment consistent with the rest of the site.

## Section-by-Section Mapping

| Section | Treatment |
|---|---|
| **Hero** | Bold heavy-weight name with the surname rendered as a solid accent-colored highlight block (not italic, not gradient text). Mono uppercase eyebrow ("MACHINE LEARNING SCIENTIST"). One small solid accent-colored square as the sole decorative mark (top corner). Thin top border. All floating icons/blobs/terminal-window mockups removed. |
| **Projects, Certifications** | Numbered-index list inside a single 2px-bordered box: bold accent-colored numbers (01, 02, …), 2px border-bottom between rows, no per-item card/shadow. Tags become bordered chips (2px border, no fill) instead of soft `bg-muted` pills. |
| **Experience** | Same company → expandable-project structure and interaction behavior retained; company entries get the same numbering treatment; the shadowed `Card` wrapper is replaced with a 2px-bordered panel. |
| **Skills** | Bordered panels (2px border, no shadow, no hover-lift) replacing `surface-card-interactive`. Skill tags become bordered chips matching Projects/Certifications. |
| **Knowledge Vault, Blog, Series** | Rule-based list — no card containers — using 2px border-bottom dividers between entries instead of hairlines. Existing timeline/date, search, and filter-chip functionality is unchanged, just restyled to the bordered-chip / no-pill language. |
| **Education, Contact** | Plain typographic blocks; no border/card treatment needed given how little content each holds. |

## Technical Notes

- All token changes live in `client/src/index.css` (`:root` and `.dark` custom properties) and `tailwind.config.ts` (`borderRadius` scale) — components consume them via existing Tailwind classes (`bg-background`, `border-border`, `text-primary`, etc.), so most section components need class-level edits (swapping shadow/rounded/pill classes for border/mono equivalents) rather than structural rewrites.
- `framer-motion` stays as a dependency (still used for the minimal fade/slide-in and the nav active-indicator), but all usages tied to removed decoration (floating icons, blob animation loops, bounce) are deleted along with the elements themselves.
- No new npm dependencies, no new font loading.

## Testing & Verification

- All existing `data-testid` attributes are preserved unchanged so any existing test/automation hooks keep working.
- Manual verification pass (per the `verify` skill): run the dev server, visually check each of the 11 public sections plus Navigation/Footer in both light and dark mode, confirm scroll-spy/mobile-menu/expand-collapse interactions still function, and confirm no console errors from removed components.
- No automated visual regression suite exists in this repo today; this redesign does not add one (out of scope).
