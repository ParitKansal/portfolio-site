import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { EducationSection } from "@/components/EducationSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { KnowledgeVaultSection } from "@/components/KnowledgeVaultSection";
import { BlogSection } from "@/components/BlogSection";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/ContactSection";
import { SectionWrapper } from "@/components/SectionWrapper";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <SectionWrapper sectionKey="education" adminTab="education">
          <EducationSection />
        </SectionWrapper>
        <SectionWrapper sectionKey="experience" adminTab="experience">
          <ExperienceSection />
        </SectionWrapper>
        <SectionWrapper sectionKey="skills" adminTab="skills">
          <SkillsSection />
        </SectionWrapper>
        <SectionWrapper sectionKey="projects" adminTab="projects">
          <ProjectsSection />
        </SectionWrapper>
        <SectionWrapper sectionKey="certifications" adminTab="certifications">
          <CertificationsSection />
        </SectionWrapper>
        <SectionWrapper sectionKey="knowledge-vault" adminTab="knowledge">
          <KnowledgeVaultSection />
        </SectionWrapper>
        <SectionWrapper sectionKey="blog" adminTab="blog">
          <BlogSection />
        </SectionWrapper>
        <SectionWrapper sectionKey="contact">
          <ContactSection />
        </SectionWrapper>
      </main>
      <Footer />
    </div>
  );
}
