# Bold Contrast Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current generic-SaaS visual system (soft shadows, gradient blobs, pill badges, floating decorative icons) with the "Bold Contrast" neubrutalist-lite design across all public-facing pages, per `docs/superpowers/specs/2026-07-08-bold-contrast-redesign-design.md`.

**Architecture:** Token-first: redefine color/radius/shadow custom properties in `client/src/index.css` and `tailwind.config.ts`, then update shared primitives/components that consume those tokens (Button, Card, Badge, SectionHeader, Navigation, Footer, ContentRenderer), then update each of the 10 content sections to use the new bordered/no-shadow/numbered-index/rule-list patterns. Later tasks depend on the tokens and shared components landing first.

**Tech Stack:** React 18 + TypeScript, Vite, Tailwind CSS (CSS-custom-property driven theme), Radix UI / shadcn primitives, framer-motion, TanStack Query. No test framework exists in this repo (no Jest/Vitest/Playwright) — verification is `npm run check` (TypeScript) plus manual browser checks against the running dev server (`npm run dev`, http://localhost:5000).

## Global Constraints

- Accent color is `#1068BD` (sampled from `client/public/favicon-square.png`), light-mode `hsl(210 84% 40%)`, dark-mode `hsl(210 90% 60%)` — no other brand color is introduced.
- Borders are **2px solid** everywhere a boundary is shown; **zero box-shadows** anywhere in the redesigned surfaces.
- `--radius` shrinks from `.5rem` to `.25rem`; `tailwind.config.ts`'s `borderRadius.lg/md/sm` scale shrinks proportionally.
- No new font family is introduced. Headlines use Inter at 800/900 weight with tight tracking; eyebrow/meta labels use JetBrains Mono uppercase. The unused `--font-serif` token is removed.
- Motion stays at "minimal": fade/slide-up on scroll-into-view only. No floating icons, gradient blobs, fake terminal windows, or bounce animation.
- Scope is public pages only: `client/src/components/*.tsx` (except `ContentEditor.tsx`, which is admin-only) and `client/src/pages/home.tsx`'s rendered tree. Admin dashboard, auth page, and image-tool page are untouched.
- Every existing `data-testid` attribute must be preserved verbatim.
- No new npm dependencies.

---

## Task 1: Design tokens (index.css + tailwind.config.ts)

**Files:**
- Modify: `client/src/index.css:1-166` (`:root` and `.dark` blocks), `:342-355` (`surface-card`/`section-eyebrow` utilities)
- Modify: `tailwind.config.ts:8-12` (`borderRadius`), `:85-89` (`fontFamily`)

**Interfaces:**
- Consumes: nothing (this is the foundation task).
- Produces: `--background`, `--foreground`, `--border`, `--card`, `--card-border`, `--primary`, `--primary-foreground`, `--secondary`, `--muted`, `--accent`, `--input`, `--ring`, `--radius`, all `--shadow-*` (now `none`), and the `.surface-card` / `.surface-card-interactive` / `.section-eyebrow` utility classes that every later task relies on. `--font-serif` is removed.

- [ ] **Step 1: Replace the light-mode (`:root`) color and shape tokens**

In `client/src/index.css`, replace this block (lines 12–59, everything from `--background` through `--spacing`):

```css
  --background: 210 25% 99%;
  --foreground: 216 28% 12%;
  --border: 214 18% 90%;
  --card: 0 0% 100%;
  --card-foreground: 216 28% 13%;
  --card-border: 214 20% 92%;
  --sidebar: 212 22% 97%;
  --sidebar-foreground: 216 22% 18%;
  --sidebar-border: 214 16% 89%;
  --sidebar-primary: 217 85% 44%;
  --sidebar-primary-foreground: 210 100% 98%;
  --sidebar-accent: 214 20% 91%;
  --sidebar-accent-foreground: 216 20% 22%;
  --sidebar-ring: 217 85% 44%;
  --popover: 0 0% 100%;
  --popover-foreground: 216 24% 14%;
  --popover-border: 214 18% 88%;
  --primary: 217 85% 44%;
  --primary-foreground: 210 100% 98%;
  --secondary: 214 22% 93%;
  --secondary-foreground: 216 22% 21%;
  --muted: 214 22% 94%;
  --muted-foreground: 215 15% 42%;
  --accent: 202 30% 92%;
  --accent-foreground: 204 28% 21%;
  --destructive: 0 72% 45%;
  --destructive-foreground: 0 72% 98%;
  --input: 214 20% 82%;
  --ring: 217 85% 44%;
  --chart-1: 210 75% 35%;
  --chart-2: 195 70% 38%;
  --chart-3: 180 65% 42%;
  --chart-4: 165 60% 45%;
  --chart-5: 150 55% 48%;
  --font-sans: Inter, sans-serif;
  --font-serif: Georgia, serif;
  --font-mono: JetBrains Mono, monospace;
  --radius: .5rem;
  --shadow-2xs: 0px 1px 2px 0px hsl(210 30% 20% / 0.04);
  --shadow-xs: 0px 1px 3px 0px hsl(210 30% 20% / 0.06), 0px 1px 2px -1px hsl(210 30% 20% / 0.04);
  --shadow-sm: 0px 2px 4px 0px hsl(210 30% 20% / 0.07), 0px 1px 2px -1px hsl(210 30% 20% / 0.05);
  --shadow: 0px 3px 6px 0px hsl(210 30% 20% / 0.08), 0px 2px 4px -1px hsl(210 30% 20% / 0.06);
  --shadow-md: 0px 4px 8px -1px hsl(210 30% 20% / 0.10), 0px 2px 4px -2px hsl(210 30% 20% / 0.06);
  --shadow-lg: 0px 8px 16px -2px hsl(210 30% 20% / 0.12), 0px 4px 6px -3px hsl(210 30% 20% / 0.06);
  --shadow-xl: 0px 16px 32px -4px hsl(210 30% 20% / 0.14), 0px 8px 12px -4px hsl(210 30% 20% / 0.08);
  --shadow-2xl: 0px 24px 48px -8px hsl(210 30% 20% / 0.18);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
```

with:

```css
  --background: 0 0% 98%;
  --foreground: 0 0% 4%;
  --border: 0 0% 8%;
  --card: 0 0% 98%;
  --card-foreground: 0 0% 4%;
  --card-border: 0 0% 8%;
  --sidebar: 0 0% 96%;
  --sidebar-foreground: 0 0% 9%;
  --sidebar-border: 0 0% 8%;
  --sidebar-primary: 210 84% 40%;
  --sidebar-primary-foreground: 0 0% 98%;
  --sidebar-accent: 0 0% 91%;
  --sidebar-accent-foreground: 0 0% 9%;
  --sidebar-ring: 210 84% 40%;
  --popover: 0 0% 98%;
  --popover-foreground: 0 0% 4%;
  --popover-border: 0 0% 8%;
  --primary: 210 84% 40%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 93%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 94%;
  --muted-foreground: 0 0% 35%;
  --accent: 0 0% 91%;
  --accent-foreground: 0 0% 9%;
  --destructive: 0 72% 45%;
  --destructive-foreground: 0 72% 98%;
  --input: 0 0% 80%;
  --ring: 210 84% 40%;
  --chart-1: 210 75% 35%;
  --chart-2: 195 70% 38%;
  --chart-3: 180 65% 42%;
  --chart-4: 165 60% 45%;
  --chart-5: 150 55% 48%;
  --font-sans: Inter, sans-serif;
  --font-mono: JetBrains Mono, monospace;
  --radius: .25rem;
  --shadow-2xs: none;
  --shadow-xs: none;
  --shadow-sm: none;
  --shadow: none;
  --shadow-md: none;
  --shadow-lg: none;
  --shadow-xl: none;
  --shadow-2xl: none;
  --tracking-normal: 0em;
  --spacing: 0.25rem;
```

Note `--font-serif` is dropped entirely (it was only ever referenced by the now-removed `tailwind.config.ts` `fontFamily.serif` entry — Step 4 removes that side).

- [ ] **Step 2: Bump `--button-outline` and `--badge-outline` to solid, visible values**

Still in the `:root` block, replace:

```css
  --button-outline: rgba(0,0,0, .10);
  --badge-outline: rgba(0,0,0, .05);
```

with:

```css
  --button-outline: rgba(10,10,10, .85);
  --badge-outline: rgba(10,10,10, .85);
```

(These feed the `outline` Button variant and `outline` Badge variant — at 10%/5% opacity they were near-invisible hairlines; Bold Contrast needs them to render as solid 2px borders.)

- [ ] **Step 3: Replace the dark-mode (`.dark`) color tokens**

Replace this block (the `.dark` class body, from `--background` through `--shadow-2xl`, currently lines 96–137):

```css
  --background: 220 24% 7%;
  --foreground: 214 20% 93%;
  --border: 217 16% 17%;
  --card: 219 22% 9%;
  --card-foreground: 214 18% 92%;
  --card-border: 217 18% 14%;
  --sidebar: 219 20% 10%;
  --sidebar-foreground: 214 16% 88%;
  --sidebar-border: 217 16% 16%;
  --sidebar-primary: 213 90% 62%;
  --sidebar-primary-foreground: 221 40% 8%;
  --sidebar-accent: 217 18% 16%;
  --sidebar-accent-foreground: 214 16% 86%;
  --sidebar-ring: 213 90% 62%;
  --popover: 219 22% 11%;
  --popover-foreground: 214 18% 91%;
  --popover-border: 217 18% 18%;
  --primary: 213 90% 62%;
  --primary-foreground: 221 40% 8%;
  --secondary: 217 18% 16%;
  --secondary-foreground: 214 16% 86%;
  --muted: 217 18% 14%;
  --muted-foreground: 215 14% 66%;
  --accent: 213 20% 17%;
  --accent-foreground: 212 18% 84%;
  --destructive: 0 68% 46%;
  --destructive-foreground: 0 68% 97%;
  --input: 217 16% 25%;
  --ring: 213 90% 62%;
  --chart-1: 210 75% 65%;
  --chart-2: 195 70% 68%;
  --chart-3: 180 65% 70%;
  --chart-4: 165 60% 72%;
  --chart-5: 150 55% 75%;
  --shadow-2xs: 0px 1px 2px 0px hsl(210 18% 0% / 0.16);
  --shadow-xs: 0px 1px 3px 0px hsl(210 18% 0% / 0.20), 0px 1px 2px -1px hsl(210 18% 0% / 0.14);
  --shadow-sm: 0px 2px 4px 0px hsl(210 18% 0% / 0.22), 0px 1px 2px -1px hsl(210 18% 0% / 0.16);
  --shadow: 0px 3px 6px 0px hsl(210 18% 0% / 0.24), 0px 2px 4px -1px hsl(210 18% 0% / 0.18);
  --shadow-md: 0px 4px 8px -1px hsl(210 18% 0% / 0.28), 0px 2px 4px -2px hsl(210 18% 0% / 0.18);
  --shadow-lg: 0px 8px 16px -2px hsl(210 18% 0% / 0.32), 0px 4px 6px -3px hsl(210 18% 0% / 0.18);
  --shadow-xl: 0px 16px 32px -4px hsl(210 18% 0% / 0.36), 0px 8px 12px -4px hsl(210 18% 0% / 0.22);
  --shadow-2xl: 0px 24px 48px -8px hsl(210 18% 0% / 0.40);
```

with:

```css
  --background: 0 0% 5%;
  --foreground: 0 0% 97%;
  --border: 0 0% 88%;
  --card: 0 0% 5%;
  --card-foreground: 0 0% 97%;
  --card-border: 0 0% 88%;
  --sidebar: 0 0% 7%;
  --sidebar-foreground: 0 0% 90%;
  --sidebar-border: 0 0% 88%;
  --sidebar-primary: 210 90% 60%;
  --sidebar-primary-foreground: 0 0% 5%;
  --sidebar-accent: 0 0% 16%;
  --sidebar-accent-foreground: 0 0% 88%;
  --sidebar-ring: 210 90% 60%;
  --popover: 0 0% 5%;
  --popover-foreground: 0 0% 97%;
  --popover-border: 0 0% 88%;
  --primary: 210 90% 60%;
  --primary-foreground: 0 0% 5%;
  --secondary: 0 0% 14%;
  --secondary-foreground: 0 0% 90%;
  --muted: 0 0% 13%;
  --muted-foreground: 0 0% 62%;
  --accent: 0 0% 16%;
  --accent-foreground: 0 0% 88%;
  --destructive: 0 68% 46%;
  --destructive-foreground: 0 68% 97%;
  --input: 0 0% 30%;
  --ring: 210 90% 60%;
  --chart-1: 210 75% 65%;
  --chart-2: 195 70% 68%;
  --chart-3: 180 65% 70%;
  --chart-4: 165 60% 72%;
  --chart-5: 150 55% 75%;
  --shadow-2xs: none;
  --shadow-xs: none;
  --shadow-sm: none;
  --shadow: none;
  --shadow-md: none;
  --shadow-lg: none;
  --shadow-xl: none;
  --shadow-2xl: none;
```

Also update the dark-mode outline vars, which sit near the top of the same `.dark { ... }` block, immediately after the opening brace (before `--opaque-button-border-intensity`):

```css
  --button-outline: rgba(255,255,255, .10);
  --badge-outline: rgba(255,255,255, .05);
```

to:

```css
  --button-outline: rgba(247,247,247, .85);
  --badge-outline: rgba(247,247,247, .85);
```

- [ ] **Step 4: Redefine `surface-card`, `surface-card-interactive`, and `section-eyebrow` utilities**

Find (around line 342 in the `@layer utilities` block):

```css
  /* Shared card treatment: consistent surface, border, hover lift */
  .surface-card {
    @apply rounded-xl border border-card-border bg-card shadow-sm transition-all duration-200;
  }

  .surface-card-interactive {
    @apply hover:shadow-md hover:-translate-y-0.5 hover:border-primary/25;
  }

  /* Section eyebrow pill used by SectionHeader */
  .section-eyebrow {
    @apply inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.12em] uppercase border border-primary/20 bg-primary/5 text-primary;
  }
```

Replace with:

```css
  /* Shared card treatment: 2px border, no shadow, no elevation */
  .surface-card {
    @apply rounded-md border-2 border-card-border bg-card transition-colors duration-150;
  }

  .surface-card-interactive {
    @apply hover:border-primary;
  }

  /* Section eyebrow label used by SectionHeader: plain mono label, no pill chrome */
  .section-eyebrow {
    @apply inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground;
  }
```

- [ ] **Step 5: Update `tailwind.config.ts` radius scale and remove the serif font entry**

Replace:

```ts
      borderRadius: {
        lg: ".5625rem", /* 9px */
        md: ".375rem", /* 6px */
        sm: ".1875rem", /* 3px */
      },
```

with:

```ts
      borderRadius: {
        lg: ".3125rem", /* 5px */
        md: ".1875rem", /* 3px */
        sm: ".125rem", /* 2px */
      },
```

Replace:

```ts
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
```

with:

```ts
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
```

- [ ] **Step 6: Verify**

Run: `npm run check`
Expected: no new TypeScript errors (this task only touches CSS/config, so output should match whatever baseline `npm run check` produced before this change).

Run: `npm run dev` (if not already running), open `http://localhost:5000` in a browser.
Expected: the page still loads (unstyled-looking in places until later tasks land — this is expected, since components still reference classes like `shadow-sm`/`rounded-xl`/`rounded-full` that Tailwind will still happily generate, they just won't visually clash yet since the underlying tokens changed). Confirm there are no console errors and the page isn't blank.

- [ ] **Step 7: Commit**

```bash
git add client/src/index.css tailwind.config.ts
git commit -m "feat: switch design tokens to Bold Contrast palette"
```

---

## Task 2: Shared UI primitives (Button, Card, Badge)

**Files:**
- Modify: `client/src/components/ui/button.tsx:7-40`
- Modify: `client/src/components/ui/card.tsx:5-18`
- Modify: `client/src/components/ui/badge.tsx:6-26`

**Interfaces:**
- Consumes: `--button-outline`, `--badge-outline`, `--card-border` tokens from Task 1.
- Produces: `Button`, `Card`, `Badge` components render with 2px borders, no shadows, no `rounded-xl`/`rounded-full` — every later task's use of these components inherits this automatically.

- [ ] **Step 1: Update `buttonVariants` in `button.tsx`**

Replace:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  " hover-elevate active-elevate-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary-border",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive-border",
        outline:
          // Shows the background color of whatever card / sidebar / accent background it is inside of.
          // Inherits the current text color.
          " border [border-color:var(--button-outline)]  shadow-xs active:shadow-none ",
        secondary: "border bg-secondary text-secondary-foreground border border-secondary-border ",
        // Add a transparent border so that when someone toggles a border on later, it doesn't shift layout/size.
        ghost: "border border-transparent",
      },
```

with:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  " hover-elevate active-elevate-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-2 border-primary-border",
        destructive:
          "bg-destructive text-destructive-foreground border-2 border-destructive-border",
        outline:
          // Shows the background color of whatever card / sidebar / accent background it is inside of.
          // Inherits the current text color.
          " border-2 [border-color:var(--button-outline)] ",
        secondary: "border-2 bg-secondary text-secondary-foreground border-secondary-border ",
        // Add a transparent border so that when someone toggles a border on later, it doesn't shift layout/size.
        ghost: "border-2 border-transparent",
      },
```

- [ ] **Step 2: Update `Card` in `card.tsx`**

Replace:

```tsx
    className={cn(
      "shadcn-card rounded-xl border bg-card border-card-border text-card-foreground shadow-sm",
      className
    )}
```

with:

```tsx
    className={cn(
      "shadcn-card rounded-md border-2 bg-card border-card-border text-card-foreground",
      className
    )}
```

- [ ] **Step 3: Update `badgeVariants` in `badge.tsx`**

Replace:

```tsx
const badgeVariants = cva(
  // Whitespace-nowrap: Badges should never wrap.
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" +
  " hover-elevate " ,
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-xs",

        outline: " border [border-color:var(--badge-outline)] shadow-xs",
      },
    },
```

with:

```tsx
const badgeVariants = cva(
  // Whitespace-nowrap: Badges should never wrap.
  "whitespace-nowrap inline-flex items-center rounded-md border-2 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" +
  " hover-elevate " ,
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",

        outline: " border-[color:var(--badge-outline)]",
      },
    },
```

- [ ] **Step 4: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser, open the admin login button or any rendered `Button`/`Badge`/`Card` (e.g. scroll to Skills section) and confirm they now show a visible 2px border and no drop shadow.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/ui/button.tsx client/src/components/ui/card.tsx client/src/components/ui/badge.tsx
git commit -m "feat: restyle Button/Card/Badge primitives for Bold Contrast"
```

---

## Task 3: SectionHeader

**Files:**
- Modify: `client/src/components/SectionHeader.tsx:14-40`

**Interfaces:**
- Consumes: `.section-eyebrow` utility from Task 1.
- Produces: every section that renders `<SectionHeader icon label title subtitle? action? centered? />` (Experience, Skills, Projects, Knowledge Vault, Blog, Series, Certifications, Education, Contact) picks up the new heading style automatically — no prop signature change.

- [ ] **Step 1: Update the title weight/tracking and eyebrow spacing**

Replace:

```tsx
        <div className={centered ? "mx-auto" : ""}>
          <span className={`section-eyebrow mb-4 ${centered ? "justify-center" : ""}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
```

with:

```tsx
        <div className={centered ? "mx-auto" : ""}>
          <span className={`section-eyebrow mb-3 ${centered ? "justify-center" : ""}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter">{title}</h2>
```

- [ ] **Step 2: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser, scroll to any section (e.g. Skills) and confirm the eyebrow label now renders as plain uppercase mono text (no pill background) and the title is heavier/tighter.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/SectionHeader.tsx
git commit -m "feat: restyle SectionHeader eyebrow and title for Bold Contrast"
```

---

## Task 4: Navigation

**Files:**
- Modify: `client/src/components/Navigation.tsx:70-73` (scrolled bar), `:105` (active indicator), `:171-174` (mobile active link)

**Interfaces:**
- Consumes: `--border`, `--primary` tokens from Task 1.
- Produces: no prop/behavior change — scroll-spy, mobile menu open/close, and all `data-testid`s are unchanged.

- [ ] **Step 1: Replace the glassy scrolled-state background with a solid bar + thick border**

Replace:

```tsx
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen
        ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm"
        : "bg-transparent border-b border-transparent"
        }`}
```

with:

```tsx
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen
        ? "bg-background border-b-2 border-border"
        : "bg-transparent border-b-2 border-transparent"
        }`}
```

