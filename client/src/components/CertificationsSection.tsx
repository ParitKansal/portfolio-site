import { Award, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const certifications = [
  {
    name: "TensorFlow: Advanced Techniques",
    issuer: "Coursera & DeepLearning.AI",
    date: "June 2024",
  },
  {
    name: "Machine Learning with Python",
    issuer: "freeCodeCamp",
    date: "April 2024",
  },
];

export function CertificationsSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Award className="h-8 w-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-semibold">Certifications</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-certification-${index}`}>
              <CardContent className="p-6 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    <p className="text-sm text-muted-foreground">{cert.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0" data-testid={`button-cert-link-${index}`}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
