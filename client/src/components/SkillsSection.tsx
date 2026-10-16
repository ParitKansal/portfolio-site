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
      <div className="tbl">
        <table>
          <tbody>
            {skills?.map((category, index) => (
              <tr key={index} data-testid={`card-skill-category-${index}`}>
                <th style={{ width: 190 }}>{category.category}</th>
                <td>
                  <div className="chiprow">
                    {category.skills.map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tcap"><b>Table 2.</b> Technical skills by category.</div>
      </div>
    </PaperSection>
  );
}
