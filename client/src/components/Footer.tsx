import { ArrowUp, Mail } from "lucide-react";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 px-4 sm:px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <a href="https://github.com/ParitKansal" target="_blank" rel="noopener noreferrer" data-testid="link-footer-github">
              <Button variant="ghost" size="icon">
                <SiGithub className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://linkedin.com/in/paritkansal" target="_blank" rel="noopener noreferrer" data-testid="link-footer-linkedin">
              <Button variant="ghost" size="icon">
                <SiLinkedin className="h-5 w-5" />
              </Button>
            </a>
            <a href="mailto:paritkansal121@gmail.com" data-testid="link-footer-email">
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            Parit Kansal. Last updated December 2025.
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="gap-2"
            data-testid="button-back-to-top"
          >
            Back to top
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
