import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { ContentRenderer } from "./ContentRenderer";
import { PenLine, Clock, ArrowRight, ArrowLeft, Loader2, Plus, Pencil, Search, Tag, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { SectionHeader } from "./SectionHeader";

export function BlogSection() {
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const { user } = useAuth();


  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: seriesOrder = [] } = useQuery<{ name: string; displayOrder: number; showInBlog: boolean }[]>({
    queryKey: ["/api/series-order"],
  });

  const hiddenSeriesNames = new Set(seriesOrder.filter((s) => s.showInBlog === false).map((s) => s.name));

  const blogVisiblePosts = posts.filter((p) => !(p.seriesName && (p.showInBlog === false || hiddenSeriesNames.has(p.seriesName))));
  const allTags = Array.from(new Set(blogVisiblePosts.flatMap((p) => p.tags || [])));

  const filteredPosts = posts.filter((post) => {
    if (post.seriesName && (post.showInBlog === false || hiddenSeriesNames.has(post.seriesName))) return false;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || (post.tags || []).includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const selectedBlog = posts.find((p) => p.id === selectedBlogId);
  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (selectedBlog) {
    return (
      <section id="blog" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => setSelectedBlogId(null)}
              data-testid="button-back-to-blogs"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Button>
            {user && (
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href={`/admin?action=edit&type=blog&id=${selectedBlog.id}`}>
                  <Pencil className="h-4 w-4" />
                  Edit Post
                </Link>
              </Button>
            )}
          </div>

          <article>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {selectedBlog.seriesName && (
                <Badge variant="outline" className="gap-1 text-primary border-primary/30">
                  <BookOpen className="h-3 w-3" />
                  {selectedBlog.seriesName}
                  {selectedBlog.seriesOrder != null && ` · Part ${selectedBlog.seriesOrder}`}
                </Badge>
              )}
              {(selectedBlog.tags || []).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {selectedBlog.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              <span>{formatDate(selectedBlog.date)}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {selectedBlog.readTime}
              </span>
            </div>

            <ContentRenderer content={selectedBlog.content} />
          </article>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          icon={PenLine}
          label="Blog"
          title="Latest Articles"
          subtitle="Occasional deep dives into ML concepts, tutorials, and industry insights."
          action={user ? (
            <Button asChild size="sm" className="gap-2">
              <Link href="/admin?action=new&type=blog">
                <Plus className="h-4 w-4" />
                Add Post
              </Link>
            </Button>
          ) : undefined}
        />

        <div className="mb-12 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
              aria-label="Search blog posts"
              data-testid="input-blog-search"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedTag(null)}
                className="h-8"
              >
                All
              </Button>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className="h-8 gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePosts.map((post) => (
                <div key={post.id} className="relative group/card-wrapper">
                  {user && (
                    <Button
                      asChild
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 z-10 opacity-0 group-hover/card-wrapper:opacity-100 transition-opacity shadow-sm"
                    >
                      <Link
                        href={`/admin?action=edit&type=blog&id=${post.id}`}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        aria-label={`Edit ${post.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Card
                    className="surface-card-interactive cursor-pointer group h-full flex flex-col"
                    onClick={() => setSelectedBlogId(post.id)}
                    data-testid={`card-blog-${post.id}`}
                  >
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.seriesName && (
                          <Badge variant="outline" className="text-xs gap-1 text-primary border-primary/30">
                            <BookOpen className="h-3 w-3" />
                            {post.seriesName}
                          </Badge>
                        )}
                        {(post.tags || []).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{ p: ({ children }) => <span>{children}</span> }}
                        >
                          {post.excerpt}
                        </ReactMarkdown>
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/60">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{formatDate(post.date)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {post.readTime}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {visibleCount < filteredPosts.length && (
              <div className="flex justify-center mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisibleCount(prev => prev + 6)}
                >
                  Load More Posts
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {searchQuery || selectedTag
                ? "No posts found matching your current filters."
                : "No blog posts yet. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
