import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Resume, SectionSetting } from "@shared/schema";

const allNavItems = [
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
  const [activeSection, setActiveSection] = useState("");
  const { user, logoutMutation } = useAuth();
  const { data: resume } = useQuery<Resume>({ queryKey: ["/api/resume"] });
  const { data: sectionSettings = [] } = useQuery<SectionSetting[]>({ queryKey: ["/api/section-settings"] });

  const navItems = allNavItems.filter(item =>
    sectionSettings.find(s => s.section === item.sectionKey)?.visible ?? true
  );

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // Scroll spy: the active section is the last one whose top has passed the bar
        let current = "";
        for (const item of allNavItems) {
          const element = document.querySelector<HTMLElement>(item.href);
          if (element && element.getBoundingClientRect().top <= 96) current = item.href;
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
    if (href === "#top") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <div className="bar">
      <div className="in">
        <button
          type="button"
          className="brand"
          onClick={() => scrollToSection("#top")}
          aria-label="Scroll to top"
          data-testid="link-logo"
        >
          <img src="/logo.png" alt="" width={30} height={30} />
          <span className="id">paritkansal<b>.in</b></span>
        </button>

        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.href}
              type="button"
              className="nl"
              onClick={() => scrollToSection(item.href)}
              aria-current={activeSection === item.href ? "true" : undefined}
              data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
            >
              {item.label}
            </button>
          ))}

          {user && (
            <>
              <Link href="/admin" className="ghost hide-sm">Dashboard</Link>
              <button
                type="button"
                className="ghost"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                Logout
              </button>
            </>
          )}

          {resume?.url && (
            <a className="pdf" href={resume.url} target="_blank" rel="noopener noreferrer" data-testid="button-download-resume">
              Résumé ↓
            </a>
          )}

          <button
            type="button"
            className="menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            data-testid="button-mobile-menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {isOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => scrollToSection(item.href)}
              aria-current={activeSection === item.href ? "true" : undefined}
              data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(" ", "-")}`}
            >
              {item.label}
            </button>
          ))}
          {user && <Link href="/admin">Dashboard</Link>}
        </div>
      )}
    </div>
  );
}
