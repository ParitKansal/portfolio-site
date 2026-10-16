import { useQuery } from "@tanstack/react-query";
import type { Education } from "@shared/schema";
import { PaperSection } from "./PaperSection";

export function EducationSection() {
  const { data: education, isLoading } = useQuery<Education[]>({
    queryKey: ["/api/education"]
  });

  if (isLoading) return null;

  // Most recent first; school rows are shown smaller
  const rows = [...(education ?? [])].reverse();
  const isMinor = (e: Education) => /class|secondary|school/i.test(`${e.degree} ${e.institution}`);

  return (
    <PaperSection id="education" title="Education">
      <div className="edu">
        {rows.map((edu, index) => (
          <div key={edu.id ?? index} className={`erow${isMinor(edu) ? " minor" : ""}`} data-testid={`card-education-${index}`}>
            <div className="d">{edu.date}</div>
            <div>
              <h4>{edu.degree}</h4>
              <div className="i">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</div>
            </div>
            <div className="s">{edu.score}</div>
          </div>
        ))}
      </div>
    </PaperSection>
  );
}
