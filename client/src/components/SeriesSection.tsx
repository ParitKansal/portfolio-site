import { useState } from "react";
import { BookOpen, ArrowRight, Clock, Loader2, ChevronDown, ChevronRight, ArrowLeft, Pencil, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";
import { ContentRenderer } from "./ContentRenderer";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export function SeriesSection() {
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set());
  const [openPost, setOpenPost] = useState<BlogPost | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const { user } = useAuth();

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

  if (!isLoading && seriesMap.size === 0) return null;

  const allTags = (seriesPosts: BlogPost[]) =>
    Array.from(new Set(seriesPosts.flatMap((p) => p.tags || [])));

  const totalReadTime = (seriesPosts: BlogPost[]) => {
    const mins = seriesPosts.reduce((acc, p) => {
      const m = parseInt(p.readTime);
      return acc + (isNaN(m) ? 0 : m);
    }, 0);
    return mins > 0 ? `~${mins} min total` : null;
  };

  const toggleSeries = (name: string) => {
    setExpandedSeries((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
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

  // Full post reader view
  if (openPost) {
    const seriesPosts = seriesMap.get(openPost.seriesName!) || [];
    const currentIndex = seriesPosts.findIndex((p) => p.id === openPost.id);
    const prevPost = seriesPosts[currentIndex - 1] ?? null;
    const nextPost = seriesPosts[currentIndex + 1] ?? null;

    return (
      <section id="series" className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="ghost" className="gap-2" onClick={() => setOpenPost(null)}>
              <ArrowLeft className="h-4 w-4" />
              Back to {openPost.seriesName}
            </Button>
            <div className="flex items-center gap-2">
              {user && (
                <Link href={`/admin?action=edit&type=blog&id=${openPost.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Post
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex gap-10 items-start">
            {/* Sticky sidebar TOC */}
            <aside className="hidden lg:block w-72 shrink-0 sticky top-28 self-start">
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                {/* Header */}
                <div className="px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-bold truncate">{openPost.seriesName}</span>
                    <span className="ml-auto text-xs text-muted-foreground shrink-0">
                      {currentIndex + 1}/{seriesPosts.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentIndex} of {seriesPosts.length} chapters read
                  </p>
                </div>

                {/* Pipeline chapter list */}
                <div className="px-4 pt-4 pb-2 overflow-y-auto max-h-[60vh]">
                  {seriesPosts.map((post, idx) => {
                    const isCurrent = post.id === openPost.id;
                    const isDone = idx < currentIndex;
                    const isLast = idx === seriesPosts.length - 1;

                    return (
                      <button
                        key={post.id}
                        ref={isCurrent ? (el) => el?.scrollIntoView({ block: "nearest" }) : undefined}
                        onClick={() => setOpenPost(post)}
                        className="w-full flex gap-3 text-left group"
                      >
                        {/* Icon + connector */}
                        <div className="flex flex-col items-center shrink-0 pt-2 pb-1">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isDone
                              ? "bg-primary border-primary text-primary-foreground"
                              : isCurrent
                              ? "border-primary text-primary"
                              : "border-muted-foreground/30 text-muted-foreground"
                          }`}>
                            {isDone ? (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-[10px] font-bold">{post.seriesOrder ?? idx + 1}</span>
                            )}
                          </div>
                          {!isLast && (
                            <div className={`w-0.5 flex-1 mt-1 min-h-[1.25rem] ${isDone ? "bg-primary" : "bg-border"}`} />
                          )}
                        </div>

                        {/* Text */}
                        <div className={`flex-1 min-w-0 py-2 pr-2 ${isLast ? "" : "pb-3"} border-l-2 pl-2 transition-colors ${
                          isCurrent ? "border-primary" : "border-transparent"
                        }`}>
                          <p className={`text-xs leading-snug ${
                            isCurrent
                              ? "font-semibold text-foreground"
                              : isDone
                              ? "text-foreground/60"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}>
                            {post.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Prev / Next */}
                <div className="flex border-t border-border">
                  <button
                    disabled={!prevPost}
                    onClick={() => prevPost && setOpenPost(prevPost)}
                    className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-border"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Prev
                  </button>
                  <button
                    disabled={!nextPost}
                    onClick={() => nextPost && setOpenPost(nextPost)}
                    className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumb (mobile: full, desktop: compact) */}
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1.5 text-primary font-medium">
                    <BookOpen className="h-4 w-4 lg:hidden" />
                    <span className="lg:hidden">Series: {openPost.seriesName} /</span>
                    <span className="text-muted-foreground">
                      Chapter {openPost.seriesOrder} of {seriesPosts.length}
                    </span>
                  </div>
                </div>
                {/* Mobile prev/next */}
                <div className="flex items-center gap-2 lg:hidden">
                  <Button variant="outline" size="sm" className="gap-1.5" disabled={!prevPost} onClick={() => prevPost && setOpenPost(prevPost)}>
                    <ArrowLeft className="h-3.5 w-3.5" /> Prev
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" disabled={!nextPost} onClick={() => nextPost && setOpenPost(nextPost)}>
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <article>
                <h1 className="text-3xl font-bold mb-4">{openPost.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(openPost.tags || []).map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                  <span>{formatDate(openPost.date)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {openPost.readTime}
                  </span>
                </div>
                <ContentRenderer content={openPost.content} />
              </article>

              {/* Bottom prev/next */}
              <div className="flex items-center justify-between mt-16 pt-8 border-t border-border gap-4">
                {prevPost ? (
                  <button
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                    onClick={() => setOpenPost(prevPost)}
                  >
                    <ArrowLeft className="h-4 w-4 shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-0.5">Previous</p>
                      <p className="font-medium">{prevPost.title}</p>
                    </div>
                  </button>
                ) : <div />}

                {nextPost ? (
                  <button
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right ml-auto"
                    onClick={() => setOpenPost(nextPost)}
                  >
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-0.5">Next</p>
                      <p className="font-medium">{nextPost.title}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </button>
                ) : <div />}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Series listing view
  return (
    <section id="series" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-semibold">Series</h2>
        </div>
        <p className="text-muted-foreground mb-10">
          Multi-part deep dives on focused topics. Read them in order for the full picture.
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedSeriesEntries.slice(0, visibleCount).map(([seriesName, seriesPosts]) => {
              const tags = allTags(seriesPosts);
              const readTime = totalReadTime(seriesPosts);
              const isExpanded = expandedSeries.has(seriesName);

              return (
                <Card
                  key={seriesName}
                  className="border-l-4 border-l-primary/40 hover:border-l-primary transition-colors overflow-hidden"
                >
                  <CardHeader
                    className="pb-3 cursor-pointer select-none"
                    onClick={() => toggleSeries(seriesName)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl leading-snug">{seriesName}</CardTitle>
                      {isExpanded
                        ? <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        : <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      }
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent>
                    {isExpanded ? (
                      <div className="divide-y divide-border -mx-6 mb-4 max-h-72 overflow-y-auto">
                        {seriesPosts.map((post, idx) => (
                          <div
                            key={post.id}
                            className="flex items-start gap-3 px-6 py-3 hover:bg-muted/30 cursor-pointer transition-colors group"
                            onClick={() => setOpenPost(post)}
                          >
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                                {post.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {post.excerpt}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                        {seriesPosts.map((post, idx) => (
                          <div key={post.id} className="flex items-center gap-2 text-sm">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-muted-foreground line-clamp-1">{post.title}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border">
                      <span>{seriesPosts.length} {seriesPosts.length === 1 ? "part" : "parts"}</span>
                      {readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {readTime}
                        </span>
                      )}
                      <button
                        className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={(e) => { e.stopPropagation(); downloadSeries(seriesName, seriesPosts); }}
                        title="Download full series as Markdown"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {visibleCount < sortedSeriesEntries.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount(prev => prev + 4)}
                className="px-6 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                Load More Series
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </section>
  );
}
