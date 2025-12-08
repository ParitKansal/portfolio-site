import { useState } from "react";
import { type ContentBlock } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Image, FileText, Code, Video, MoveUp, MoveDown } from "lucide-react";

interface ContentEditorProps {
    value: ContentBlock[];
    onChange: (value: ContentBlock[]) => void;
}

export function ContentEditor({ value, onChange }: ContentEditorProps) {
    const addBlock = (type: ContentBlock["type"]) => {
        const newBlock = type === "text"
            ? { type, value: "" }
            : type === "code"
                ? { type, value: "", language: "typescript" }
                : { type, url: "", caption: "" };

        onChange([...value, newBlock as ContentBlock]);
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
        <div className="space-y-4">
            {value.map((block, index) => (
                <Card key={index} className="relative group">
                    <CardContent className="pt-6">
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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

                            {(block.type === "image" || block.type === "video") && (
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
            </div>
        </div>
    );
}
