import { GraduationCap, MapPin, Calendar, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import type { Education } from "@shared/schema";

export function EducationSection() {
  const { data: education, isLoading } = useQuery<Education[]>({
    queryKey: ["/api/education"]
  });

  if (isLoading) return null;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          icon={GraduationCap}
          label="Education"
          title="Education"
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[18px] md:left-[22px] top-2 bottom-2 w-px bg-border hidden sm:block" />

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
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6">
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
        </div>
      </div>
    </section>
  );
}
