import { useQuery } from "@tanstack/react-query";
import type { Resume, BlogPost, Experience, Education } from "@shared/schema";
import { sortByPeriod } from "./PaperSection";

export function HeroSection() {
  const { data: resume } = useQuery<Resume>({ queryKey: ["/api/resume"] });
  const { data: posts = [] } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });
  const { data: experienceRaw } = useQuery<Experience[]>({ queryKey: ["/api/experience"] });
  const experience = sortByPeriod(experienceRaw);
  const { data: education = [] } = useQuery<Education[]>({ queryKey: ["/api/education"] });

  // Pick the series with the most recent post as the featured one
  const seriesMap = new Map<string, BlogPost[]>();
  posts.filter(p => p.seriesName).forEach(p => {
    seriesMap.set(p.seriesName!, [...(seriesMap.get(p.seriesName!) || []), p]);
  });
  const featuredSeries = Array.from(seriesMap.entries())
    .sort((a, b) => Math.max(...b[1].map(p => new Date(p.date).getTime())) - Math.max(...a[1].map(p => new Date(p.date).getTime())))
  [0] ?? null;

  // "Affiliations", like a paper's author block: current employer, then university
  const university =
    education.find(e => /universit|institute|college/i.test(e.institution)) ?? education[0];
  const affiliations = [experience[0]?.company, university?.institution].filter(Boolean) as string[];

  return (
    <>
      <header className="head" id="home">
        <div className="venue">
          <span>MACHINE LEARNING SCIENTIST · HYDERABAD, INDIA</span>
          <span className="open">Open to ML / AI roles</span>
        </div>
        <div className="namerow">
          <img className="avatar" src="/photo.jpg" alt="Photo of Parit Kansal" width={92} height={92} />
          <h1 className="title">Parit Kansal</h1>
        </div>
        <p className="subtitle">Building intelligent systems at scale in computer vision, NLP and deep learning.</p>

        {affiliations.length > 0 && (
          <div className="authors">
            {affiliations.map((a, i) => (
              <span key={a}>
                {i === 0 ? <b>{a}</b> : a}
                <sup>{i + 1}</sup>
              </span>
            ))}
          </div>
        )}

        <div className="links">
          {resume?.url && (
            <a className="pill main" href={resume.url} target="_blank" rel="noopener noreferrer" data-testid="button-hero-resume">
              Download résumé
            </a>
          )}
          <a className="pill" href="https://github.com/ParitKansal" target="_blank" rel="noopener noreferrer" data-testid="link-github">GitHub</a>
          <a className="pill" href="https://linkedin.com/in/paritkansal" target="_blank" rel="noopener noreferrer" data-testid="link-linkedin">LinkedIn</a>
          <a className="pill" href="mailto:paritkansal121@gmail.com" data-testid="link-email"><small>email</small>paritkansal121@gmail.com</a>
          <a className="pill" href="tel:+916398950353" data-testid="link-phone"><small>phone</small>+91 639-895-0353</a>
        </div>

        {featuredSeries && (
          <button
            type="button"
            className="now"
            onClick={() => document.querySelector("#series")?.scrollIntoView({ behavior: "smooth" })}
          >
            <b>Currently writing</b> {featuredSeries[0]} series · {featuredSeries[1].length} {featuredSeries[1].length === 1 ? "part" : "parts"} →
          </button>
        )}
      </header>

      <div className="abstract" id="abstract" data-toc="Abstract" data-num="0">
        <h2>Abstract</h2>
        <p>
          Production ML scientist at Xelpmoc, currently building FigureIQ, an AI-powered accounting automation
          platform, and owning its VLM extraction and AI-Judge verification pipeline end to end through a deep
          QuickBooks Online integration. In the last two years I have shipped five client-facing AI systems, including
          a 100K+ documents/month IDP platform at 96–98% accuracy, real-time video analytics across 325 concurrent
          RTSP streams for McDonald's Hyderabad, and lead scoring on 8M+ behavioural sessions. I also write long-form
          deep dives that derive machine learning methods from first principles.
        </p>
        <p className="kw"><b>Keywords:</b> document AI, VLMs, AI-judge verification, computer vision, multimodal AI, PEFT, RAG</p>
      </div>
    </>
  );
}
