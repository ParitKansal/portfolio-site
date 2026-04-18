import { ArrowUp, Mail } from "lucide-react";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-bold text-lg tracking-tight">Parit Kansal</span>
            <p className="text-sm text-muted-foreground">Machine Learning Scientist</p>
          </div>

          <div className="flex items-center gap-2">
            <a href="https://github.com/ParitKansal" target="_blank" rel="noopener noreferrer" data-testid="link-footer-github">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <SiGithub className="h-4 w-4" />
              </Button>
            </a>
            <a href="https://linkedin.com/in/paritkansal" target="_blank" rel="noopener noreferrer" data-testid="link-footer-linkedin">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <SiLinkedin className="h-4 w-4" />
              </Button>
            </a>
            <a href="mailto:paritkansal121@gmail.com" data-testid="link-footer-email">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Mail className="h-4 w-4" />
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Parit Kansal
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="gap-1.5 text-xs h-8"
              data-testid="button-back-to-top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              Back to top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
