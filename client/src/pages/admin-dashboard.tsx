import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation, useSearch } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowLeft, Loader2, ExternalLink, Eye, EyeOff, Download, CheckSquare, Square, BookOpen, ChevronUp, ChevronDown as ChevronDownIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentEditor } from "@/components/ContentEditor";
import { useToast } from "@/hooks/use-toast";
import type {
    BlogPost, KnowledgeEntry, ContentBlock,
    Education, Experience, Project, Skill, Certification, Resume
} from "@shared/schema";
import { formatDate } from "@/lib/utils";
import {
    EducationForm, ExperienceForm, ProjectForm, SkillForm, CertificationForm, ResumeForm
} from "@/components/SectionForms";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AdminDashboard() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [, setLocation] = useLocation();
    const search = useSearch();
    const tabFromUrl = new URLSearchParams(search).get("tab");
    const [activeTab, setActiveTab] = useState(tabFromUrl || "blog");

    // Keep tab in sync if URL param changes
    useEffect(() => {
      if (tabFromUrl) setActiveTab(tabFromUrl);
    }, [tabFromUrl]);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // --- Blog Management ---
    const { data: blogPosts, isLoading: isBlogLoading } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });
    const { data: seriesOrder = [] } = useQuery<{ name: string; displayOrder: number }[]>({ queryKey: ["/api/series-order"] });
    const { data: knowledgeEntries, isLoading: isKnowledgeLoading } = useQuery<KnowledgeEntry[]>({ queryKey: ["/api/knowledge"] });
    const { data: educationList, isLoading: isEducationLoading } = useQuery<Education[]>({ queryKey: ["/api/education"] });
    const { data: experienceList, isLoading: isExperienceLoading } = useQuery<Experience[]>({ queryKey: ["/api/experience"] });
    const { data: projectList, isLoading: isProjectLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
    const { data: skillList, isLoading: isSkillLoading } = useQuery<Skill[]>({ queryKey: ["/api/skills"] });
    const { data: certificationList, isLoading: isCertLoading } = useQuery<Certification[]>({ queryKey: ["/api/certifications"] });
    const { data: resumeData, isLoading: isResumeLoading } = useQuery<Resume>({ queryKey: ["/api/resume"] });

    const deleteMutation = useMutation({
        mutationFn: async ({ id, type }: { id: number, type: string }) => {
            const endpoint = type === "blog" ? "/api/blog" :
                type === "knowledge" ? "/api/knowledge" :
                    `/api/${type}`;
            await fetch(`${endpoint}/${id}`, { method: "DELETE" });
        },
        onSuccess: (_, variables) => {
            const queryKey = variables.type === "blog" ? "/api/blog" :
                variables.type === "knowledge" ? "/api/knowledge" :
                    `/api/${variables.type}`;
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            toast({ title: "Item deleted" });
        },
    });

    const toggleVisibilityMutation = useMutation({
        mutationFn: async ({ id, visible }: { id: number; visible: boolean }) => {
            const res = await fetch(`/api/blog/${id}/visibility`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ visible }),
            });
            if (!res.ok) throw new Error("Failed to update visibility");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
        },
    });

    // --- Blog Selection State ---
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedBlogIds, setSelectedBlogIds] = useState<Set<number>>(new Set());

    const toggleSelectMode = () => {
        setIsSelectMode(prev => !prev);
        setSelectedBlogIds(new Set());
    };

    const togglePostSelection = (id: number) => {
        setSelectedBlogIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectAllPosts = () => {
        if (blogPosts) setSelectedBlogIds(new Set(blogPosts.map(p => p.id)));
    };

    const deselectAllPosts = () => setSelectedBlogIds(new Set());

    const downloadSelectedPosts = () => {
        if (!blogPosts || selectedBlogIds.size === 0) return;
        const selected = blogPosts.filter(p => selectedBlogIds.has(p.id));
        const blob = new Blob([JSON.stringify(selected, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `blog-posts-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // --- Editor State ---
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingType, setEditingType] = useState<string>("blog");
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [formData, setFormData] = useState<any>({});

    const resetForm = () => {
        setFormData({});
        setCurrentId(null);
    };

    const openEditor = (type: string, item?: any) => {
        setEditingType(type);
        if (item) {
            setCurrentId(item.id);
            // Deep copy to avoid reference issues
            setFormData(JSON.parse(JSON.stringify(item)));
        } else {
            resetForm();
            // Initialize default arrays for certain types
            if (type === "blog" || type === "knowledge") {
                setFormData({ content: [], tags: [] });
            } else if (type === "experience") {
                setFormData({ projects: [] });
            } else if (type === "skills" || type === "projects") {
                setFormData({ tags: [], skills: [] });
            }
        }
        setIsEditorOpen(true);
    };

    const saveMutation = useMutation({
        mutationFn: async () => {
            const endpoint = editingType === "blog" ? "/api/blog" :
                editingType === "knowledge" ? "/api/knowledge" :
                    `/api/${editingType}`;

            const method = currentId ? "PATCH" : "POST";
            const url = currentId ? `${endpoint}/${currentId}` : endpoint;

            // Prepare data, ensuring tags are an array if provided as string
            const dataToSave = { ...formData };
            if (typeof dataToSave.tags === 'string') {
                dataToSave.tags = (dataToSave.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean);
            }

            // Clean up nested arrays (Experience Projects)
            if (editingType === "experience" && dataToSave.projects) {
                dataToSave.projects = dataToSave.projects.map((p: any) => ({
                    ...p,
                    tags: Array.isArray(p.tags)
                        ? p.tags.map((t: string) => t.trim()).filter(Boolean)
                        : p.tags
                }));
            }

            // Clean up Projects tags
            if (editingType === "projects" && Array.isArray(dataToSave.tags)) {
                dataToSave.tags = dataToSave.tags.map((t: string) => t.trim()).filter(Boolean);
            }

            // Clean up Skills
            if (editingType === "skills" && Array.isArray(dataToSave.skills)) {
                dataToSave.skills = dataToSave.skills.map((t: string) => t.trim()).filter(Boolean);
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSave),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.details ? JSON.stringify(errorData.details) : (errorData.error || "Failed to save"));
            }
            return res.json();
        },
        onSuccess: () => {
            const queryKey = editingType === "blog" ? "/api/blog" :
                editingType === "knowledge" ? "/api/knowledge" :
                    `/api/${editingType}`;
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            toast({ title: "Saved successfully" });
            setIsEditorOpen(false);
            resetForm();
        },
        onError: (error) => {
            console.error("Save error:", error);
            toast({
                title: "Failed to save",
                description: error.message,
                variant: "destructive"
            });
        },
    });

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthLoading && !user) {
            setLocation("/auth");
        }
    }, [user, isAuthLoading, setLocation]);

    if (isAuthLoading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin" /></div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">Hello, {user?.username}</span>
                        <Link href="/image-tool">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Image Utility Tool
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="flex flex-wrap h-auto">
                        <TabsTrigger value="blog">Blog</TabsTrigger>
                        <TabsTrigger value="series">Series</TabsTrigger>
                        <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="certifications">Certifications</TabsTrigger>
                        <TabsTrigger value="resume">Resume</TabsTrigger>
                    </TabsList>

                    <TabsContent value="blog" className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Button variant={isSelectMode ? "secondary" : "outline"} size="sm" onClick={toggleSelectMode}>
                                    {isSelectMode ? <CheckSquare className="mr-2 h-4 w-4" /> : <Square className="mr-2 h-4 w-4" />}
                                    {isSelectMode ? "Cancel" : "Select"}
                                </Button>
                                {isSelectMode && (
                                    <>
                                        <Button variant="ghost" size="sm" onClick={selectAllPosts}>All</Button>
                                        <Button variant="ghost" size="sm" onClick={deselectAllPosts}>None</Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={selectedBlogIds.size === 0}
                                            onClick={downloadSelectedPosts}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download ({selectedBlogIds.size})
                                        </Button>
                                    </>
                                )}
                            </div>
                            <Button onClick={() => openEditor("blog")}>
                                <Plus className="mr-2 h-4 w-4" /> New Post
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            {blogPosts?.map((post) => (
                                <Card
                                    key={post.id}
                                    className={`${post.visible ? "" : "opacity-60"} ${isSelectMode && selectedBlogIds.has(post.id) ? "ring-2 ring-primary" : ""}`}
                                    onClick={isSelectMode ? () => togglePostSelection(post.id) : undefined}
                                    style={isSelectMode ? { cursor: "pointer" } : undefined}
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-xl font-medium flex items-center gap-2">
                                            {isSelectMode && (
                                                <Checkbox
                                                    checked={selectedBlogIds.has(post.id)}
                                                    onCheckedChange={() => togglePostSelection(post.id)}
                                                    onClick={e => e.stopPropagation()}
                                                />
                                            )}
                                            {post.title}
                                            {!post.visible && <span className="text-xs font-normal text-muted-foreground">(hidden)</span>}
                                        </CardTitle>
                                        {!isSelectMode && (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title={post.visible ? "Hide post" : "Show post"}
                                                    onClick={() => toggleVisibilityMutation.mutate({ id: post.id, visible: !post.visible })}
                                                >
                                                    {post.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => openEditor("blog", post)}><Pencil className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                                                    onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: post.id, type: "blog" }); }}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-2">{formatDate(post.date)} • {post.readTime}</p>
                                        <p className="text-sm line-clamp-2">{post.excerpt}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="series" className="space-y-6">
                        {(() => {
                            const seriesMap = new Map<string, BlogPost[]>();
                            (blogPosts || []).filter(p => p.seriesName).forEach(p => {
                                seriesMap.set(p.seriesName!, [...(seriesMap.get(p.seriesName!) || []), p]);
                            });
                            seriesMap.forEach((posts, name) => {
                                seriesMap.set(name, posts.sort((a, b) => {
                                    if (a.seriesOrder != null && b.seriesOrder != null) return a.seriesOrder - b.seriesOrder;
                                    if (a.seriesOrder != null) return -1;
                                    if (b.seriesOrder != null) return 1;
                                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                                }));
                            });

                            if (seriesMap.size === 0) return (
                                <div className="text-center py-16 text-muted-foreground">
                                    <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
                                    <p>No series yet. Create blog posts and assign them a Series Name to get started.</p>
                                </div>
                            );

                            // Sort series entries by displayOrder from the API
                            const orderMap = new Map(seriesOrder.map(s => [s.name, s.displayOrder]));
                            const sortedEntries = Array.from(seriesMap.entries()).sort(([a], [b]) => {
                                const oa = orderMap.get(a) ?? Infinity;
                                const ob = orderMap.get(b) ?? Infinity;
                                return oa - ob;
                            });

                            const reorderSeries = async (entries: [string, BlogPost[]][], fromIdx: number, toIdx: number) => {
                                const reordered = [...entries];
                                [reordered[fromIdx], reordered[toIdx]] = [reordered[toIdx], reordered[fromIdx]];
                                await fetch("/api/series-order", {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(reordered.map(([name], i) => ({ name, displayOrder: i }))),
                                });
                                queryClient.invalidateQueries({ queryKey: ["/api/series-order"] });
                            };

                            return sortedEntries.map(([seriesName, chapters], seriesIdx) => (
                                <Card key={seriesName}>
                                    <CardHeader className="flex flex-row items-center gap-3 pb-3">
                                        <BookOpen className="h-5 w-5 text-primary shrink-0" />
                                        <CardTitle className="text-lg">{seriesName}</CardTitle>
                                        <span className="text-sm text-muted-foreground ml-auto">{chapters.length} chapters</span>
                                        {/* Series-level reorder buttons */}
                                        <div className="flex items-center gap-0.5 ml-2">
                                            <Button
                                                variant="ghost" size="icon"
                                                disabled={seriesIdx === 0}
                                                onClick={() => reorderSeries(sortedEntries, seriesIdx, seriesIdx - 1)}
                                            >
                                                <ChevronUp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost" size="icon"
                                                disabled={seriesIdx === sortedEntries.length - 1}
                                                onClick={() => reorderSeries(sortedEntries, seriesIdx, seriesIdx + 1)}
                                            >
                                                <ChevronDownIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {chapters.map((chapter, idx) => (
                                            <div key={chapter.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{chapter.title}</p>
                                                    <p className="text-xs text-muted-foreground">{formatDate(chapter.date)} · {chapter.readTime}</p>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Button
                                                        variant="ghost" size="icon"
                                                        disabled={idx === 0}
                                                        onClick={async () => {
                                                            const reordered = [...chapters];
                                                            [reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]];
                                                            await Promise.all(reordered.map((c, i) =>
                                                                fetch(`/api/blog/${c.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seriesOrder: i + 1 }) })
                                                            ));
                                                            queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
                                                        }}
                                                    >
                                                        <ChevronUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost" size="icon"
                                                        disabled={idx === chapters.length - 1}
                                                        onClick={async () => {
                                                            const reordered = [...chapters];
                                                            [reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]];
                                                            await Promise.all(reordered.map((c, i) =>
                                                                fetch(`/api/blog/${c.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seriesOrder: i + 1 }) })
                                                            ));
                                                            queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
                                                        }}
                                                    >
                                                        <ChevronDownIcon className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => openEditor("blog", chapter)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ));
                        })()}
                    </TabsContent>

                    <TabsContent value="knowledge" className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={() => openEditor("knowledge")}>
                                <Plus className="mr-2 h-4 w-4" /> New Entry
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            {knowledgeEntries?.map((entry) => (
                                <Card key={entry.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-xl font-medium">{entry.title}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditor("knowledge", entry)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                                                onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: entry.id, type: "knowledge" }); }}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-2">{formatDate(entry.date)}</p>
                                        <div className="flex gap-2">{(entry.tags || []).map(tag => <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-md">{tag}</span>)}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="education" className="space-y-4">
                        <div className="flex justify-end"><Button onClick={() => openEditor("education")}><Plus className="mr-2 h-4 w-4" /> Add Education</Button></div>
                        <div className="grid gap-4">
                            {educationList?.map(item => (
                                <Card key={item.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-lg font-medium">{item.institution}</CardTitle>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditor("education", item)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id, type: "education" }) }}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent><p>{item.degree}</p><p className="text-sm text-muted-foreground">{item.date}</p></CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="experience" className="space-y-4">
                        <div className="flex justify-end"><Button onClick={() => openEditor("experience")}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button></div>
                        <div className="grid gap-4">
                            {experienceList?.map(item => (
                                <Card key={item.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-lg font-medium">{item.company}</CardTitle>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditor("experience", item)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id, type: "experience" }) }}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent><p>{item.role}</p><p className="text-sm text-muted-foreground">{item.period}</p></CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="projects" className="space-y-4">
                        <div className="flex justify-end"><Button onClick={() => openEditor("projects")}><Plus className="mr-2 h-4 w-4" /> Add Project</Button></div>
                        <div className="grid gap-4">
                            {projectList?.map(item => (
                                <Card key={item.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditor("projects", item)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id, type: "projects" }) }}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent><p className="text-sm">{item.description}</p><div className="flex gap-2 mt-2">{item.tags?.map(t => <span key={t} className="text-xs bg-muted px-1 rounded">{t}</span>)}</div></CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="skills" className="space-y-4">
                        <div className="flex justify-end"><Button onClick={() => openEditor("skills")}><Plus className="mr-2 h-4 w-4" /> Add Skill Category</Button></div>
                        <div className="grid gap-4">
                            {skillList?.map(item => (
                                <Card key={item.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-lg font-medium">{item.category}</CardTitle>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditor("skills", item)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id, type: "skills" }) }}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent><div className="flex gap-2 flex-wrap">{item.skills?.map(s => <span key={s} className="text-xs bg-muted px-1 rounded">{s}</span>)}</div></CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="certifications" className="space-y-4">
                        <div className="flex justify-end"><Button onClick={() => openEditor("certifications")}><Plus className="mr-2 h-4 w-4" /> Add Certification</Button></div>
                        <div className="grid gap-4">
                            {certificationList?.map(item => (
                                <Card key={item.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditor("certifications", item)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: item.id, type: "certifications" }) }}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent><p>{item.issuer}</p><p className="text-sm text-muted-foreground">{item.date}</p></CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="resume" className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={() => openEditor("resume")}>
                                <Plus className="mr-2 h-4 w-4" /> Update Resume
                            </Button>
                        </div>
                        {resumeData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Current Resume</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{resumeData.filename}</p>
                                            <p className="text-sm text-muted-foreground">{resumeData.url}</p>
                                        </div>
                                        <Button variant="outline" asChild>
                                            <a href={resumeData.url} target="_blank" rel="noopener noreferrer">View</a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Editor Modal */}
                <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                    <DialogContent className="max-w-[90vw] h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {currentId ? "Edit" : "Create"} {editingType === "blog" ? "Blog Post" : "Knowledge Entry"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {(editingType === "blog" || editingType === "knowledge") ? (
                                <>
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" />
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Label>Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !formData.date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {formData.date ? format(new Date(formData.date), "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.date ? new Date(formData.date) : undefined}
                                                    onSelect={(date) => setFormData({ ...formData, date: date })}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {editingType === "blog" && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Excerpt</Label>
                                                    <Textarea value={formData.excerpt || ""} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Short summary" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Read Time</Label>
                                                    <Input value={formData.readTime || ""} onChange={(e) => setFormData({ ...formData, readTime: e.target.value })} placeholder="e.g. 5 min read" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Series Name <span className="text-muted-foreground font-normal">(optional)</span></Label>
                                                    <Input
                                                        value={formData.seriesName || ""}
                                                        onChange={(e) => setFormData({ ...formData, seriesName: e.target.value || null })}
                                                        placeholder="e.g. Building a RAG System"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Part # <span className="text-muted-foreground font-normal">(optional)</span></Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={formData.seriesOrder ?? ""}
                                                        onChange={(e) => setFormData({ ...formData, seriesOrder: e.target.value ? parseInt(e.target.value) : null })}
                                                        placeholder="e.g. 1"
                                                    />
                                                </div>
                                            </div>
                                            {formData.seriesName && (
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="showInBlog"
                                                        checked={formData.showInBlog ?? true}
                                                        onCheckedChange={(checked) => setFormData({ ...formData, showInBlog: !!checked })}
                                                    />
                                                    <Label htmlFor="showInBlog" className="font-normal cursor-pointer">
                                                        Show this chapter in Blog section
                                                    </Label>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Tags (comma separated)</Label>
                                        <Input
                                            value={Array.isArray(formData.tags) ? formData.tags.join(", ") : (formData.tags || "")}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="react, typescript, ui"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Content</Label>
                                        <ContentEditor value={formData.content || []} onChange={(val) => setFormData({ ...formData, content: val })} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {editingType === "education" && <EducationForm value={formData} onChange={(val) => setFormData({ ...formData, ...val })} />}
                                    {editingType === "experience" && <ExperienceForm value={formData} onChange={(val) => setFormData({ ...formData, ...val })} />}
                                    {editingType === "projects" && <ProjectForm value={formData} onChange={(val) => setFormData({ ...formData, ...val })} />}



                                    {editingType === "skills" && <SkillForm value={formData} onChange={(val) => setFormData({ ...formData, ...val })} />}
                                    {editingType === "certifications" && <CertificationForm value={formData} onChange={(val) => setFormData({ ...formData, ...val })} />}
                                    {editingType === "resume" && <ResumeForm value={formData} onChange={(val) => setFormData({ ...formData, ...val })} />}
                                </>
                            )}


                            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="w-full">
                                {saveMutation.isPending ? "Saving..." : "Save Content"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
