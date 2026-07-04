import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface SectionHeaderProps {
  icon: LucideIcon;
  label: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  action?: ReactNode;
}

export function SectionHeader({ icon: Icon, label, title, subtitle, centered = false, action }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={`mb-10 md:mb-14 ${centered ? "text-center" : ""}`}
    >
      <div className={`flex items-start justify-between gap-4 ${centered ? "justify-center" : ""}`}>
        <div className={centered ? "mx-auto" : ""}>
          <span className={`section-eyebrow mb-4 ${centered ? "justify-center" : ""}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
          {subtitle && (
            <p className={`mt-3 text-muted-foreground leading-relaxed max-w-2xl ${centered ? "mx-auto" : ""}`}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 pt-1">{action}</div>}
      </div>
    </motion.div>
  );
}
