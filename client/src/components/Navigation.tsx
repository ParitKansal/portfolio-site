import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Resume, SectionSetting } from "@shared/schema";

const allNavItems = [
  { label: "Home", href: "#home", sectionKey: null },
  { label: "Experience", href: "#experience", sectionKey: "experience" },
  { label: "Skills", href: "#skills", sectionKey: "skills" },
  { label: "Projects", href: "#projects", sectionKey: "projects" },
  { label: "Knowledge Vault", href: "#knowledge-vault", sectionKey: "knowledge-vault" },
  { label: "Series", href: "#series", sectionKey: "blog" },
  { label: "Blog", href: "#blog", sectionKey: "blog" },
  { label: "Contact", href: "#contact", sectionKey: "contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const { user, logoutMutation } = useAuth();
  const { data: resume } = useQuery<Resume>({ queryKey: ["/api/resume"] });
  const { data: sectionSettings = [] } = useQuery<SectionSetting[]>({ queryKey: ["/api/section-settings"] });

  const navItems = allNavItems.filter(item =>
    item.sectionKey === null || (sectionSettings.find(s => s.section === item.sectionKey)?.visible ?? true)
  );

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);

        // Scroll spy: the active section is the last one whose top has passed the header
        let current = "#home";
        for (const item of allNavItems) {
          const element = document.querySelector<HTMLElement>(item.href);
          if (element && element.getBoundingClientRect().top <= 96) {
            current = item.href;
          }
        }
        setActiveSection(current);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
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
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen
        ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm"
        : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollToSection("#home")}
            className="shrink-0 rounded-md hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Scroll to top"
            data-testid="link-logo"
          >
            <img src="/logo.png" alt="Parit Kansal" className="h-10 w-auto" />
          </button>

          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />

            {user && (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link href="/admin">Dashboard</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  Logout
                </Button>
              </>
            )}

            {resume?.url && (
              <Button asChild size="sm" className="hidden sm:inline-flex gap-2" data-testid="button-download-resume">
                <a href={resume.url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-3 flex flex-col gap-0.5 border-t border-border">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href;
                  return (
                    <button
                      key={item.href}
                      onClick={() => scrollToSection(item.href)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                      data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
                {user && (
                  <Button asChild variant="ghost" className="justify-start sm:hidden">
                    <Link href="/admin">Dashboard</Link>
                  </Button>
                )}
                {resume?.url && (
                  <Button asChild className="w-full gap-2 mt-2 sm:hidden" data-testid="button-download-resume-mobile">
                    <a href={resume.url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                      Download Resume
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
