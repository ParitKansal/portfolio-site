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
import { Plus, Pencil, Trash2, ArrowLeft, Loader2 } from "lucide-react";
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

export default function AdminDashboard() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [, setLocation] = useLocation();
    const search = useSearch();
    const [activeTab, setActiveTab] = useState("blog");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Redirect if not logged in
    if (!isAuthLoading && !user) {
        setLocation("/auth");
        return null;
    }

    // --- Blog Management ---
    const { data: blogPosts, isLoading: isBlogLoading } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });
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

    if (isAuthLoading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin" /></div>;

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
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground mr-2">Hello, {user?.username}</span>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="flex flex-wrap h-auto">
                        <TabsTrigger value="blog">Blog</TabsTrigger>
                        <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="certifications">Certifications</TabsTrigger>
                        <TabsTrigger value="resume">Resume</TabsTrigger>
                    </TabsList>

                    <TabsContent value="blog" className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={() => openEditor("blog")}>
                                <Plus className="mr-2 h-4 w-4" /> New Post
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            {blogPosts?.map((post) => (
                                <Card key={post.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-xl font-medium">{post.title}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditor("blog", post)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                                                onClick={() => { if (confirm("Delete?")) deleteMutation.mutate({ id: post.id, type: "blog" }); }}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-2">{formatDate(post.date)} • {post.readTime}</p>
                                        <p className="text-sm line-clamp-2">{post.excerpt}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
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
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

                                    {editingType === "blog" && (
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
