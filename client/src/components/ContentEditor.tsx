import { useState } from "react";
import { type ContentBlock } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Image, FileText, Code, Video, MoveUp, MoveDown, Link, Globe, BookOpen, PlayCircle, AppWindow } from "lucide-react";
import { ContentRenderer } from "./ContentRenderer";

const BLOCK_TYPES = [
    { type: "text"  as const, icon: FileText, label: "Text"  },
    { type: "image" as const, icon: Image,    label: "Image" },
    { type: "video" as const, icon: Video,    label: "Video" },
    { type: "code"  as const, icon: Code,     label: "Code"  },
    { type: "pdf"   as const, icon: FileText, label: "PDF"   },
    { type: "link"  as const, icon: Link,      label: "Link"   },
    { type: "iframe" as const, icon: AppWindow, label: "Embed" },
];

function InsertStrip({ onInsert }: { onInsert: (type: ContentBlock["type"]) => void }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="relative flex items-center justify-center h-8 group/strip"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border" />
            {open ? (
                <div className="relative z-10 flex items-center gap-1 bg-background border rounded-full px-2 py-1 shadow-sm">
                    {BLOCK_TYPES.map(({ type, icon: Icon, label }) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => { onInsert(type); setOpen(false); }}
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <Icon className="h-3 w-3" />
                            {label}
                        </button>
                    ))}
                </div>
            ) : (
                <button
                    type="button"
                    className="relative z-10 flex items-center justify-center h-5 w-5 rounded-full bg-background border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                    <Plus className="h-3 w-3" />
                </button>
            )}
        </div>
    );
}

const ICON_OPTIONS = [
    { key: "youtube",  icon: PlayCircle, label: "YouTube" },
    { key: "video",    icon: Video,      label: "Video" },
    { key: "link",     icon: Link,       label: "Link" },
    { key: "globe",    icon: Globe,      label: "Website" },
    { key: "article",  icon: BookOpen,   label: "Article" },
    { key: "document", icon: FileText,   label: "Doc" },
] as const;

interface ContentEditorProps {
    value: ContentBlock[];
    onChange: (value: ContentBlock[]) => void;
}

