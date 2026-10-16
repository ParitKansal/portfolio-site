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
