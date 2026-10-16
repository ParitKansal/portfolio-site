import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Pencil, List, X } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { ContentRenderer } from "@/components/ContentRenderer";
import { formatLongDate } from "@/components/PaperSection";
import "@/paper.css";

/**
 * Full-page "book" reader for blog posts and series chapters.
 * URL: /read/:id   (?from=blog | series decides where "Back" returns to)
 * Series posts get a chapter list, "Chapter n of N" and page-turn navigation.
 */
export default function ReaderPage() {
  const { id } = useParams<{ id: string }>();
  const search = useSearch();
  const from = new URLSearchParams(search).get("from") === "blog" ? "blog" : "series";
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [tocOpen, setTocOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const dir = useRef(1); // 1 = forward (next page), -1 = back

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });
  const post = posts.find((p) => String(p.id) === id);

  // Chapters of the same series, in reading order
  const chapters = useMemo(() => {
    if (!post?.seriesName) return [] as BlogPost[];
    return posts
      .filter((p) => p.seriesName === post.seriesName)
      .sort((a, b) => {
        if (a.seriesOrder != null && b.seriesOrder != null) return a.seriesOrder - b.seriesOrder;
        if (a.seriesOrder != null) return -1;
        if (b.seriesOrder != null) return 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [posts, post?.seriesName]);

  const idx = chapters.findIndex((p) => p.id === post?.id);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null;

  const href = (p: BlogPost) => `/read/${p.id}?from=${from}`;
  const go = (p: BlogPost | null, d: number) => {
    if (!p) return;
    dir.current = d;
    setTocOpen(false);
    navigate(href(p));
  };

  // New page: start at the top (instant: the site's CSS turns on smooth scrolling), set the tab title
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const original = document.title;
    if (post) document.title = `${post.title} · Parit Kansal`;
    return () => { document.title = original; };
  }, [post?.id]);

  // Reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [post?.id]);

  // ← / → turn pages, Esc closes the chapter list
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /input|textarea|select/i.test(t.tagName)) return;
      if (e.key === "ArrowRight") go(next, 1);
      else if (e.key === "ArrowLeft") go(prev, -1);
      else if (e.key === "Escape") setTocOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const backHref = `/#${from}`;

  if (isLoading) {
    return (
      <div className="pp book-wrap">
        <p className="loading" style={{ textAlign: "center", paddingTop: 120 }}>Opening…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pp book-wrap">
        <div className="book-missing">
          <h1>This article isn’t available</h1>
          <p>It may have been moved or hidden.</p>
          <Link href={backHref} className="lnk">← Back to paritkansal.in</Link>
        </div>
      </div>
    );
  }

  const isSeries = chapters.length > 0;

  return (
    <div className="pp book-wrap">
      <div className="book-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />

      <header className="book-bar">
        <Link href={backHref} className="book-back" data-testid="button-back-from-reader">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
        <Link href="/" className="book-brand" aria-label="paritkansal.in home">
          <img src="/logo.png" alt="" width={24} height={24} />
          <span>paritkansal<b>.in</b></span>
        </Link>
        <div className="book-tools">
          {user && (
            <Link href={`/admin?action=edit&type=blog&id=${post.id}`} className="book-icon" aria-label="Edit post">
              <Pencil className="h-4 w-4" />
            </Link>
          )}
          {isSeries && (
            <button type="button" className="book-icon toc-btn" onClick={() => setTocOpen((o) => !o)} aria-expanded={tocOpen} aria-label="Chapters">
              {tocOpen ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
              <span className="hide-xs">Chapters</span>
            </button>
          )}
        </div>
      </header>

      <div className={`book-shell${isSeries ? " has-toc" : ""}`}>
        {isSeries && (
          <aside className={`book-toc${tocOpen ? " open" : ""}`} aria-label="Chapters">
            <div className="lbl">{post.seriesName}</div>
            <ol>
              {chapters.map((c, i) => (
                <li key={c.id}>
                  <Link
                    href={href(c)}
                    onClick={() => { dir.current = i >= idx ? 1 : -1; setTocOpen(false); }}
                    aria-current={c.id === post.id ? "page" : undefined}
                  >
                    <span className="no">{i + 1}</span>
                    <span>{c.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        )}
        {tocOpen && <button type="button" className="book-scrim" aria-label="Close chapters" onClick={() => setTocOpen(false)} />}

        <div className="book-stage">
          <AnimatePresence mode="wait" initial={true} custom={dir.current}>
            <motion.article
              key={post.id}
              className="book-page"
              custom={dir.current}
              variants={{
                enter: (d: number) => ({ opacity: 0, rotateY: d > 0 ? 14 : -14, x: d > 0 ? 40 : -40 }),
                center: { opacity: 1, rotateY: 0, x: 0 },
                exit: (d: number) => ({ opacity: 0, rotateY: d > 0 ? -10 : 10, x: d > 0 ? -30 : 30 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ transformOrigin: dir.current > 0 ? "left center" : "right center" }}
            >
              <div className="book-head">
                {isSeries ? (
                  <div className="kicker">{post.seriesName} · Chapter {idx + 1} of {chapters.length}</div>
                ) : (
                  <div className="kicker">{(post.tags || [])[0] ?? "Article"}</div>
                )}
                <h1>{post.title}</h1>
                <div className="meta">
                  <span>{formatLongDate(post.date)}</span>
                  {post.readTime && <span>{post.readTime}</span>}
                </div>
                <div className="orn" aria-hidden="true">❦</div>
              </div>

              <div className="book-body">
                <ContentRenderer content={post.content} />
              </div>

              {(post.tags || []).length > 0 && (
                <div className="book-tags">{(post.tags || []).join(" · ")}</div>
              )}

              <div className="book-foot">
                {isSeries ? (
                  <>
                    {prev ? (
                      <button type="button" className="turn prev" onClick={() => go(prev, -1)}>
                        <small>← Previous chapter</small>
                        <span>{prev.title}</span>
                      </button>
                    ) : <span />}
                    <span className="folio">{idx + 1} / {chapters.length}</span>
                    {next ? (
                      <button type="button" className="turn next" onClick={() => go(next, 1)}>
                        <small>Next chapter →</small>
                        <span>{next.title}</span>
                      </button>
                    ) : (
                      <Link href={backHref} className="turn next">
                        <small>The end</small>
                        <span>Back to all series</span>
                      </Link>
                    )}
                  </>
                ) : (
                  <Link href={backHref} className="turn prev">
                    <small>← Back</small>
                    <span>All articles</span>
                  </Link>
                )}
              </div>
            </motion.article>
          </AnimatePresence>
          {isSeries && <p className="book-hint">Tip: use the ← and → keys to turn pages.</p>}
        </div>
      </div>
    </div>
  );
}
