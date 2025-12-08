import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Education } from "@shared/schema";

export function EducationSection() {
  const { data: education, isLoading } = useQuery<Education[]>({
    queryKey: ["/api/education"]
  });

  if (isLoading) return <div className="py-20 text-center"><span className="loading loading-spinner">Loading...</span></div>;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-semibold">Education</h2>
        </div>

        <div className="grid gap-6">
          {education?.map((edu, index) => (
            <Card key={index} data-testid={`card-education-${index}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{edu.institution}</h3>
                  <span className="text-sm text-muted-foreground">{edu.date}</span>
                </div>
                <p className="text-muted-foreground mb-1">{edu.degree}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{edu.location}</span>
                  <span className="font-medium text-primary">{edu.score}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
