import { useQuery } from "@tanstack/react-query";
import type { Experience } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PaperSection, sortByPeriod } from "./PaperSection";

export function ExperienceSection() {
  const { data: experiences, isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experience"]
  });

  if (isLoading) return null;

  return (
    <PaperSection id="experience" title="Experience">
      {sortByPeriod(experiences).map((experience, expIndex) => (
        <div className="job" key={experience.id ?? expIndex} data-testid={`card-experience-company-${expIndex}`}>
          <div className="job-head">
            <h3>{experience.company}</h3>
            <span className="when">{experience.period} · {experience.location}</span>
          </div>
          <div className="job-role">{experience.role}</div>

          {experience.projects.map((project, projIndex) => (
            <div className="proj" key={projIndex} data-testid={`card-project-${expIndex}-${projIndex}`}>
              <h4>{project.title}</h4>
              <div className="md">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
              </div>
              {(project.tags.length > 0 || project.github || project.link) && (
                <div className="meta-line">
                  {project.tags.length > 0 && <span>{project.tags.join(" · ")}</span>}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" data-testid={`link-project-link-${expIndex}-${projIndex}`}>Website ↗</a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" data-testid={`link-project-github-${expIndex}-${projIndex}`}>GitHub ↗</a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </PaperSection>
  );
}
