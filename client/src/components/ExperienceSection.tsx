import { useState } from "react";
import { Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const experience = {
  company: "Xelpmoc Design and Tech Ltd.",
  role: "Machine Learning Scientist",
  period: "January 2025 – Present",
  location: "Hyderabad, India",
  projects: [
    {
      title: "Live Store Analysis",
      description: "Contributed in building a CCTV-based real-time store monitoring system for a major global fast-food chain, analyzing live RTSP feeds to detect customer entry/exit, staff presence at counters, and triggering alerts when customers wait too long unattended. Implemented automatic detection of unclean tables after customer departure and dustbin cleanliness, generating manager alerts. Deployed using a microservice-based backend for continuous live processing.",
      tags: ["Computer Vision", "RTSP", "Microservices", "Real-time Processing"],
    },
    {
      title: "Intelligent Document Understanding",
      description: "Fine-tuned DONUT for conditional key-value extraction from insurance claims, achieving 98% field-level accuracy. Developed a Gemma-3-4B (4-bit VLM) automated judge to validate predictions against the original document image, reaching 96.67% document-level accuracy. The production pipeline processes 100,000+ documents monthly.",
      tags: ["DONUT", "VLM", "Document AI", "Fine-tuning"],
    },
    {
      title: "Integrated Lead Scoring Model",
      description: "Built an event-level scoring pipeline to predict post-site visit likelihood by integrating WhatsApp, web, and audio interactions. Engineered cumulative behavioral features for each event and trained a ModernBERT model on interaction transitions, using its outputs as features in a final XGBoost model, achieving 83% recall in the top 13% events.",
      tags: ["ModernBERT", "XGBoost", "Feature Engineering", "NLP"],
    },
    {
      title: "Web Visit Scoring",
      description: "Designed an end-to-end scoring pipeline to address a 2+ month feedback delay. Analyzed 8M+ sessions using XGBoost, achieving 88% session-level recall and 90% visitor-level recall.",
      tags: ["XGBoost", "Data Analysis", "ML Pipeline"],
    },
    {
      title: "Multi-Document Detection",
      description: "Developed a synthetic document generation pipeline to train a Mask R-CNN model for multi-document detection, achieving 97.1% AP@[IoU=0.50:0.95].",
      tags: ["Mask R-CNN", "Object Detection", "Synthetic Data"],
    },
  ],
};

export function ExperienceSection() {
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set([0]));

  const toggleProject = (index: number) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section id="experience" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Briefcase className="h-8 w-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-semibold">Professional Experience</h2>
        </div>

        <Card data-testid="card-experience-company">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
              <h3 className="text-2xl font-semibold">{experience.company}</h3>
              <span className="text-sm text-muted-foreground">{experience.period}</span>
            </div>
            <p className="text-lg text-primary font-medium mb-1">{experience.role}</p>
            <p className="text-sm text-muted-foreground mb-8">{experience.location}</p>

            <div className="space-y-4">
              {experience.projects.map((project, index) => (
                <div
                  key={index}
                  className="border border-border rounded-md overflow-hidden"
                  data-testid={`card-project-${index}`}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto rounded-none"
                    onClick={() => toggleProject(index)}
                    data-testid={`button-toggle-project-${index}`}
                  >
                    <span className="font-medium text-left">{project.title}</span>
                    {expandedProjects.has(index) ? (
                      <ChevronUp className="h-5 w-5 shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0" />
                    )}
                  </Button>
                  
                  {expandedProjects.has(index) && (
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
      </div>
    </section>
  );
}