- [ ] **Step 2: Make the active-link indicator a bold bar instead of a thin rounded underline**

Replace:

```tsx
                      className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
```

with:

```tsx
                      className="absolute inset-x-2 -bottom-px h-[3px] bg-primary"
```

- [ ] **Step 3: Drop the soft tint on the active mobile-menu link**

Replace:

```tsx
                      className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
```

with:

```tsx
                      className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
```

- [ ] **Step 4: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser: scroll the page down past 20px and confirm the nav bar switches to a solid background with a visible 2px bottom border (no blur). Click through nav links and confirm the active-link bar renders as a bold 3px accent-colored bar. Open the mobile menu (resize below `md`) and confirm the active item still highlights correctly.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/Navigation.tsx
git commit -m "feat: restyle Navigation bar and active indicator for Bold Contrast"
```

---

## Task 5: Footer

**Files:**
- Modify: `client/src/components/Footer.tsx:17`, `:21`

**Interfaces:**
- Consumes: `--border` token from Task 1.
- Produces: no structural/prop change.

- [ ] **Step 1: Flatten the footer background and thicken its top border**

Replace:

```tsx
    <footer className="border-t border-border bg-muted/30">
```

with:

```tsx
    <footer className="border-t-2 border-border bg-background">
```

- [ ] **Step 2: Bump the wordmark weight**

Replace:

```tsx
            <span className="font-bold text-lg tracking-tight">Parit Kansal</span>
