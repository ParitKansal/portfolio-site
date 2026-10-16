import { createContext, useContext, type ReactNode } from "react";

// Section numbers ("1 Experience", "2 Results" …) are worked out in pages/home.tsx
// from which sections are visible, and handed down through this context.
export const SectionNumber = createContext<number | null>(null);

export function useSectionNumber() {
  return useContext(SectionNumber);
}

interface PaperSectionProps {
  id: string;
  title: string;
  /** Label in the left "Contents" list; defaults to the title */
  tocLabel?: string;
  lead?: ReactNode;
  /** Admin-only controls shown at the end of the heading row */
  action?: ReactNode;
  children: ReactNode;
}

export function PaperSection({ id, title, tocLabel, lead, action, children }: PaperSectionProps) {
  const n = useSectionNumber();
  return (
    <section id={id} className="psec" data-toc={tocLabel ?? title} data-num={n ?? ""}>
      <h2 className="ph2">
        {n != null && <span className="n">{n}</span>}
        {title}
      </h2>
      {action && <div className="mt-3 flex gap-2">{action}</div>}
      {lead && <p className="lead">{lead}</p>}
      {children}
    </section>
  );
}

export function formatMonthYear(dateStr: string | Date) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function formatLongDate(dateStr: string | Date) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/** Newest job first, using the start of "period" (e.g. "January 2025 – Present") */
export function sortByPeriod<T extends { period: string }>(items: T[] | undefined): T[] {
  const start = (p: string) => parseLooseDate(p.split(/[–—-]/)[0]);
  return [...(items ?? [])].sort((a, b) => start(b.period) - start(a.period));
}

/**
 * Sort key for free-text dates like "May 2024", "2021 – 2025", "June 2024".
 * Uses the last date in a range; empty or "Ongoing"/"Present" counts as newest.
 */
export function dateKey(text: string | null | undefined): number {
  if (!text || /present|ongoing|current|now/i.test(text)) return Number.MAX_SAFE_INTEGER;
  return parseLooseDate(text.split(/[–—-]/).pop()!);
}

/** Latest first, by the given date field */
export function newestFirst<T>(items: T[] | undefined, get: (item: T) => string | null | undefined): T[] {
  return [...(items ?? [])].sort((a, b) => dateKey(get(b)) - dateKey(get(a)));
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/**
 * Parses "January 2025", "Jun 2024", "May 2018" or "2021" the same way in every browser
 * (Firefox's Date() rejects "January 2025"). A year on its own sorts as December.
 */
export function parseLooseDate(text: string): number {
  const t = text.trim().toLowerCase();
  const year = t.match(/\d{4}/);
  if (!year) return 0;
  const m = MONTHS.findIndex((name) => t.includes(name));
  return Date.UTC(Number(year[0]), m >= 0 ? m : 11, 1);
}
