import { useState } from "react";
import { Briefcase, ChevronDown, MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import type { Experience } from "@shared/schema";

export function ExperienceSection() {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(["0-0"]));

  const { data: experiences, isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experience"]
  });

  const toggleProject = (expIndex: number, projIndex: number) => {
    const key = `${expIndex}-${projIndex}`;
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (isLoading) return null;

  return (
    <section id="experience" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          icon={Briefcase}
          label="Experience"
          title="Professional Experience"
        />

        <div className="space-y-8">
          {experiences?.map((experience, expIndex) => (
            <motion.div
              key={expIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: expIndex * 0.1 }}
            >
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

                  {/* Projects */}
                  <div className="divide-y divide-border">
                    {experience.projects.map((project, projIndex) => {
                      const isExpanded = expandedProjects.has(`${expIndex}-${projIndex}`);
                      return (
                        <div
                          key={projIndex}
                          className={`transition-colors duration-150 ${isExpanded ? "bg-primary/[0.02]" : ""}`}
                          data-testid={`card-project-${expIndex}-${projIndex}`}
                        >
                          <button
                            className={`w-full flex items-center justify-between px-6 md:px-8 py-4 text-left group transition-colors hover:bg-muted/40 ${isExpanded ? "border-l-2 border-primary" : "border-l-2 border-transparent"}`}
                            onClick={() => toggleProject(expIndex, projIndex)}
                            data-testid={`button-toggle-project-${expIndex}-${projIndex}`}
                          >
                            <span className={`font-medium text-sm ${isExpanded ? "text-primary" : "text-foreground"}`}>
                              {project.title}
                            </span>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="shrink-0 ml-4"
                            >
                              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </motion.div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 md:px-8 pb-5 pt-1 border-l-2 border-primary">
                                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                    {project.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
