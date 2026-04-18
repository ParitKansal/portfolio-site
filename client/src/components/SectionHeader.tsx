import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  icon: LucideIcon;
  label: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({ icon: Icon, label, title, subtitle, centered = false }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      <div className={`flex items-center gap-1.5 mb-3 ${centered ? "justify-center" : ""}`}>
        <Icon className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-semibold tracking-widest uppercase text-primary">{label}</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
