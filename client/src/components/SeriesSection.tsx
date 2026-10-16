import { useState } from "react";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";
import { Link } from "wouter";
import { PaperSection } from "./PaperSection";

// One-line descriptions for the series cards. Series not listed here fall back to their tags.
const SERIES_DESCRIPTIONS: Record<string, string> = {
  "Machine Learning": "Regression and regularisation through trees, ensembles and boosting",
  "PEFT": "Adapters, prompts, LoRA and quantization",
  "Parameter-Efficient Fine-Tuning": "Adapters, prompts, LoRA and quantization",
  "Linear Algebra": "Vectors to cross products, built geometrically",
  "Feature Engineering": "Scaling, transformations, imbalance and dimension reduction",
  "DSA": "Graph algorithms, written as interview-ready notes",
};

// Logo blue from dark to light, forest green from the portrait for contrast
const SERIES_COLORS = ["#0A3A6B", "#1068BD", "#3F86CF", "#3D5A27", "#6E9FD6", "#0B4F91"];

export function SeriesSection() {
  const [visibleCount, setVisibleCount] = useState(6);
  // Chapters open on their own full page (/read/:id), like turning to a page in a book
  const readHref = (post: BlogPost) => `/read/${post.id}?from=series`;

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: seriesOrder = [] } = useQuery<{ name: string; displayOrder: number; showInBlog: boolean; showInSeries: boolean }[]>({
    queryKey: ["/api/series-order"],
  });

  const seriesMap = new Map<string, BlogPost[]>();
  posts
    .filter((p) => p.seriesName)
    .forEach((post) => {
      const list = seriesMap.get(post.seriesName!) || [];
      seriesMap.set(post.seriesName!, [...list, post]);
    });

  seriesMap.forEach((list, name) => {
    seriesMap.set(name, list.sort((a, b) => {
      if (a.seriesOrder != null && b.seriesOrder != null) return a.seriesOrder - b.seriesOrder;
      if (a.seriesOrder != null) return -1;
      if (b.seriesOrder != null) return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }));
  });

  const orderMap = new Map(seriesOrder.map((s) => [s.name, s.displayOrder]));
  const showInSeriesMap = new Map(seriesOrder.map((s) => [s.name, s.showInSeries ?? true]));
  const sortedSeriesEntries = Array.from(seriesMap.entries())
    .filter(([name]) => showInSeriesMap.get(name) !== false)
    .sort(([a], [b]) => {
      const oa = orderMap.get(a) ?? Infinity;
      const ob = orderMap.get(b) ?? Infinity;
      return oa - ob;
    });

  // The series with the newest post gets a "Writing now" badge
  const latestSeries = Array.from(seriesMap.entries())
    .sort((a, b) => Math.max(...b[1].map(p => new Date(p.date).getTime())) - Math.max(...a[1].map(p => new Date(p.date).getTime())))[0]?.[0];

  if (!isLoading && seriesMap.size === 0) return null;

  const allTags = (seriesPosts: BlogPost[]) =>
    Array.from(new Set(seriesPosts.flatMap((p) => p.tags || [])));

  const totalMinutes = (seriesPosts: BlogPost[]) =>
    seriesPosts.reduce((acc, p) => {
      const m = parseInt(p.readTime);
      return acc + (isNaN(m) ? 0 : m);
    }, 0);

  const totalReadTime = (seriesPosts: BlogPost[]) => {
    const mins = totalMinutes(seriesPosts);
    return mins > 0 ? `~${mins} min total` : null;
  };

  const formatDate = (dateStr: string | Date) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });

  const blocksToMarkdown = (blocks: BlogPost["content"]): string =>
    (Array.isArray(blocks) ? blocks : []).map((block) => {
      switch (block.type) {
        case "text": return block.value ?? "";
        case "code": return `\`\`\`${block.language ?? ""}\n${block.value ?? ""}\n\`\`\``;
        case "image": return `<img src="${block.url}"${block.width ? ` width="${block.width}%"` : ""}${block.caption ? ` alt="${block.caption}"` : ""} />${block.caption ? `\n_${block.caption}_` : ""}`;
        case "video": {
          const ytMatch = block.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          if (ytMatch) {
            const videoId = ytMatch[1];
            const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            return `<img src="${thumbnail}" style="max-width:100%;display:block;" alt="${block.caption ?? "YouTube Thumbnail"}" />\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>${block.caption ? `\n_${block.caption}_` : ""}`;
          }
          return `<video src="${block.url}" controls style="max-width:100%"></video>${block.caption ? `\n_${block.caption}_` : ""}`;
        }
        case "pdf": return `[PDF${block.caption ? `: ${block.caption}` : ""}](${block.url})`;
        case "link": {
          const label = block.icon && block.caption ? `${block.icon}: ${block.caption}` : (block.caption ?? "");
          return `<a href="${block.url}" target="_blank" style="display:inline-block;text-decoration:none;">${block.thumbnail ? `\n  <img src="${block.thumbnail}" style="max-width:100%;display:block;" />` : ""}${label ? `\n  <span>${label}</span>` : ""}${block.url ? `\n  <small style="display:block;color:gray;">${block.url}</small>` : ""}\n</a>`;
        }
        case "iframe": return `[${block.caption ?? "Open Interactive Embed"}](${block.url}) _(interactive — open in browser)_`;
        default: return "";
      }
    }).filter(Boolean).join("\n\n");

  const downloadSeries = (seriesName: string, seriesPosts: BlogPost[]) => {
    const content = seriesPosts.map((post, idx) => {
      const date = formatDate(post.date);
      return `# Chapter ${idx + 1}: ${post.title}\n\n_${date} · ${post.readTime}_\n\n${blocksToMarkdown(post.content)}`;
    }).join("\n\n---\n\n");

    const fullContent = `# ${seriesName}\n\n_${seriesPosts.length} chapters · ${totalReadTime(seriesPosts) ?? ""}_\n\n---\n\n${content}`;
    const blob = new Blob([fullContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${seriesName.toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Series listing view
  return (
    <PaperSection id="series" title="Deep-dive series" lead="Multi-part deep dives on focused topics. Read in order for the full picture.">
      {isLoading ? (
        <p className="loading">Loading series…</p>
      ) : (
        <>
          <div className="series">
            {sortedSeriesEntries.slice(0, visibleCount).map(([seriesName, seriesPosts], i) => {
              const mins = totalMinutes(seriesPosts);
              const description = SERIES_DESCRIPTIONS[seriesName] ?? allTags(seriesPosts).slice(0, 4).join(", ");
              return (
                <details
                  key={seriesName}
                  className="s"
                  open={i === 0}
                  style={{ ["--h" as string]: SERIES_COLORS[i % SERIES_COLORS.length] } as React.CSSProperties}
                >
                  <summary>
                    <div>
                      <h4>
                        {seriesName}
                        {seriesName === latestSeries && <span className="badge prog">Writing now</span>}
                      </h4>
                      {description && <span className="dsc">{description}</span>}
                    </div>
                    <span className="m">
                      <b>{seriesPosts.length} {seriesPosts.length === 1 ? "part" : "parts"}</b>
                      {mins > 0 ? `~${mins} min` : ""}
                    </span>
                  </summary>
                  <ol>
                    {seriesPosts.map((post) => (
                      <li key={post.id}>
                        <Link href={readHref(post)}>{post.title}</Link>
                      </li>
                    ))}
                  </ol>
                  <div className="sfoot">
                    <Link href={readHref(seriesPosts[0])}>Start reading →</Link>
                    <button type="button" onClick={() => downloadSeries(seriesName, seriesPosts)} title="Download full series as Markdown">
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  </div>
                </details>
              );
            })}
          </div>
          {visibleCount < sortedSeriesEntries.length && (
            <button type="button" className="more" onClick={() => setVisibleCount(prev => prev + 4)}>
              More series →
            </button>
          )}
        </>
      )}
    </PaperSection>
  );
}
