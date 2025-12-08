
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import type {
    InsertEducation,
    InsertExperience,
    InsertProject,
    InsertSkill,
    InsertCertification,
    InsertResume
} from "@shared/schema";

interface FormProps<T> {
    value: Partial<T>;
    onChange: (val: Partial<T>) => void;
}

export function ResumeForm({ value, onChange }: FormProps<InsertResume>) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Resume URL (PDF Link)</Label>
                <Input
                    value={value.url || ""}
                    onChange={e => onChange({ ...value, url: e.target.value })}
                    placeholder="https://..."
                />
            </div>
            <div className="space-y-2">
                <Label>Filename / Version Name</Label>
                <Input
                    value={value.filename || ""}
                    onChange={e => onChange({ ...value, filename: e.target.value })}
                    placeholder="Resume_v1.pdf"
                />
            </div>
        </div>
    );
}

export function EducationForm({ value, onChange }: FormProps<InsertEducation>) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Institution</Label>
                <Input
                    value={value.institution || ""}
                    onChange={e => onChange({ ...value, institution: e.target.value })}
                    placeholder="University Name"
                />
            </div>
            <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                    value={value.degree || ""}
                    onChange={e => onChange({ ...value, degree: e.target.value })}
                    placeholder="Bachelor of Technology..."
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                        value={value.date || ""}
                        onChange={e => onChange({ ...value, date: e.target.value })}
                        placeholder="May 2025"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Score</Label>
                    <Input
                        value={value.score || ""}
                        onChange={e => onChange({ ...value, score: e.target.value })}
                        placeholder="CGPA: 8.3/10.0"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Location</Label>
                <Input
                    value={value.location || ""}
                    onChange={e => onChange({ ...value, location: e.target.value })}
                    placeholder="City, Country"
                />
            </div>
        </div>
    );
}

export function ExperienceForm({ value, onChange }: FormProps<InsertExperience>) {
    const addProject = () => {
        const projects = value.projects || [];
        onChange({
            ...value,
            projects: [...projects, { title: "", description: "", tags: [] }]
        });
    };

    const updateProject = (index: number, project: any) => {
        const projects = [...(value.projects || [])];
        projects[index] = project;
        onChange({ ...value, projects });
    };

    const removeProject = (index: number) => {
        const projects = (value.projects || []).filter((_, i) => i !== index);
        onChange({ ...value, projects });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Company</Label>
                <Input
                    value={value.company || ""}
                    onChange={e => onChange({ ...value, company: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Role</Label>
                <Input
                    value={value.role || ""}
                    onChange={e => onChange({ ...value, role: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Period</Label>
                    <Input
                        value={value.period || ""}
                        onChange={e => onChange({ ...value, period: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                        value={value.location || ""}
                        onChange={e => onChange({ ...value, location: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Projects / Achievements</Label>
                <div className="space-y-4">
                    {(value.projects || []).map((project, index) => (
                        <div key={index} className="border p-4 rounded-md space-y-3 relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-destructive"
                                onClick={() => removeProject(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={project.title}
                                    onChange={e => updateProject(index, { ...project, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={project.description}
                                    onChange={e => updateProject(index, { ...project, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tags (comma separated)</Label>
                                <Input
                                    onChange={e => updateProject(index, { ...project, tags: e.target.value.split(",") })}
                                />
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addProject}>
                        <Plus className="h-4 w-4 mr-2" /> Add Project
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function ProjectForm({ value, onChange }: FormProps<InsertProject>) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={value.title || ""}
                    onChange={e => onChange({ ...value, title: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                        value={value.category || ""}
                        onChange={e => onChange({ ...value, category: e.target.value })}
                        placeholder="Academic or Research"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Status (Optional)</Label>
                    <Input
                        value={value.status || ""}
                        onChange={e => onChange({ ...value, status: e.target.value })}
                        placeholder="In Progress"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Date</Label>
                <Input
                    value={value.date || ""}
                    onChange={e => onChange({ ...value, date: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={value.description || ""}
                    onChange={e => onChange({ ...value, description: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input
                    value={(value.tags || []).join(",")}
                    onChange={e => onChange({ ...value, tags: e.target.value.split(",") })}
                />
            </div>
        </div>
    );
}

export function SkillForm({ value, onChange }: FormProps<InsertSkill>) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Category</Label>
                <Input
                    value={value.category || ""}
                    onChange={e => onChange({ ...value, category: e.target.value })}
                    placeholder="Programming Languages"
                />
            </div>
            <div className="space-y-2">
                <Label>Icon Name (Lucide React)</Label>
                <Input
                    value={value.icon || ""}
                    onChange={e => onChange({ ...value, icon: e.target.value })}
                    placeholder="Code2"
                />
            </div>
            <div className="space-y-2">
                <Label>Skills (comma separated)</Label>
                <Input
                    value={(value.skills || []).join(",")}
                    onChange={e => onChange({ ...value, skills: e.target.value.split(",") })}
                />
            </div>
        </div>
    );
}

export function CertificationForm({ value, onChange }: FormProps<InsertCertification>) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Name</Label>
                <Input
                    value={value.name || ""}
                    onChange={e => onChange({ ...value, name: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Issuer</Label>
                <Input
                    value={value.issuer || ""}
                    onChange={e => onChange({ ...value, issuer: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                        value={value.date || ""}
                        onChange={e => onChange({ ...value, date: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Link (Optional)</Label>
                    <Input
                        value={value.link || ""}
                        onChange={e => onChange({ ...value, link: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}
