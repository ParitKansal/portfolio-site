import { useQuery } from "@tanstack/react-query";
import type { BlogPost, Experience } from "@shared/schema";

// Right-hand "at a glance" cards on wide screens. Counts come from live data.
export function MarginNotes() {
  const { data: experience = [] } = useQuery<Experience[]>({ queryKey: ["/api/experience"] });
  const { data: posts = [] } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });
  const { data: seriesOrder = [] } = useQuery<{ name: string; showInSeries?: boolean }[]>({ queryKey: ["/api/series-order"] });

  const shipped = experience.reduce((n, e) => n + e.projects.length, 0);
  const since = experience[experience.length - 1]?.period?.split(/[–-]/)[0]?.trim();
  const hiddenSeries = new Set(seriesOrder.filter((s) => s.showInSeries === false).map((s) => s.name));
  const seriesCount = new Set(posts.filter((p) => p.seriesName && !hiddenSeries.has(p.seriesName)).map((p) => p.seriesName)).size;

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
        {posts.length > 0 && (
          <div className="card">
            <b>Writing</b>
            <span className="big">{posts.length}</span>
            articles across {seriesCount} deep-dive series
          </div>
        )}
      </div>
    </aside>
  );
}
