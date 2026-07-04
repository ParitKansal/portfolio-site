import * as Icons from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import type { Skill } from "@shared/schema";

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

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                data-testid={`card-skill-category-${index}`}
                className="surface-card surface-card-interactive p-5"
              >
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
