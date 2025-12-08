import { type ContentBlock } from "@shared/schema";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface ContentRendererProps {
    content: ContentBlock[];
}

// ... imports

function getEmbedUrl(url: string) {
    try {
        if (!url) return "";
        let videoId = "";

        // Handle youtu.be/ID
        if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split("?")[0];
        }
        // Handle youtube.com/watch?v=ID
        else if (url.includes("youtube.com/watch")) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get("v") || "";
        }
        // Handle already embed URLs
        else if (url.includes("youtube.com/embed/")) {
            return url;
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    } catch (e) {
        return url;
    }
}

export function ContentRenderer({ content }: ContentRendererProps) {
    return (
        <div className="space-y-6">
            {content.map((block, index) => {
                switch (block.type) {
                    // ... text and image cases ...
                    case "text":
                        return (
                            <div key={index} className="prose prose-neutral dark:prose-invert max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {block.value}
                                </ReactMarkdown>
                            </div>
                        );

                    case "image":
                        return (
                            <div key={index} className="rounded-lg overflow-hidden border bg-muted/50">
                                <AspectRatio ratio={16 / 9}>
                                    <img
                                        src={block.url}
                                        alt={block.caption || "Blog content image"}
                                        className="w-full h-full object-cover"
                                    />
                                </AspectRatio>
                                {block.caption && (
                                    <p className="p-3 text-sm text-center text-muted-foreground bg-background/50 backdrop-blur-sm">
                                        {block.caption}
                                    </p>
                                )}
                            </div>
                        );
                    case "video":
                        return (
                            <div key={index} className="rounded-lg overflow-hidden border bg-muted/50">
                                <AspectRatio ratio={16 / 9}>
                                    <iframe
                                        src={getEmbedUrl(block.url)}
                                        title={block.caption || "Video content"}
                                        className="w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                </AspectRatio>
                                {block.caption && (
                                    <p className="p-3 text-sm text-center text-muted-foreground bg-background/50 backdrop-blur-sm">
                                        {block.caption}
                                    </p>
                                )}
                            </div>
                        );
                    // ... rest of the file

                    case "code":
                        return (
                            <div key={index} className="rounded-md bg-muted p-4 overflow-x-auto font-mono text-sm my-4">
                                {block.language && (
                                    <div className="text-xs text-muted-foreground mb-2 select-none uppercase">
                                        {block.language}
                                    </div>
                                )}
                                <pre>
                                    <code>{block.value}</code>
                                </pre>
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}
