import { useQuery } from "@tanstack/react-query";
import type { SectionSetting } from "@shared/schema";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { EducationSection } from "@/components/EducationSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { KnowledgeVaultSection } from "@/components/KnowledgeVaultSection";
import { BlogSection } from "@/components/BlogSection";
import { SeriesSection } from "@/components/SeriesSection";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/ContactSection";
import { SectionWrapper } from "@/components/SectionWrapper";
import { SectionNumber } from "@/components/PaperSection";
import { PaperToc } from "@/components/PaperToc";
import "@/paper.css";

// Section order on the page. Numbers are given only to sections visitors can see,
// so hiding one renumbers the rest. Series is always shown, Certifications sits
// under Education. (Numbers are hidden in the simple reading layout.)
const ORDER = ["experience", "skills", "projects", "knowledge-vault", "series", "blog", "education", "contact"] as const;

export default function Home() {
  const { data: settings = [] } = useQuery<SectionSetting[]>({ queryKey: ["/api/section-settings"] });
  const visible = (key: string) => settings.find((s) => s.section === key)?.visible ?? true;
  const isVisible = (key: (typeof ORDER)[number]) =>
    key === "series" ? true : visible(key);

  const num: Record<string, number | null> = {};
  let i = 0;
  for (const key of ORDER) num[key] = isVisible(key) ? ++i : null;

  return (
    <div className="pp" id="top">
      <Navigation />
      <div className="layout">
        <PaperToc />
        <main className="paper">
          <HeroSection />
          <SectionNumber.Provider value={num["experience"] ?? null}>
            <SectionWrapper sectionKey="experience" adminTab="experience">
              <ExperienceSection />
            </SectionWrapper>
          </SectionNumber.Provider>
          <SectionNumber.Provider value={num["skills"] ?? null}>
            <SectionWrapper sectionKey="skills" adminTab="skills">
              <SkillsSection />
            </SectionWrapper>
          </SectionNumber.Provider>
          <SectionNumber.Provider value={num["projects"] ?? null}>
            <SectionWrapper sectionKey="projects" adminTab="projects">
              <ProjectsSection />
            </SectionWrapper>
          </SectionNumber.Provider>
          <SectionNumber.Provider value={num["knowledge-vault"] ?? null}>
            <SectionWrapper sectionKey="knowledge-vault" adminTab="knowledge">
              <KnowledgeVaultSection />
            </SectionWrapper>
          </SectionNumber.Provider>
          <SectionNumber.Provider value={num["series"] ?? null}>
            <SeriesSection />
          </SectionNumber.Provider>
          <SectionNumber.Provider value={num["blog"] ?? null}>
            <SectionWrapper sectionKey="blog" adminTab="blog">
              <BlogSection />
            </SectionWrapper>
          </SectionNumber.Provider>
          <SectionNumber.Provider value={num["education"] ?? null}>
            <SectionWrapper sectionKey="education" adminTab="education">
              <EducationSection />
            </SectionWrapper>
            <SectionWrapper sectionKey="certifications" adminTab="certifications">
              <CertificationsSection />
            </SectionWrapper>
          </SectionNumber.Provider>
          <SectionNumber.Provider value={num["contact"] ?? null}>
            <SectionWrapper sectionKey="contact">
              <ContactSection />
            </SectionWrapper>
          </SectionNumber.Provider>
          <Footer />
        </main>
      </div>
    </div>
  );
}