```

with:

```tsx
            <span className="font-extrabold text-lg tracking-tighter">Parit Kansal</span>
```

- [ ] **Step 3: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser, scroll to the bottom of the page and confirm the footer has a flat background and a visible 2px top border.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/Footer.tsx
git commit -m "feat: restyle Footer for Bold Contrast"
```

---

## Task 6: ContentRenderer

**Files:**
- Modify: `client/src/components/ContentRenderer.tsx:29`, `:46`, `:156`, `:165`, `:174`, `:185`, `:193`, `:200`, `:217`, `:227`, `:266`

**Interfaces:**
- Consumes: `--border` token from Task 1.
- Produces: no prop/behavior change — used by `KnowledgeVaultSection` and `BlogSection`/`SeriesSection` reader views (Tasks 12–14) to render rich content blocks.

- [ ] **Step 1: Replace every `rounded-lg overflow-hidden border bg-muted/50` media wrapper with the thick-border equivalent**

This exact class string appears 4 times (iframe wrapper at line 29, image wrapper at line 156, video wrapper at line 174, pdf wrapper at line 193). Replace each occurrence of:

```
"rounded-lg overflow-hidden border bg-muted/50"
```

with:

```
"rounded-md overflow-hidden border-2 border-border bg-muted/50"
```