export function ContentEditor({ value, onChange }: ContentEditorProps) {
    const addBlock = (type: ContentBlock["type"], insertAt?: number) => {
        const newBlock = type === "text"
            ? { type, value: "" }
            : type === "code"
                ? { type, value: "", language: "typescript" }
                : type === "link"
                    ? { type, url: "", caption: "", thumbnail: "" }
                    : type === "iframe"
                        ? { type, url: "", caption: "", height: 500 }
                        : { type, url: "", caption: "" };

        if (insertAt !== undefined) {
            const newBlocks = [...value];
            newBlocks.splice(insertAt, 0, newBlock as ContentBlock);
            onChange(newBlocks);
        } else {
            onChange([...value, newBlock as ContentBlock]);
        }
    };

    const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
        const newBlocks = [...value];
        newBlocks[index] = { ...newBlocks[index], ...updates } as ContentBlock;
        onChange(newBlocks);
    };

    const removeBlock = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const moveBlock = (index: number, direction: "up" | "down") => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === value.length - 1)
        ) {
            return;
        }

        const newBlocks = [...value];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        onChange(newBlocks);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Editor Partition */}
            <div className="space-y-4 order-2 lg:order-1">
                <div className="flex items-center justify-between pb-2 border-b">
                    <h3 className="text-lg font-semibold">Editor</h3>
                </div>
                {value.map((block, index) => (
                    <div key={index}>
                    <InsertStrip onInsert={(type) => addBlock(type, index)} />
                    <Card className="relative group">
                        <CardContent className="pt-6">
                            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveBlock(index, "up")}
                                    disabled={index === 0}
                                >
                                    <MoveUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveBlock(index, "down")}
                                    disabled={index === value.length - 1}
                                >
                                    <MoveDown className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeBlock(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid gap-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {block.type === "text" && <FileText className="h-4 w-4 text-muted-foreground" />}
                                    {block.type === "image" && <Image className="h-4 w-4 text-muted-foreground" />}
                                    {block.type === "video" && <Video className="h-4 w-4 text-muted-foreground" />}
                                    {block.type === "code" && <Code className="h-4 w-4 text-muted-foreground" />}
                                    {block.type === "link" && <Link className="h-4 w-4 text-muted-foreground" />}
                                    {block.type === "iframe" && <AppWindow className="h-4 w-4 text-muted-foreground" />}
                                    <span className="text-sm font-medium capitalize">{block.type} Block</span>
                                </div>

                                {block.type === "text" && (
                                    <Textarea
                                        placeholder="Enter text content (Markdown supported)..."
                                        value={block.value}
                                        onChange={(e) => updateBlock(index, { value: e.target.value })}
                                        className="min-h-[150px]"
                                    />
                                )}

                                {block.type === "link" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>URL</Label>
                                            <Input
                                                placeholder="Enter link URL..."
                                                value={block.url}
                                                onChange={(e) => updateBlock(index, { url: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Title (Optional)</Label>
                                            <Input
                                                placeholder="Enter link title..."
                                                value={block.caption || ""}
                                                onChange={(e) => updateBlock(index, { caption: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Thumbnail Image URL (Optional)</Label>
                                            <Input
                                                placeholder="Enter thumbnail image URL..."
                                                value={block.thumbnail || ""}
                                                onChange={(e) => updateBlock(index, { thumbnail: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Icon (Optional)</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {ICON_OPTIONS.map(({ key, icon: Icon, label }) => {
                                                    const selected = block.icon === key;
                                                    return (
                                                        <button
                                                            key={key}
                                                            type="button"
                                                            onClick={() => updateBlock(index, { icon: selected ? undefined : key })}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selected ? "bg-foreground text-background border-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
                                                        >
                                                            <Icon className="h-3.5 w-3.5" />
                                                            {label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {block.type === "iframe" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>URL</Label>
                                            <Input
                                                placeholder="e.g. https://paritkansal.github.io/interactive/file.html"
                                                value={block.url}
                                                onChange={(e) => updateBlock(index, { url: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Caption (Optional)</Label>
                                            <Input
                                                placeholder="Enter caption..."
                                                value={block.caption || ""}
                                                onChange={(e) => updateBlock(index, { caption: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Height px (default 500)</Label>
                                            <Input
                                                type="number"
                                                min={200}
                                                max={2000}
                                                placeholder="500"
                                                value={block.height ?? ""}
                                                onChange={(e) => updateBlock(index, {
                                                    height: e.target.value ? Number(e.target.value) : undefined
                                                })}
                                            />
                                        </div>
                                    </>
                                )}

                                {(block.type === "image" || block.type === "video" || block.type === "pdf") && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>URL</Label>
                                            <Input
                                                placeholder={`Enter ${block.type} URL...`}
                                                value={block.url}
                                                onChange={(e) => updateBlock(index, { url: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Caption (Optional)</Label>
                                            <Input
                                                placeholder="Enter caption..."
                                                value={block.caption || ""}
                                                onChange={(e) => updateBlock(index, { caption: e.target.value })}
                                            />
                                        </div>
                                        {block.type === "image" && (
                                            <div className="space-y-2">
                                                <Label>Width % (Optional, default 100%)</Label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={100}
                                                    placeholder="100"
                                                    value={block.width ?? ""}
                                                    onChange={(e) => updateBlock(index, {
                                                        width: e.target.value ? Math.min(100, Math.max(1, Number(e.target.value))) : undefined
                                                    })}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {block.type === "code" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Language</Label>
                                            <Input
                                                placeholder="typescript, python, etc."
                                                value={block.language || ""}
                                                onChange={(e) => updateBlock(index, { language: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Code</Label>
                                            <Textarea
                                                placeholder="Enter code..."
                                                value={block.value}
                                                onChange={(e) => updateBlock(index, { value: e.target.value })}
                                                className="font-mono min-h-[150px]"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    </div>
                ))}

                <div className="flex flex-wrap gap-2 justify-center p-4 border rounded-lg border-dashed">
                    <Button variant="outline" onClick={() => addBlock("text")}>
                        <FileText className="mr-2 h-4 w-4" />
                        Add Text
                    </Button>
                    <Button variant="outline" onClick={() => addBlock("image")}>
                        <Image className="mr-2 h-4 w-4" />
                        Add Image
                    </Button>
                    <Button variant="outline" onClick={() => addBlock("video")}>
                        <Video className="mr-2 h-4 w-4" />
                        Add Video
                    </Button>
                    <Button variant="outline" onClick={() => addBlock("code")}>
                        <Code className="mr-2 h-4 w-4" />
                        Add Code
                    </Button>
                    <Button variant="outline" onClick={() => addBlock("pdf")}>
                        <FileText className="mr-2 h-4 w-4" />
                        Add PDF
                    </Button>
                    <Button variant="outline" onClick={() => addBlock("link")}>
                        <Link className="mr-2 h-4 w-4" />
                        Add Link
                    </Button>
                    <Button variant="outline" onClick={() => addBlock("iframe")}>
                        <AppWindow className="mr-2 h-4 w-4" />
                        Add Embed
                    </Button>
                </div>
            </div>

            {/* Preview Partition */}
            <div className="space-y-4 order-1 lg:order-2 border-l pl-0 lg:pl-6">
                <div className="flex items-center justify-between pb-2 border-b sticky top-0 bg-background z-10">
                    <h3 className="text-lg font-semibold">Preview</h3>
                </div>
                <div className="h-full overflow-y-auto pr-2">
                    <ContentRenderer content={value} />
                </div>
            </div>
        </div>
    );
}
