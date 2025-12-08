import { useState } from "react";
import { Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
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
        <div className="flex items-center gap-3 mb-12">
          <Briefcase className="h-8 w-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-semibold">Professional Experience</h2>
        </div>

        <div className="space-y-8">
          {experiences?.map((experience, expIndex) => (
            <Card key={expIndex} data-testid={`card-experience-company-${expIndex}`}>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <h3 className="text-2xl font-semibold">{experience.company}</h3>
                  <span className="text-sm text-muted-foreground">{experience.period}</span>
                </div>
                <p className="text-lg text-primary font-medium mb-1">{experience.role}</p>
                <p className="text-sm text-muted-foreground mb-8">{experience.location}</p>

                <div className="space-y-4">
                  {experience.projects.map((project, projIndex) => (
                    <div
                      key={projIndex}
                      className="border border-border rounded-md overflow-hidden"
                      data-testid={`card-project-${expIndex}-${projIndex}`}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto rounded-none"
                        onClick={() => toggleProject(expIndex, projIndex)}
                        data-testid={`button-toggle-project-${expIndex}-${projIndex}`}
                      >
                        <span className="font-medium text-left">{project.title}</span>
                        {expandedProjects.has(`${expIndex}-${projIndex}`) ? (
                          <ChevronUp className="h-5 w-5 shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 shrink-0" />
                        )}
                      </Button>

                      {expandedProjects.has(`${expIndex}-${projIndex}`) && (
                        <div className="p-4 pt-0 border-t border-border">
                          <p className="text-muted-foreground mb-4 leading-relaxed">
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
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