(the link block at line 217 uses `"block rounded-lg overflow-hidden border bg-muted/50 hover:bg-muted transition-colors no-underline"` — apply the same substitution there too, keeping the `block`/`hover:bg-muted transition-colors no-underline` suffix: `"block rounded-md overflow-hidden border-2 border-border bg-muted/50 hover:bg-muted transition-colors no-underline"`)

- [ ] **Step 2: Replace blurred captions with solid, bordered captions**

Replace each of the 4 occurrences of:

```
className="p-3 text-sm text-center text-muted-foreground bg-background/50 backdrop-blur-sm border-t"
```
or
```
className="p-3 text-sm text-center text-muted-foreground bg-background/50 backdrop-blur-sm"
```

(lines 46, 165, 185, 200 — two have a trailing `border-t`, two don't) with:

```
className="p-3 text-sm text-center text-muted-foreground bg-background border-t-2 border-border"
```

(all four become the bordered version, since every caption now needs a visible top rule to separate it from the media above it now that the translucent blur is gone.)

- [ ] **Step 3: Replace the blurred link-preview icon pill**

Replace:

```tsx
                                            <span className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-background/80 text-foreground backdrop-blur-sm border">
```

with:

```tsx
                                            <span className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-background text-foreground border-2 border-border">
```

- [ ] **Step 4: Add a border to the code block**

Replace:

```tsx
                            <div key={index} className="rounded-md bg-muted p-4 overflow-x-auto font-mono text-sm my-4">
```

with:

```tsx
                            <div key={index} className="rounded-md border-2 border-border bg-muted p-4 overflow-x-auto font-mono text-sm my-4">
```

- [ ] **Step 5: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser, open a Knowledge Vault or Blog entry that has an image/video/link block with a caption and confirm captions render on a solid (not blurred) background with a visible top border, and media wrappers show a 2px border.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/ContentRenderer.tsx
git commit -m "feat: restyle ContentRenderer media chrome for Bold Contrast"
```

---

## Task 7: HeroSection

**Files:**
- Modify: `client/src/components/HeroSection.tsx` (full rewrite of the file body)

**Interfaces:**
- Consumes: `Button`, design tokens from Tasks 1–2.
- Produces: no prop change (this is a page-level component with no props); still reads `/api/resume` and `/api/blog` via the same `useQuery` keys, still exposes `#link-email`, `#link-phone`, `#link-github`, `#link-linkedin`, `button-download-resume`/`-mobile`, `button-scroll-to-work` test ids used elsewhere.

- [ ] **Step 1: Replace the entire file contents**

Replace the full contents of `client/src/components/HeroSection.tsx` with:

```tsx
import { Mail, Phone, ArrowDown, FileText, BookOpen, ArrowRight } from "lucide-react";
import { SiGithub, SiLinkedin, SiPython, SiPytorch, SiTensorflow } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Resume, BlogPost } from "@shared/schema";

const techStack = [
  { Icon: SiPython, label: "Python" },
  { Icon: SiPytorch, label: "PyTorch" },
  { Icon: SiTensorflow, label: "TensorFlow" },
];

export function HeroSection() {
  const { data: resume } = useQuery<Resume>({ queryKey: ["/api/resume"] });
  const { data: posts = [] } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });

  // Pick the series with the most recent post as the featured one
  const seriesMap = new Map<string, BlogPost[]>();
  posts.filter(p => p.seriesName).forEach(p => {
    seriesMap.set(p.seriesName!, [...(seriesMap.get(p.seriesName!) || []), p]);
  });
  const featuredSeries = Array.from(seriesMap.entries())
    .sort((a, b) => Math.max(...b[1].map(p => new Date(p.date).getTime())) - Math.max(...a[1].map(p => new Date(p.date).getTime())))
  [0] ?? null;

  const scrollToWork = () => {
    const element = document.querySelector("#experience");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6">
      <div className="absolute top-6 left-4 right-4 sm:left-6 sm:right-6 h-px bg-border" aria-hidden="true" />
      <div className="absolute top-10 right-4 sm:right-6 w-7 h-7 bg-primary border-2 border-foreground" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground">
            Machine Learning Scientist
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6"
        >
          Parit <mark className="bg-primary text-primary-foreground px-2">Kansal</mark>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Building intelligent systems at scale. Specializing in{" "}
          <span className="text-foreground font-semibold">Computer Vision</span>,{" "}
          <span className="text-foreground font-semibold">NLP</span>, and{" "}
          <span className="text-foreground font-semibold">Deep Learning</span>{" "}
          to solve real-world problems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center justify-center gap-3 mb-10 font-mono"
        >
          {techStack.map(({ Icon, label }, i) => (
            <span key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
              {i < techStack.length - 1 && <span className="text-border ml-1" aria-hidden="true">/</span>}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {resume?.url && (
            <Button asChild size="lg" className="gap-2 w-56">
              <a href={resume.url} target="_blank" rel="noopener noreferrer">
                <FileText className="h-5 w-5" />
                Download Resume
              </a>
            </Button>
          )}
          <Button variant="outline" size="lg" className="gap-2 w-56" onClick={scrollToWork}>
            View Work
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 mb-12"
        >
          <a
            href="mailto:paritkansal121@gmail.com"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-testid="link-email"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            paritkansal121@gmail.com
          </a>
          <span className="hidden sm:inline text-border" aria-hidden="true">|</span>
          <a
            href="tel:+916398950353"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-testid="link-phone"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            +91 639-895-0353
          </a>
          <span className="hidden sm:inline text-border" aria-hidden="true">|</span>
          <div className="flex items-center gap-1">
            <a
              href="https://github.com/ParitKansal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-testid="link-github"
            >
              <SiGithub className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/paritkansal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-testid="link-linkedin"
            >
              <SiLinkedin className="h-5 w-5" />
            </a>
          </div>
        </motion.div>

        {featuredSeries && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-12"
          >
            <button
              onClick={() => document.querySelector("#series")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-md border-2 border-border hover:border-primary transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <BookOpen className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">Currently writing</p>
                <p className="text-sm font-bold text-foreground">{featuredSeries[0]} <span className="text-muted-foreground font-normal">· {featuredSeries[1].length} parts</span></p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-1" aria-hidden="true" />
            </button>
          </motion.div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToWork}
          className="rounded-md"
          aria-label="Scroll to experience"
          data-testid="button-scroll-to-work"
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
```

This removes the `floatingIcons` array, the gradient-blob/ring/SVG-grid decorative layer, the two fake terminal-window mockups, and the `animate-bounce` scroll arrow. It replaces them with a single hairline top rule and one solid accent-colored square as the sole decorative mark, a plain mono eyebrow, and the surname highlighted with a solid accent block instead of a gradient.

- [ ] **Step 2: Verify**

Run: `npm run check`
Expected: passes with no new errors (confirms no leftover references to removed imports like `Sparkles`/`Brain`/`Eye`/`Network`/`Cpu`/`Database`/`MessageSquare`).

Run: `npm run dev`, open `http://localhost:5000`.
Expected: hero renders with no floating icons, no gradient blobs, no fake terminal windows; "Kansal" shows with a solid accent-colored highlight block; "Download Resume"/"View Work" buttons show 2px borders; scroll-to-work arrow is static (no bounce). Toggle dark mode and confirm the accent block and borders still read clearly.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/HeroSection.tsx
git commit -m "feat: rebuild HeroSection for Bold Contrast, drop decorative motion"
```

---

## Task 8: ProjectsSection

**Files:**
- Modify: `client/src/components/ProjectsSection.tsx` (full rewrite of `ProjectCard` and the two grid containers)

**Interfaces:**
- Consumes: `Badge` from Task 2.
- Produces: no prop change; `data-testid`s `card-academic-project-{index}` / `card-research-project-{index}` (and their `-github`/`-link` suffixes) preserved.

- [ ] **Step 1: Replace `ProjectCard` with a numbered-row version**

Replace the entire `ProjectCard` function:

```tsx
function ProjectCard({ project, index, testId }: { project: Project; index: number; testId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group surface-card surface-card-interactive flex flex-col"
      data-testid={testId}
    >
      <div className="p-5 md:p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h4 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">
            {project.title}
          </h4>
          <div className="flex items-center gap-2 shrink-0">
            {project.status && (
              <Badge variant="outline" className="text-xs shrink-0">{project.status}</Badge>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">{project.date}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border"
            >
              {tag}
            </span>
          ))}
        </div>

        {(project.github || project.link) && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid={`${testId}-github`}
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid={`${testId}-link`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Link
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

with:

```tsx
function ProjectCard({ project, index, testId }: { project: Project; index: number; testId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3.5rem_1fr] gap-4 py-5 px-5 md:px-6 border-b-2 border-border last:border-b-0"
      data-testid={testId}
    >
      <span className="font-mono text-lg md:text-xl font-extrabold text-primary" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="font-extrabold text-base leading-snug group-hover:text-primary transition-colors">
            {project.title}
          </h4>
          <div className="flex items-center gap-2 shrink-0">
            {project.status && (
              <Badge variant="outline" className="text-xs shrink-0">{project.status}</Badge>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">{project.date}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium text-muted-foreground border-2 border-border"
            >
              {tag}
            </span>
          ))}
        </div>

        {(project.github || project.link) && (
          <div className="flex items-center gap-4 mt-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid={`${testId}-github`}
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid={`${testId}-link`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Link
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Wrap each category's list in a single bordered box instead of a grid**

Replace:

```tsx
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {academicProjects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  index={index}
                  testId={`card-academic-project-${index}`}
                />
              ))}
            </div>
```

with:

```tsx
            <div className="border-2 border-border rounded-md overflow-hidden">
              {academicProjects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  index={index}
                  testId={`card-academic-project-${index}`}
                />
              ))}
            </div>
