import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { useSectionNumber } from "./PaperSection";

interface SectionHeaderProps {
  icon?: LucideIcon;
  label?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  action?: ReactNode;
}

// Paper-style numbered heading, used by sections that keep their own <section> element
export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  const n = useSectionNumber();
  return (
    <div className="mb-6">
      <h2 className="ph2">
        {n != null && <span className="n">{n}</span>}
        {title}
      </h2>
      {action && <div className="mt-3 flex gap-2">{action}</div>}
      {subtitle && <p className="lead">{subtitle}</p>}
    </div>
  );
}
