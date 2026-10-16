import { useQuery } from "@tanstack/react-query";
import type { Resume, BlogPost, Experience } from "@shared/schema";
import { sortByPeriod } from "./PaperSection";

export function HeroSection() {
  const { data: resume } = useQuery<Resume>({ queryKey: ["/api/resume"] });
  const { data: posts = [] } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });
  const { data: experienceRaw } = useQuery<Experience[]>({ queryKey: ["/api/experience"] });
  const current = sortByPeriod(experienceRaw)[0];

  // Pick the series with the most recent post as the featured one
  const seriesMap = new Map<string, BlogPost[]>();
  posts.filter(p => p.seriesName).forEach(p => {
    seriesMap.set(p.seriesName!, [...(seriesMap.get(p.seriesName!) || []), p]);
  });
  const featuredSeries = Array.from(seriesMap.entries())
    .sort((a, b) => Math.max(...b[1].map(p => new Date(p.date).getTime())) - Math.max(...a[1].map(p => new Date(p.date).getTime())))
  [0] ?? null;

  return (
    <section className="intro" id="about" data-toc="About">
      <div className="who" id="home">
        <img className="avatar" src="/photo.jpg" alt="Photo of Parit Kansal" width={76} height={76} />
        <div>
          <h1>Parit Kansal</h1>
          <div className="role">
            Machine Learning Scientist{current ? ` at ${current.company.replace(/ Ltd\.?$/, "")}` : ""} · Hyderabad, India
          </div>
          <div className="open">Open to ML / AI roles</div>
        </div>
      </div>

      <div className="bio">
        <p>
          I build production machine learning systems. Right now I'm building <b>FigureIQ</b>, an AI-powered
          accounting automation platform, where I own the VLM extraction and AI-Judge verification pipeline end to end.
        </p>
        <p>
          Over the last two years I've shipped five client AI systems, from document processing at 100K+ documents a
          month to real-time video analytics for McDonald's Hyderabad. I also write long-form deep dives that derive
          machine learning methods from first principles.
        </p>
      </div>

      <div className="contact">
        {resume?.url && (
          <a className="cv" href={resume.url} target="_blank" rel="noopener noreferrer" data-testid="button-hero-resume">Résumé ↓</a>
        )}
        <a href="mailto:paritkansal121@gmail.com" data-testid="link-email">paritkansal121@gmail.com</a>
        <a href="https://github.com/ParitKansal" target="_blank" rel="noopener noreferrer" data-testid="link-github">GitHub</a>
        <a href="https://linkedin.com/in/paritkansal" target="_blank" rel="noopener noreferrer" data-testid="link-linkedin">LinkedIn</a>
        <a href="tel:+916398950353" data-testid="link-phone">+91 639-895-0353</a>
      </div>

      {featuredSeries && (
        <button
          type="button"
          className="now"
          onClick={() => document.querySelector("#series")?.scrollIntoView({ behavior: "smooth" })}
        >
          Currently writing: <b>{featuredSeries[0]}</b> series, {featuredSeries[1].length} {featuredSeries[1].length === 1 ? "part" : "parts"} →
        </button>
      )}
    </section>
  );
}