```

And replace:

```tsx
            <div className="grid grid-cols-1 gap-5">
              {researchProjects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  index={index}
                  testId={`card-research-project-${index}`}
                />
              ))}
            </div>
```

with:

```tsx
            <div className="border-2 border-border rounded-md overflow-hidden">
              {researchProjects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  index={index}
                  testId={`card-research-project-${index}`}
                />
              ))}
            </div>
```

- [ ] **Step 3: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser, scroll to Projects and confirm each category renders as a single bordered box with bold numbered rows (01, 02, …) separated by 2px rules, not a 2-column card grid.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/ProjectsSection.tsx
git commit -m "feat: convert ProjectsSection to numbered-index layout"
```

---

## Task 9: CertificationsSection

**Files:**
- Modify: `client/src/components/CertificationsSection.tsx:24-59`

**Interfaces:**
- Consumes: `Button` from Task 2.
- Produces: no prop change; `data-testid="card-certification-{index}"` preserved.

- [ ] **Step 1: Replace the grid-of-cards with a single numbered-index box**

Replace:

```tsx
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certifications?.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="flex items-start justify-between gap-4 p-5 surface-card surface-card-interactive"
              data-testid={`card-certification-${index}`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                  <Award className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-0.5">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cert.date}</p>
                </div>
              </div>
              {cert.link && (
                <Button asChild variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View credential for ${cert.name}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
            </motion.div>
          ))}
        </div>
```

with:

```tsx
        <div className="border-2 border-border rounded-md overflow-hidden">
          {certifications?.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between gap-4 py-4 px-5 md:px-6 border-b-2 border-border last:border-b-0"
              data-testid={`card-certification-${index}`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-lg font-extrabold text-primary shrink-0" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm mb-0.5 truncate">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cert.date}</p>
                </div>
              </div>
              {cert.link && (
                <Button asChild variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View credential for ${cert.name}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
            </motion.div>
          ))}
        </div>
```

- [ ] **Step 2: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser, scroll to Certifications and confirm it renders as a single bordered box with bold numbered rows.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/CertificationsSection.tsx
git commit -m "feat: convert CertificationsSection to numbered-index layout"
```

---

## Task 10: ExperienceSection

**Files:**
- Modify: `client/src/components/ExperienceSection.tsx:53-76`

**Interfaces:**
- Consumes: `Card` from Task 2 (now 2px-bordered, no shadow by default).
- Produces: no prop/behavior change; accordion expand/collapse and all `data-testid`s preserved.

- [ ] **Step 1: Drop the extra shadow classes on `Card` and add a number to the company header**

Replace:

```tsx
              <Card
                className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                data-testid={`card-experience-company-${expIndex}`}
              >
                <CardContent className="p-0">
                  {/* Company header */}
                  <div className="p-6 md:p-8 border-b border-border">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold">{experience.company}</h3>
                        <p className="text-primary font-semibold mt-0.5">{experience.role}</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {experience.period}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {experience.location}
                        </div>
                      </div>
                    </div>
                  </div>
