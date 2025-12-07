import { useState } from "react";
import { BookOpen, Search, Calendar, Tag, Plus, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { KnowledgeEntry } from "@shared/schema";

export function KnowledgeVaultSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: entries = [], isLoading } = useQuery<KnowledgeEntry[]>({
    queryKey: ["/api/knowledge"],
  });

  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags)));

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || entry.tags.includes(selectedTag);
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

  return (
    <section id="knowledge-vault" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-semibold">Knowledge Vault</h2>
          </div>
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
              <Card key={entry.id} data-testid={`card-knowledge-entry-${entry.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(entry.date)}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{entry.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {entry.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
