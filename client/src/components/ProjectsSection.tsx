import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { PaperSection, useSectionNumber } from "./PaperSection";

function ProjectItem({ project, testId }: { project: Project; testId: string }) {
  const inProgress = !!project.status && /progress|ongoing|writing/i.test(project.status);
  return (
    <div className="pitem" data-testid={testId}>
      <div className="d">{project.date || (inProgress ? "Ongoing" : "")}</div>
      <div>
        <h4>
          {project.title}
          {project.status && <span className={`badge${inProgress ? " prog" : ""}`}>{project.status}</span>}
        </h4>
        <p>{project.description}</p>
        {project.tags.length > 0 && (
          <div className="tags">
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        )}
        {(project.github || project.link) && (
          <div className="plinks">
            {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" data-testid={`${testId}-github`}>GitHub ↗</a>}
            {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" data-testid={`${testId}-link`}>Link ↗</a>}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const n = useSectionNumber();
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  if (isLoading) return null;

  const groups = [
    { name: "Research", items: projects?.filter(p => p.category === "Research") || [], key: "research" },
    { name: "Academic", items: projects?.filter(p => p.category === "Academic") || [], key: "academic" },
  ].filter(g => g.items.length > 0);

  return (
    <PaperSection id="projects" title="Projects">
      {groups.map((group, gi) => (
        <div key={group.key}>
          <h3 className="ph3">
            <span className="n">{n != null ? `${n}.${gi + 1}` : gi + 1}</span>
            {group.name}
          </h3>
          <div className="plist">
            {group.items.map((project, index) => (
              <ProjectItem key={project.id ?? index} project={project} testId={`card-${group.key}-project-${index}`} />
            ))}
          </div>
        </div>
      ))}
    </PaperSection>
  );
}
