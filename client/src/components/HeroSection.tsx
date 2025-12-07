import { Mail, Phone, ArrowDown } from "lucide-react";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToWork = () => {
    const element = document.querySelector("#experience");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Machine Learning Scientist
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Parit Kansal
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Building intelligent systems at scale. Specializing in Computer Vision, 
          NLP, and Deep Learning to solve real-world problems.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a href="mailto:paritkansal121@gmail.com" data-testid="link-email">
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              paritkansal121@gmail.com
            </Button>
          </a>
          <a href="tel:+916398950353" data-testid="link-phone">
            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              +91 639-895-0353
            </Button>
          </a>
        </div>

        <div className="flex items-center justify-center gap-3 mb-16">
          <a href="https://github.com/ParitKansal" target="_blank" rel="noopener noreferrer" data-testid="link-github">
            <Button variant="secondary" size="icon">
              <SiGithub className="h-5 w-5" />
            </Button>
          </a>
          <a href="https://linkedin.com/in/paritkansal" target="_blank" rel="noopener noreferrer" data-testid="link-linkedin">
            <Button variant="secondary" size="icon">
              <SiLinkedin className="h-5 w-5" />
            </Button>
          </a>
        </div>

        <Button
          variant="ghost"
          size="lg"
          onClick={scrollToWork}
          className="animate-bounce"
          data-testid="button-scroll-to-work"
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