```

with:

```tsx
              <Card
                className="overflow-hidden"
                data-testid={`card-experience-company-${expIndex}`}
              >
                <CardContent className="p-0">
                  {/* Company header */}
                  <div className="p-6 md:p-8 border-b-2 border-border">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <span className="font-mono text-xl font-extrabold text-primary shrink-0" aria-hidden="true">
                          {String(expIndex + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="text-xl font-extrabold">{experience.company}</h3>
                          <p className="text-primary font-semibold mt-0.5">{experience.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {experience.period}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {experience.location}
                        </div>
                      </div>
                    </div>
                  </div>
```

- [ ] **Step 2: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser, scroll to Experience and confirm each company card shows a bold number before its name, has a visible 2px border with no shadow, and expand/collapse of individual projects still works.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/ExperienceSection.tsx
git commit -m "feat: number company entries and drop shadow in ExperienceSection"
```

---

## Task 11: SkillsSection

**Files:**
- Modify: `client/src/components/SkillsSection.tsx:36-52`

**Interfaces:**
- Consumes: `.surface-card`/`.surface-card-interactive` from Task 1.
- Produces: no prop change; `data-testid="card-skill-category-{index}"` preserved.

- [ ] **Step 1: Flatten the icon treatment and switch tags to bordered chips**

Replace:

```tsx
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-sm">{category.category}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted/70 text-foreground/75 border border-border/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
```

with:

```tsx
                <div className="flex items-center gap-2.5 mb-4">
                  <IconComponent className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  <h3 className="font-extrabold text-sm">{category.category}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium text-foreground/80 border-2 border-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
```

- [ ] **Step 2: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser, scroll to Skills and confirm each category panel has a 2px border, no shadow, a flat (non-boxed) icon, and skill tags now show a visible border instead of a soft filled pill.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/SkillsSection.tsx
git commit -m "feat: restyle SkillsSection tags as bordered chips"
```

---

## Task 12: KnowledgeVaultSection

**Files:**
- Modify: `client/src/components/KnowledgeVaultSection.tsx:1-12` (imports), `:75` (article surface), `:162-207` (entry list)

**Interfaces:**
- Consumes: `Badge`, `Button` from Task 2; `ContentRenderer` from Task 6.
- Produces: no prop change; search, tag-filter, and entry-select behavior unchanged; all `data-testid`s preserved.

- [ ] **Step 1: Remove the now-unused `Card`/`CardContent` import**

Replace:

```tsx
import { Card, CardContent } from "@/components/ui/card";
```

with nothing (delete the line). `Card`/`CardContent` are no longer used in this file after Step 3 below.

- [ ] **Step 2: Update the single-entry reader view's `surface-card` article — no change needed here**

`surface-card` already picks up the Task 1 redefinition automatically; no edit required at line 75 (`<article className="surface-card p-6 md:p-8">`). Skip to Step 3.

- [ ] **Step 3: Replace the entry-grid Card list with a rule-based list**

Replace:

```tsx
          <div className="space-y-6">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="relative group/card-wrapper">
                {user && (
                  <Button
                    asChild
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover/card-wrapper:opacity-100 transition-opacity shadow-sm"
                  >
                    <Link
                      href={`/admin?action=edit&type=knowledge&id=${entry.id}`}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      aria-label={`Edit ${entry.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                <Card
                  data-testid={`card-knowledge-entry-${entry.id}`}
                  className="surface-card-interactive cursor-pointer group h-full"
                  onClick={() => setSelectedEntryId(entry.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-3">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{formatDate(entry.date)}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2.5 group-hover:text-primary transition-colors">{entry.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {entry.content.find(b => b.type === "text")?.value || "Click to view content"}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(entry.tags || []).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-medium">
                          <Tag className="h-3 w-3 mr-1" aria-hidden="true" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
```

with:

```tsx
          <div className="border-2 border-border rounded-md overflow-hidden">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="relative group/card-wrapper border-b-2 border-border last:border-b-0">
                {user && (
                  <Button
                    asChild
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 z-10 opacity-0 group-hover/card-wrapper:opacity-100 transition-opacity"
                  >
                    <Link
                      href={`/admin?action=edit&type=knowledge&id=${entry.id}`}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      aria-label={`Edit ${entry.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                <div
                  data-testid={`card-knowledge-entry-${entry.id}`}
                  className="p-6 cursor-pointer group hover:bg-muted/40 transition-colors"
                  onClick={() => setSelectedEntryId(entry.id)}
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-3 font-mono">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{formatDate(entry.date)}</span>
                  </div>
                  <h3 className="text-lg font-extrabold mb-2.5 group-hover:text-primary transition-colors">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {entry.content.find(b => b.type === "text")?.value || "Click to view content"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(entry.tags || []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-medium">
                        <Tag className="h-3 w-3 mr-1" aria-hidden="true" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
```

- [ ] **Step 4: Verify**

Run: `npm run check`
Expected: passes with no new errors (confirms the removed `Card`/`CardContent` import doesn't leave a dangling reference).

In the browser, scroll to Knowledge Vault and confirm entries render as a single bordered list with 2px dividers (not individual card boxes with gaps), and clicking an entry still opens the reader view.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/KnowledgeVaultSection.tsx
git commit -m "feat: convert KnowledgeVaultSection entry list to rule-based layout"
```

---

## Task 13: BlogSection

**Files:**
- Modify: `client/src/components/BlogSection.tsx:9` (imports), `:182-246` (post grid)

**Interfaces:**
- Consumes: `Badge`, `Button` from Task 2.
- Produces: no prop change; search/tag-filter/load-more/select behavior unchanged; all `data-testid`s preserved.

- [ ] **Step 1: Remove the now-unused `Card` family import**

Replace:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
```

with nothing (delete the line) — `Card`/`CardHeader`/`CardTitle`/`CardContent` are no longer used anywhere in this file after Step 2.

- [ ] **Step 2: Replace the 3-column card grid with a single-column rule-based list**

Replace:

```tsx
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePosts.map((post) => (
                <div key={post.id} className="relative group/card-wrapper">
                  {user && (
                    <Button
                      asChild
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 z-10 opacity-0 group-hover/card-wrapper:opacity-100 transition-opacity shadow-sm"
                    >
                      <Link
                        href={`/admin?action=edit&type=blog&id=${post.id}`}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        aria-label={`Edit ${post.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Card
                    className="surface-card-interactive cursor-pointer group h-full flex flex-col"
                    onClick={() => setSelectedBlogId(post.id)}
                    data-testid={`card-blog-${post.id}`}
                  >
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.seriesName && (
                          <Badge variant="outline" className="text-xs gap-1 text-primary border-primary/30">
                            <BookOpen className="h-3 w-3" />
                            {post.seriesName}
                          </Badge>
                        )}
                        {(post.tags || []).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{ p: ({ children }) => <span>{children}</span> }}
                        >
                          {post.excerpt}
                        </ReactMarkdown>
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/60">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{formatDate(post.date)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {post.readTime}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
```

with:

```tsx
            <div className="border-2 border-border rounded-md overflow-hidden">
              {visiblePosts.map((post) => (
                <div key={post.id} className="relative group/card-wrapper border-b-2 border-border last:border-b-0">
                  {user && (
                    <Button
                      asChild
                      variant="secondary"
                      size="icon"
                      className="absolute top-3 right-3 z-10 opacity-0 group-hover/card-wrapper:opacity-100 transition-opacity"
                    >
                      <Link
                        href={`/admin?action=edit&type=blog&id=${post.id}`}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        aria-label={`Edit ${post.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <div
                    className="p-6 cursor-pointer group hover:bg-muted/40 transition-colors"
                    onClick={() => setSelectedBlogId(post.id)}
                    data-testid={`card-blog-${post.id}`}
                  >
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.seriesName && (
                        <Badge variant="outline" className="text-xs gap-1 text-primary border-primary/60">
                          <BookOpen className="h-3 w-3" />
                          {post.seriesName}
                        </Badge>
                      )}
                      {(post.tags || []).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-lg font-extrabold leading-snug group-hover:text-primary transition-colors mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{ p: ({ children }) => <span>{children}</span> }}
                      >
                        {post.excerpt}
                      </ReactMarkdown>
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                        <span>{formatDate(post.date)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {post.readTime}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
```

- [ ] **Step 3: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser, scroll to Blog and confirm posts render as a single-column bordered list with 2px dividers (not a 3-column card grid), and clicking a post still opens the full reader view.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/BlogSection.tsx
git commit -m "feat: convert BlogSection post grid to rule-based list"
```

---

## Task 14: SeriesSection

**Files:**
- Modify: `client/src/components/SeriesSection.tsx:8` (imports), `:163-254` (reader sidebar TOC), `:298` (bottom prev/next border), `:349-441` (series listing grid)

**Interfaces:**
- Consumes: `Badge`, `Button` from Task 2.
- Produces: no prop change; expand/collapse, reader navigation, and download-as-markdown behavior unchanged; no `data-testid`s exist on this file's interactive elements today, so none to preserve/break.

- [ ] **Step 1: Remove the now-unused `Card` family import**

Replace:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
```

with nothing (delete the line) — after Step 4 below, `Card`/`CardHeader`/`CardTitle`/`CardContent` are no longer referenced in this file.

- [ ] **Step 2: Thicken the reader-view sidebar TOC border and its internal dividers**

Replace:

```tsx
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                {/* Header */}
                <div className="px-5 py-4 border-b border-border">
```

with:

```tsx
              <div className="border-2 border-border rounded-md overflow-hidden bg-card">
                {/* Header */}
                <div className="px-5 py-4 border-b-2 border-border">
```

And replace:

```tsx
                {/* Prev / Next */}
                <div className="flex border-t border-border">
                  <button
                    disabled={!prevPost}
                    onClick={() => prevPost && setOpenPost(prevPost)}
                    className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-border"
                  >
```

with:

```tsx
                {/* Prev / Next */}
                <div className="flex border-t-2 border-border">
                  <button
                    disabled={!prevPost}
                    onClick={() => prevPost && setOpenPost(prevPost)}
                    className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r-2 border-border"
                  >
```

- [ ] **Step 3: Thicken the bottom prev/next divider in the article reader**

Replace:

```tsx
              <div className="flex items-center justify-between mt-16 pt-8 border-t border-border gap-4">
```

with:

```tsx
              <div className="flex items-center justify-between mt-16 pt-8 border-t-2 border-border gap-4">
```

- [ ] **Step 4: Replace the series-listing card grid with a single-column rule-based list**

Replace the full block from `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">` through its closing `</div>` (currently lines 349–442):

```tsx
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedSeriesEntries.slice(0, visibleCount).map(([seriesName, seriesPosts]) => {
              const tags = allTags(seriesPosts);
              const readTime = totalReadTime(seriesPosts);
              const isExpanded = expandedSeries.has(seriesName);

              return (
                <Card
                  key={seriesName}
                  className="border-l-4 border-l-primary/40 hover:border-l-primary transition-colors overflow-hidden"
                >
                  <CardHeader
                    className="pb-3 cursor-pointer select-none"
                    onClick={() => toggleSeries(seriesName)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl leading-snug">{seriesName}</CardTitle>
                      {isExpanded
                        ? <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        : <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      }
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent>
                    {isExpanded ? (
                      <div className="divide-y divide-border -mx-6 mb-4 max-h-72 overflow-y-auto">
                        {seriesPosts.map((post, idx) => (
                          <div
                            key={post.id}
                            className="flex items-start gap-3 px-6 py-3 hover:bg-muted/30 cursor-pointer transition-colors group"
                            onClick={() => setOpenPost(post)}
                          >
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                                {post.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm, remarkMath]}
                                  rehypePlugins={[rehypeKatex]}
                                  components={{ p: ({ children }) => <span>{children}</span> }}
                                >
                                  {post.excerpt}
                                </ReactMarkdown>
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                        {seriesPosts.map((post, idx) => (
                          <div key={post.id} className="flex items-center gap-2 text-sm">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-muted-foreground line-clamp-1">{post.title}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border">
                      <span>{seriesPosts.length} {seriesPosts.length === 1 ? "part" : "parts"}</span>
                      {readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {readTime}
                        </span>
                      )}
                      <button
                        className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={(e) => { e.stopPropagation(); downloadSeries(seriesName, seriesPosts); }}
                        title="Download full series as Markdown"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
```

with:

```tsx
          <div className="border-2 border-border rounded-md overflow-hidden">
            {sortedSeriesEntries.slice(0, visibleCount).map(([seriesName, seriesPosts]) => {
              const tags = allTags(seriesPosts);
              const readTime = totalReadTime(seriesPosts);
              const isExpanded = expandedSeries.has(seriesName);

              return (
                <div key={seriesName} className="border-b-2 border-border last:border-b-0">
                  <div
                    className="p-6 cursor-pointer select-none hover:bg-muted/40 transition-colors"
                    onClick={() => toggleSeries(seriesName)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-extrabold leading-snug">{seriesName}</h3>
                      {isExpanded
                        ? <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        : <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      }
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>

                    {isExpanded ? (
                      <div className="divide-y-2 divide-border -mx-6 max-h-72 overflow-y-auto">
                        {seriesPosts.map((post, idx) => (
                          <div
                            key={post.id}
                            className="flex items-start gap-3 px-6 py-3 hover:bg-muted/60 cursor-pointer transition-colors group"
                            onClick={(e) => { e.stopPropagation(); setOpenPost(post); }}
                          >
                            <span className="font-mono text-xs font-extrabold text-primary shrink-0 mt-0.5">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                                {post.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm, remarkMath]}
                                  rehypePlugins={[rehypeKatex]}
                                  components={{ p: ({ children }) => <span>{children}</span> }}
                                >
                                  {post.excerpt}
                                </ReactMarkdown>
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {seriesPosts.map((post, idx) => (
                          <div key={post.id} className="flex items-center gap-2 text-sm">
                            <span className="font-mono text-xs font-extrabold text-primary shrink-0">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="text-muted-foreground line-clamp-1">{post.title}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 mt-4 border-t-2 border-border font-mono">
                      <span>{seriesPosts.length} {seriesPosts.length === 1 ? "part" : "parts"}</span>
                      {readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {readTime}
                        </span>
                      )}
                      <button
                        className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={(e) => { e.stopPropagation(); downloadSeries(seriesName, seriesPosts); }}
                        title="Download full series as Markdown"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
```

- [ ] **Step 5: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser, scroll to Series and confirm the listing renders as a single-column bordered list (not a 2-column card grid), expand/collapse still works, clicking a chapter opens the reader view, and the reader's sidebar TOC shows a 2px border.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/SeriesSection.tsx
git commit -m "feat: convert SeriesSection listing to rule-based layout, thicken reader borders"
```

---

## Task 15: EducationSection

**Files:**
- Modify: `client/src/components/EducationSection.tsx:27-70`

**Interfaces:**
- Consumes: nothing new.
- Produces: no prop change; `data-testid="card-education-{index}"` preserved.

- [ ] **Step 1: Drop the card treatment and squarify the timeline marker**

Replace:

```tsx
          <div className="space-y-6">
            {education?.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex gap-5 sm:gap-8"
                data-testid={`card-education-${index}`}
              >
                {/* Timeline dot */}
                <div className="hidden sm:flex flex-col items-center shrink-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mt-1 z-10">
                    <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 surface-card surface-card-interactive p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold">{edu.institution}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                      <Calendar className="h-3.5 w-3.5" />
                      {edu.date}
                    </div>
                  </div>
                  <p className="text-primary font-medium mb-2">{edu.degree}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {edu.location}
                    </div>
                    {edu.score && (
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                        <Award className="h-3.5 w-3.5" />
                        {edu.score}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
```

with:

```tsx
          <div className="space-y-8">
            {education?.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex gap-5 sm:gap-8"
                data-testid={`card-education-${index}`}
              >
                {/* Timeline marker */}
                <div className="hidden sm:flex flex-col items-center shrink-0">
                  <div className="w-9 h-9 rounded-md border-2 border-primary bg-background flex items-center justify-center mt-1 z-10">
                    <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h3 className="text-lg font-extrabold">{edu.institution}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0 font-mono">
                      <Calendar className="h-3.5 w-3.5" />
                      {edu.date}
                    </div>
                  </div>
                  <p className="text-primary font-semibold mb-2">{edu.degree}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {edu.location}
                    </div>
                    {edu.score && (
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                        <Award className="h-3.5 w-3.5" />
                        {edu.score}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
```

- [ ] **Step 2: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser, scroll to Education and confirm each entry now reads as plain text (no card box), with a small squared timeline marker to the left.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/EducationSection.tsx
git commit -m "feat: strip card treatment from EducationSection"
```

---

## Task 16: ContactSection

**Files:**
- Modify: `client/src/components/ContactSection.tsx:100-144` (info column), `:154` (form wrapper)

**Interfaces:**
- Consumes: `Input`/`Textarea`/`Button`/`Form` from Task 2 and existing shadcn form primitives (unchanged).
- Produces: no prop change; form submission mutation and validation unchanged.

- [ ] **Step 1: Flatten the direct-contact links and social-link chips**

Replace:

```tsx
            <div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4">Direct Contact</h3>
              <div className="space-y-3">
                {contactLinks.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 p-3 rounded-lg border border-card-border bg-card shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/15 transition-colors">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4">Follow Me</h3>
              <div className="flex gap-3">
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-card-border bg-card shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
```

with:

```tsx
            <div>
              <h3 className="text-sm font-bold tracking-wide uppercase text-muted-foreground mb-4 font-mono">Direct Contact</h3>
              <div className="divide-y-2 divide-border">
                {contactLinks.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 py-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                  >
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold tracking-wide uppercase text-muted-foreground mb-4 font-mono">Follow Me</h3>
              <div className="flex gap-3">
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-md border-2 border-border hover:border-primary transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
```

- [ ] **Step 2: Drop the `surface-card` wrapper on the message form**

Replace:

```tsx
            <div className="surface-card p-6 md:p-8">
              <h3 className="font-semibold mb-1">Send a Message</h3>
```

with:

```tsx
            <div className="border-t-2 border-border pt-8 lg:border-t-0 lg:pt-0">
              <h3 className="font-extrabold mb-1">Send a Message</h3>
```

- [ ] **Step 3: Verify**

Run: `npm run check`
Expected: passes with no new errors.

In the browser, scroll to Contact and confirm the direct-contact links and social-link chips no longer show card shadows, and the message form no longer sits inside a bordered card box (on mobile it should show a top rule separating it from the info column above).

- [ ] **Step 4: Commit**

```bash
git add client/src/components/ContactSection.tsx
git commit -m "feat: strip card treatment from ContactSection"
```

---

## Task 17: Full-site verification pass

**Files:** none (verification only)

**Interfaces:** N/A — this task confirms the cumulative result of Tasks 1–16 against the approved spec's Testing & Verification section.

- [ ] **Step 1: Full TypeScript check**

Run: `npm run check`
Expected: exits 0 with no errors.

- [ ] **Step 2: Manual QA — light mode**

Run: `npm run dev`, open `http://localhost:5000` in a browser with light mode active. Scroll through the entire page top to bottom and confirm for each section: Navigation, Hero, Experience, Skills, Projects, Knowledge Vault, Series, Blog, Certifications, Education, Contact, Footer:
- No drop shadows anywhere.
- All borders read as a clearly visible 2px line.
- The only accent color present is the blue sampled from the logo (`#1068BD`/`hsl(210 84% 40%)`), used solely for numbers, active states, links-on-hover, and the hero highlight — no leftover soft blue tints (`bg-primary/5`, `bg-primary/10`, etc. should no longer appear rendered as soft washes anywhere touched by Tasks 7–16).
- No floating icons, gradient blobs, or fake terminal-window mockups in the hero.
- Numbered-index rows (Projects, Certifications) show bold accent-colored numbers.

- [ ] **Step 3: Manual QA — dark mode**

Toggle dark mode via the nav theme toggle. Repeat the same scroll-through. Confirm backgrounds/text invert correctly, borders remain clearly visible against the dark background, and the accent color is legible (brightened variant) against the dark background.

- [ ] **Step 4: Manual QA — interactions**

Confirm the following still work end-to-end:
- Navigation scroll-spy highlights the correct section while scrolling; mobile hamburger menu opens/closes and its links scroll to the right section.
- Experience: expanding/collapsing an individual project row.
- Knowledge Vault: searching, filtering by tag, opening/closing an entry.
- Blog: searching, filtering by tag, "Load More Posts", opening/closing a post.
- Series: expanding/collapsing a series card, opening a chapter, prev/next chapter navigation (both sidebar and mobile), "Download" producing a markdown file.
- Contact: submitting the form shows a success/error toast (can verify with an intentionally invalid submission to see validation messages, without needing to actually deliver an email).

- [ ] **Step 5: Final commit (only if any fixups were needed)**

If Steps 2–4 surfaced any visual bugs, fix them in the relevant component file(s), then:

```bash
git add -A
git commit -m "fix: address visual QA findings from Bold Contrast redesign pass"
```

If no fixups were needed, no commit is required for this task.
