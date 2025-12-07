import { useState } from "react";
import { PenLine, Clock, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";

export function BlogSection() {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const selectedBlog = posts.find((p) => p.id === selectedBlogId);

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
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            className="mb-8 gap-2"
            onClick={() => setSelectedBlogId(null)}
            data-testid="button-back-to-blogs"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Button>

          <article>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {selectedBlog.tags.map((tag) => (
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
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {selectedBlog.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h3 key={index} className="text-lg font-semibold mt-6 mb-3">
                      {paragraph.replace(/\*\*/g, "")}
                    </h3>
                  );
                }
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
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
        </div>
        <p className="text-muted-foreground mb-12">
          Occasional deep dives into ML concepts, tutorials, and industry insights.
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="hover-elevate cursor-pointer group"
                onClick={() => setSelectedBlogId(post.id)}
                data-testid={`card-blog-${post.id}`}
              >
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map((tag) => (
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
                  <div className="flex items-center justify-between">
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <PenLine className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              No blog posts yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
