import { FolderGit2, FlaskConical, Microscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

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
        <div className="flex items-center gap-3 mb-12">
          <FolderGit2 className="h-8 w-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-semibold">Projects</h2>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <FlaskConical className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Academic Projects</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academicProjects.map((project, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-academic-project-${index}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <span className="text-sm text-muted-foreground shrink-0">{project.date}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <Microscope className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Research Projects</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {researchProjects.map((project, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-research-project-${index}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant="outline" className="shrink-0">{project.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
