import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { ContentRenderer } from "./ContentRenderer";
import { PaperSection, formatLongDate, formatMonthYear } from "./PaperSection";

const PAGE = 8;

export function BlogSection() {
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE);
  const { user } = useAuth();
  const articleRef = useRef<HTMLElement>(null);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: seriesOrder = [] } = useQuery<{ name: string; displayOrder: number; showInBlog: boolean }[]>({
    queryKey: ["/api/series-order"],
  });

  useEffect(() => {
    if (selectedBlogId != null && articleRef.current) {
      const top = articleRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [selectedBlogId]);

  const hiddenSeriesNames = new Set(seriesOrder.filter((s) => s.showInBlog === false).map((s) => s.name));
  const isListed = (p: BlogPost) => !(p.seriesName && (p.showInBlog === false || hiddenSeriesNames.has(p.seriesName)));

  const blogVisiblePosts = posts.filter(isListed);

  // Topic filters: the most used tags, so the row stays short
  const tagCounts = new Map<string, number>();
  blogVisiblePosts.forEach((p) => (p.tags || []).forEach((t) => tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)));
  const topTags = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t);
  if (selectedTag && !topTags.includes(selectedTag)) topTags.push(selectedTag);

  const q = searchQuery.toLowerCase();
  const filteredPosts = blogVisiblePosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q);
    const matchesTag = !selectedTag || (post.tags || []).includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const selectedBlog = posts.find((p) => p.id === selectedBlogId);
  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const adminAdd = user ? (
    <Link href="/admin?action=new&type=blog" className="addbtn">
      <Plus className="h-3.5 w-3.5" /> Add post
    </Link>
  ) : undefined;

  if (selectedBlog) {
    return (
      <PaperSection id="blog" title="Blog">
        <div className="reader-top" style={{ marginTop: 18 }}>
          <button type="button" className="back" onClick={() => setSelectedBlogId(null)} data-testid="button-back-to-blogs">
            <ArrowLeft className="h-4 w-4" /> Back to all posts
          </button>
          {user && (
            <Link href={`/admin?action=edit&type=blog&id=${selectedBlog.id}`} className="addbtn">
              <Pencil className="h-3.5 w-3.5" /> Edit post
            </Link>
          )}
        </div>
        <article ref={articleRef} className="reader">
          <h1 className="rt">{selectedBlog.title}</h1>
          <div className="rmeta">
            {selectedBlog.seriesName && (
              <span>
                {selectedBlog.seriesName}
                {selectedBlog.seriesOrder != null && `, part ${selectedBlog.seriesOrder}`}
              </span>
            )}
            <span>{formatLongDate(selectedBlog.date)}</span>
            <span>{selectedBlog.readTime}</span>
            {(selectedBlog.tags || []).length > 0 && <span>{(selectedBlog.tags || []).join(" · ")}</span>}
          </div>
          <div className="rbody">
            <ContentRenderer content={selectedBlog.content} />
          </div>
        </article>
      </PaperSection>
    );
  }

  return (
    <PaperSection
      id="blog"
      title="Blog"
      action={adminAdd}
      lead={`${blogVisiblePosts.length} articles on machine learning, mathematics and deep learning.`}
    >
      <input
        type="search"
        className="search"
        placeholder="Search articles…"
        value={searchQuery}
        onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(PAGE); }}
        aria-label="Search blog posts"
        data-testid="input-blog-search"
      />

      {topTags.length > 0 && (
        <div className="filters" role="group" aria-label="Filter by topic">
          <button type="button" aria-pressed={selectedTag === null} onClick={() => { setSelectedTag(null); setVisibleCount(PAGE); }}>
            All
          </button>
          {topTags.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={selectedTag === tag}
              onClick={() => { setSelectedTag(tag); setVisibleCount(PAGE); }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <p className="loading">Loading articles…</p>
      ) : filteredPosts.length > 0 ? (
        <>
          <ol className="refs">
            {visiblePosts.map((post, i) => (
              <li key={post.id} data-testid={`card-blog-${post.id}`}>
                <span className="k">[{i + 1}]</span>
                <span>
                  <button type="button" className="t" onClick={() => setSelectedBlogId(post.id)}>
                    {post.title}
                  </button>
                  <span className="d">
                    {post.seriesName
                      ? `${post.seriesName}${post.seriesOrder != null ? `, part ${post.seriesOrder}` : ""}`
                      : (post.tags || [])[0] ?? "Standalone"}
                    {" · "}
                    {formatMonthYear(post.date)}
                  </span>
                </span>
                <span className="m">
                  {post.readTime}
                  {user && (
                    <Link href={`/admin?action=edit&type=blog&id=${post.id}`} aria-label={`Edit ${post.title}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </span>
              </li>
            ))}
          </ol>
          {visibleCount < filteredPosts.length && (
            <button type="button" className="more" onClick={() => setVisibleCount((prev) => prev + 10)}>
              Show more ({filteredPosts.length - visibleCount} more) →
            </button>
          )}
        </>
      ) : (
        <p className="lead">
          {searchQuery || selectedTag ? "No posts match these filters." : "No blog posts yet. Check back soon!"}
        </p>
      )}
    </PaperSection>
  );
}
