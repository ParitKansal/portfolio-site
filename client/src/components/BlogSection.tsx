import { useState } from "react";
import { ContentRenderer } from "./ContentRenderer";
import { PenLine, Clock, ArrowRight, ArrowLeft, Loader2, Plus, Pencil, Search, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export function BlogSection() {
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const { user } = useAuth();

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));

  const filteredPosts = posts.filter((post) => {
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
      <section id="blog" className="py-16 md:py-24 px-4 sm:px-6">
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
              <Link href={`/admin?action=edit&type=blog&id=${selectedBlog.id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit Post
                </Button>
              </Link>
            )}
          </div>

          <article>
            <div className="flex flex-wrap items-center gap-3 mb-4">
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
    <section id="blog" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <PenLine className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-semibold">Blog</h2>
          </div>
          {user && (
            <Link href="/admin?action=new&type=blog">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Post
              </Button>
            </Link>
          )}
        </div>
        <p className="text-muted-foreground mb-8">
          Occasional deep dives into ML concepts, tutorials, and industry insights.
        </p>

        <div className="mb-12 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
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
                    <Link href={`/admin?action=edit&type=blog&id=${post.id}`}>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover/card-wrapper:opacity-100 transition-opacity shadow-sm"
                        onClick={(e) => e.stopPropagation()} // Prevent card click
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Card
                    className="hover-elevate cursor-pointer group h-full"
                    onClick={() => setSelectedBlogId(post.id)}
                    data-testid={`card-blog-${post.id}`}
                  >
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(post.tags || []).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-lg leading-snug">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{formatDate(post.date)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
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
