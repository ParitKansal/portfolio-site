import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import resumePdf from "@assets/Parit_Kansal_1765124752768.pdf";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Knowledge Vault", href: "#knowledge-vault" },
  { label: "Blog", href: "#blog" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollToSection("#home")}
            className="font-bold text-xl tracking-tight hover:text-primary transition-colors"
            data-testid="link-logo"
          >
            PK<span className="text-primary">.</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.href)}
                className="text-muted-foreground hover:text-foreground"
                data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href={resumePdf} download="Parit_Kansal_Resume.pdf">
              <Button size="sm" className="hidden sm:flex gap-2" data-testid="button-download-resume">
                <Download className="h-4 w-4" />
                Resume
              </Button>
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1 bg-background/95 backdrop-blur-xl rounded-b-lg">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="justify-start"
                onClick={() => scrollToSection(item.href)}
                data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                {item.label}
              </Button>
            ))}
            <a href={resumePdf} download="Parit_Kansal_Resume.pdf" className="sm:hidden">
              <Button className="w-full gap-2 mt-2" data-testid="button-download-resume-mobile">
                <Download className="h-4 w-4" />
                Download Resume
              </Button>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
