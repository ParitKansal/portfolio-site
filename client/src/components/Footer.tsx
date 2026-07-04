import { ArrowUp, Mail } from "lucide-react";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";

const socialLinks = [
  { href: "https://github.com/ParitKansal", label: "GitHub", Icon: SiGithub, testId: "link-footer-github", external: true },
  { href: "https://linkedin.com/in/paritkansal", label: "LinkedIn", Icon: SiLinkedin, testId: "link-footer-linkedin", external: true },
  { href: "mailto:paritkansal121@gmail.com", label: "Email", Icon: Mail, testId: "link-footer-email", external: false },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-bold text-lg tracking-tight">Parit Kansal</span>
            <p className="text-sm text-muted-foreground">Machine Learning Scientist</p>
          </div>

          <div className="flex items-center gap-1">
            {socialLinks.map(({ href, label, Icon, testId, external }) => (
              <Button key={label} asChild variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={label}
                  data-testid={testId}
                >
                  <Icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
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
