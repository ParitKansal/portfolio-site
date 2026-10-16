import { useQuery } from "@tanstack/react-query";
import type { BlogPost, Experience } from "@shared/schema";
import { sortByPeriod } from "./PaperSection";

// Right-hand "at a glance" cards on wide screens. Counts come from live data.
export function MarginNotes() {
  const { data: experienceRaw } = useQuery<Experience[]>({ queryKey: ["/api/experience"] });
  const experience = sortByPeriod(experienceRaw);
  const { data: posts = [] } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });
  const { data: seriesOrder = [] } = useQuery<{ name: string; showInSeries?: boolean; showInBlog?: boolean }[]>({ queryKey: ["/api/series-order"] });

  // Client systems at the current job (the first entry)
  const shipped = experience[0]?.projects.length ?? 0;
  const since = experience[0]?.period?.split(/[–-]/)[0]?.trim();
  // Count only what a visitor can actually reach: posts listed in the Blog section,
  // plus parts of series shown in the Deep-dive series section.
  const notInSeries = new Set(seriesOrder.filter((s) => s.showInSeries === false).map((s) => s.name));
  const notInBlog = new Set(seriesOrder.filter((s) => s.showInBlog === false).map((s) => s.name));
  const inSeriesSection = (p: BlogPost) => !!p.seriesName && !notInSeries.has(p.seriesName);
  const inBlogSection = (p: BlogPost) => !(p.seriesName && (p.showInBlog === false || notInBlog.has(p.seriesName)));
  const shownPosts = posts.filter((p) => inSeriesSection(p) || inBlogSection(p));
  const seriesCount = new Set(posts.filter(inSeriesSection).map((p) => p.seriesName)).size;

  return (
    <aside className="margin" aria-label="At a glance">
      <div className="note">
        {shipped > 0 && (
          <div className="card">
            <b>Shipped</b>
            <span className="big">{shipped}</span>
            client AI systems{since ? ` since ${since}` : ""}
          </div>
        )}
        <div className="card">
          <b>Scale</b>
          <span className="big">100K+</span>
          documents processed every month
        </div>
        {shownPosts.length > 0 && (
          <div className="card">
            <b>Writing</b>
            <span className="big">{shownPosts.length}</span>
            articles across {seriesCount} deep-dive series
          </div>
        )}
      </div>
    </aside>
  );
}
