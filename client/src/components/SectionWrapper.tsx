import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SectionSetting } from "@shared/schema";

interface SectionWrapperProps {
  sectionKey: string;
  adminTab?: string;
  children: React.ReactNode;
}

export function SectionWrapper({ sectionKey, adminTab, children }: SectionWrapperProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings = [] } = useQuery<SectionSetting[]>({
    queryKey: ["/api/section-settings"],
  });

  const toggleMutation = useMutation({
    mutationFn: async (visible: boolean) => {
      const res = await apiRequest("PUT", `/api/section-settings/${sectionKey}`, { visible });
      return res.json();
    },
    onSuccess: (_, visible) => {
      queryClient.invalidateQueries({ queryKey: ["/api/section-settings"] });
      toast({
        title: visible ? "Section visible" : "Section hidden",
        description: visible
          ? "This section is now visible to visitors."
          : "This section is now hidden from visitors.",
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update visibility.", variant: "destructive" });
    },
  });

  const setting = settings.find(s => s.section === sectionKey);
  const isVisible = setting?.visible ?? true;

  // Visitors: hide completely when not visible
  if (!user && !isVisible) return null;

  // Visitors: render normally
  if (!user) return <>{children}</>;

  // Admin view: show admin bar above section
  return (
    <div className="relative">
      {/* Admin control bar */}
      <div className="flex items-center justify-end gap-2 px-4 py-1.5 bg-muted/60 border-b border-dashed border-border/60">
        <span className="text-xs text-muted-foreground mr-auto font-mono">
          {sectionKey}
        </span>

        <Button
          variant="ghost"
          size="sm"
          className={`h-7 gap-1.5 text-xs ${isVisible ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          onClick={() => toggleMutation.mutate(!isVisible)}
          disabled={toggleMutation.isPending}
        >
          {isVisible ? (
            <><Eye className="h-3.5 w-3.5" /> Visible</>
          ) : (
            <><EyeOff className="h-3.5 w-3.5" /> Hidden</>
          )}
        </Button>

        {adminTab && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => setLocation(`/admin?tab=${adminTab}`)}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}
      </div>

      {/* Section content, dimmed when hidden */}
      <div className={isVisible ? "" : "opacity-50 pointer-events-none select-none"}>
        {children}
      </div>
    </div>
  );
}
