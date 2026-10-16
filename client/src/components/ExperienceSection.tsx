import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Experience } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PaperSection, useSectionNumber, sortByPeriod } from "./PaperSection";

// Figure 1 is drawn under the FigureIQ (formerly Docuxary) project when it is present
function PipelineFigure() {
  return (
    <figure className="fig">
      <div className="flow">
        <div className="stage"><b>Ingest</b><small>Invoices, receipts, statements</small></div><span className="join" />
        <div className="stage k"><b>Extract</b><small>VLM, schema-driven prompts</small></div><span className="join" />
        <div className="stage k"><b>AI Judge</b><small>Checks against the image</small></div><span className="join" />
        <div className="stage"><b>Vault</b><small>Files, attachments</small></div><span className="join" />
        <div className="stage last"><b>QuickBooks</b><small>Entity resolution, sync</small></div>
      </div>
      <figcaption>
        <b>Figure 1.</b> FigureIQ pipeline. Highlighted stages are model-driven; AI-Judge corrections feed back into extraction automatically.
      </figcaption>
    </figure>
  );
}

export function ExperienceSection() {
  const n = useSectionNumber();
  const { data: experiences, isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experience"]
  });

  if (isLoading) return null;

  let counter = 0;

  return (
    <PaperSection id="experience" title="Experience">
      {sortByPeriod(experiences).map((experience, expIndex) => (
        <Fragment key={expIndex}>
          <div className="org" data-testid={`card-experience-company-${expIndex}`}>
            <div>
              <h3>{experience.company}</h3>
              <div className="r">{experience.role}</div>
            </div>
            <div className="w">
              {experience.period}
              <br />
              {experience.location}
            </div>
          </div>

          {experience.projects.map((project, projIndex) => {
            counter += 1;
            return (
              <Fragment key={projIndex}>
                <div className="proj" data-testid={`card-project-${expIndex}-${projIndex}`}>
                  <h4>
                    <span className="n">{n != null ? `${n}.${counter}` : counter}</span>
                    {project.title}
                  </h4>
                  <div className="md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
                  </div>
                  {project.tags.length > 0 && (
                    <div className="tags">
                      {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  )}
                  {(project.github || project.link) && (
                    <div className="plinks">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" data-testid={`link-project-github-${expIndex}-${projIndex}`}>GitHub ↗</a>
                      )}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" data-testid={`link-project-link-${expIndex}-${projIndex}`}>Link ↗</a>
                      )}
                    </div>
                  )}
                </div>
                {/figureiq|docuxary/i.test(project.title) && <PipelineFigure />}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </PaperSection>
  );
}
