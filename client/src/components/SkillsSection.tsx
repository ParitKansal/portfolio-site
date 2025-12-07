import { Code2, Brain, Wrench, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const skillCategories = [
  {
    title: "Programming Languages",
    icon: Code2,
    skills: ["Python", "C++", "C"],
  },
  {
    title: "Areas of Expertise",
    icon: Brain,
    skills: [
      "Data Science",
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "Natural Language Processing",
      "Graph Neural Networks",
      "Few-shot VLM Training",
    ],
  },
  {
    title: "Tools & Technologies",
    icon: Wrench,
    skills: [
      "LangChain",
      "MySQL",
      "Power BI",
      "Microsoft Azure",
      "Large Language Models",
      "Web Scraping",
      "CI/CD",
      "Retrieval-Augmented Generation",
      "Workflow & Agent",
      "LangGraph",
    ],
  },
  {
    title: "Frameworks",
    icon: Layers,
    skills: ["TensorFlow", "PyTorch", "FastAPI"],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Code2 className="h-8 w-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-semibold">Technical Skills</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <Card key={category.title} data-testid={`card-skill-category-${index}`}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <category.icon className="h-5 w-5 text-primary" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
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
