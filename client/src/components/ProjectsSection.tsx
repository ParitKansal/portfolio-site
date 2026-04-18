import { FolderGit2, FlaskConical, Microscope, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import type { Project } from "@shared/schema";

function ProjectCard({ project, index, testId }: { project: Project; index: number; testId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="group rounded-xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col"
      data-testid={testId}
    >
      <div className="p-5 md:p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h4 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">
            {project.title}
          </h4>
          <div className="flex items-center gap-2 shrink-0">
            {project.status && (
              <Badge variant="outline" className="text-xs shrink-0">{project.status}</Badge>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">{project.date}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  const academicProjects = projects?.filter(p => p.category === "Academic") || [];
  const researchProjects = projects?.filter(p => p.category === "Research") || [];

  if (isLoading) return null;

  return (
    <section id="projects" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          icon={FolderGit2}
          label="Projects"
          title="Projects"
        />

        {academicProjects.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-muted-foreground tracking-wide uppercase text-sm">
                Academic
              </h3>
              <div className="flex-1 h-px bg-border ml-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {academicProjects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  index={index}
                  testId={`card-academic-project-${index}`}
                />
              ))}
            </div>
          </div>
        )}

        {researchProjects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Microscope className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                Research
              </h3>
              <div className="flex-1 h-px bg-border ml-2" />
            </div>
            <div className="grid grid-cols-1 gap-5">
              {researchProjects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  index={index}
                  testId={`card-research-project-${index}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
