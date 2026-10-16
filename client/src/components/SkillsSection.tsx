import { useQuery } from "@tanstack/react-query";
import type { Skill } from "@shared/schema";
import { PaperSection } from "./PaperSection";

export function SkillsSection() {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"]
  });

  if (isLoading) return null;

  return (
    <PaperSection id="skills" title="Skills">
      <dl className="skill-list">
        {skills?.map((category, index) => (
          <div key={category.id ?? index} style={{ display: "contents" }} data-testid={`card-skill-category-${index}`}>
            <dt>{category.category}</dt>
            <dd>{category.skills.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </PaperSection>
  );
}
