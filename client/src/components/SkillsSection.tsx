import * as Icons from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import type { Skill } from "@shared/schema";

const cardVariants = [
  {
    border: "border-border",
    bg: "bg-card",
    icon: "text-blue-400 dark:text-blue-300",
    badge: "bg-blue-500/8 text-blue-600 border-blue-500/15 dark:text-blue-300 dark:border-blue-400/20",
  },
  {
    border: "border-border",
    bg: "bg-card",
    icon: "text-blue-500 dark:text-blue-400",
    badge: "bg-blue-500/8 text-blue-700 border-blue-500/15 dark:text-blue-400 dark:border-blue-400/20",
  },
  {
    border: "border-border",
    bg: "bg-card",
    icon: "text-blue-600 dark:text-blue-500",
    badge: "bg-blue-600/8 text-blue-800 border-blue-600/15 dark:text-blue-400 dark:border-blue-500/20",
  },
  {
    border: "border-border",
    bg: "bg-card",
    icon: "text-blue-700 dark:text-blue-500",
    badge: "bg-blue-700/8 text-blue-900 border-blue-700/15 dark:text-blue-400 dark:border-blue-600/20",
  },
];

export function SkillsSection() {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"]
  });

  if (isLoading) return null;

  return (
    <section id="skills" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          icon={Icons.Code2}
          label="Skills"
          title="Technical Skills"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills?.map((category, index) => {
            const IconComponent = (Icons as any)[category.icon] || Icons.Circle;
            const variant = cardVariants[index % cardVariants.length];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                data-testid={`card-skill-category-${index}`}
                className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ${variant.border} ${variant.bg}`}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`p-1.5 rounded-lg bg-current/10`}>
                    <IconComponent className={`h-4 w-4 ${variant.icon}`} />
                  </div>
                  <h3 className="font-semibold text-sm">{category.category}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${variant.badge}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
