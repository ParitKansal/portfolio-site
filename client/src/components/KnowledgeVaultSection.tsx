import { useState } from "react";
import { ContentRenderer } from "./ContentRenderer";
import { BookOpen, Search, Calendar, Tag, ArrowLeft, Loader2, Plus, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { KnowledgeEntry } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export function KnowledgeVaultSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const { user } = useAuth();

  const { data: entries = [], isLoading } = useQuery<KnowledgeEntry[]>({
    queryKey: ["/api/knowledge"],
  });

  const selectedEntry = entries.find((e) => e.id === selectedEntryId);

  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags || [])));

  const filteredEntries = entries.filter((entry) => {
    const contentText = entry.content
      .filter(b => b.type === "text")
      .map(b => b.value)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contentText.includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || (entry.tags || []).includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (selectedEntry) {
    return (
      <section id="knowledge-vault" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => setSelectedEntryId(null)}
              data-testid="button-back-to-knowledge"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to knowledge vault
            </Button>
            {user && (
              <Link href={`/admin?action=edit&type=knowledge&id=${selectedEntry.id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit Entry
                </Button>
              </Link>
            )}
          </div>

          <article className="bg-card rounded-lg border p-6 md:p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {(selectedEntry.tags || []).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {selectedEntry.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(selectedEntry.date)}</span>
            </div>

            <ContentRenderer content={selectedEntry.content} />
          </article>
        </div>
      </section>
    );
  }

  return (
    <section id="knowledge-vault" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-semibold">Knowledge Vault</h2>
          </div>
          {user && (
            <Link href="/admin?action=new&type=knowledge">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Entry
              </Button>
            </Link>
          )}
        </div>
        <p className="text-muted-foreground mb-8">
          Daily learnings and insights from my journey in Machine Learning and AI.
        </p>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-knowledge-search"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedTag(null)}
                data-testid="button-filter-all"
              >
                All
              </Button>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  data-testid={`button-filter-${tag.toLowerCase().replace(" ", "-")}`}
                >
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
        ) : (
          <div className="space-y-6">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="relative group/card-wrapper">
                {user && (
                  <Link href={`/admin?action=edit&type=knowledge&id=${entry.id}`}>
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
                  data-testid={`card-knowledge-entry-${entry.id}`}
                  className="hover-elevate cursor-pointer group transition-all h-full"
                  onClick={() => setSelectedEntryId(entry.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(entry.date)}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">{entry.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {entry.content.find(b => b.type === "text")?.value || "Click to view content"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(entry.tags || []).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {searchQuery || selectedTag
                ? "No entries found matching your search."
                : "No knowledge entries yet. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
