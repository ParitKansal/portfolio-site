import { type ContentBlock } from "@shared/schema";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ExternalLink, Video, Link as LinkIcon, Globe, BookOpen, FileText, PlayCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useRef, useState, useEffect } from "react";

const CONTENT_WIDTH = 1200;

function ScaledIframe({ url, height, caption, contentWidth }: { url: string; height: number; caption?: string; contentWidth?: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const effectiveWidth = contentWidth ?? CONTENT_WIDTH;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const obs = new ResizeObserver(([entry]) => {
            setScale(entry.contentRect.width / effectiveWidth);
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, [effectiveWidth]);

    return (
        <div className="rounded-lg overflow-hidden border bg-muted/50">
            <div ref={containerRef} style={{ height: `${height * scale}px`, overflow: "hidden", position: "relative" }}>
                <iframe
                    src={url}
                    title={caption || "Interactive content"}
                    style={{
                        overflow: "hidden",
                        width: `${effectiveWidth}px`,
                        height: `${height}px`,
                        border: "none",
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                    }}
                    allowFullScreen
                />
            </div>
            {caption && (
                <p className="p-3 text-sm text-center text-muted-foreground bg-background/50 backdrop-blur-sm border-t">
                    {caption}
                </p>
            )}
        </div>
    );
}

const LINK_ICONS: Record<string, { component: React.ElementType; label: string }> = {
    youtube:  { component: PlayCircle, label: "YouTube" },
    video:    { component: Video,      label: "Video" },
    link:     { component: LinkIcon,   label: "Link" },
    globe:    { component: Globe,      label: "Website" },
    article:  { component: BookOpen,   label: "Article" },
    document: { component: FileText,   label: "Document" },
};

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

function getPdfEmbedUrl(url: string) {
    try {
        if (!url) return "";

        // Handle Google Drive links
        // Convert /view or /open to /preview
        if (url.includes("drive.google.com")) {
            // Extract ID
            const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
            }
            // If it's already a specialized link (like export=download), finding ID is key or just returning if complex
            // Simple replacement for typical share links
            return url.replace(/\/view.*$/, "/preview").replace(/\/open.*$/, "/preview");
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
                            <div key={index} className="flex justify-center">
                                <div
                                    className="rounded-lg overflow-hidden border bg-muted/50"
                                    style={{ width: block.width ? `${block.width}%` : "100%" }}
                                >
                                    <img
                                        src={block.url}
                                        alt={block.caption || "Blog content image"}
                                        className="w-full h-auto"
                                    />
                                    {block.caption && (
                                        <p className="p-3 text-sm text-center text-muted-foreground bg-background/50 backdrop-blur-sm">
                                            {block.caption}
                                        </p>
                                    )}
                                </div>
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
                    case "pdf":
                        return (
                            <div key={index} className="rounded-lg overflow-hidden border bg-muted/50 h-[600px]">
                                <iframe
                                    src={getPdfEmbedUrl(block.url)}
                                    title={block.caption || "PDF Viewer"}
                                    className="w-full h-full"
                                />
                                {block.caption && (
                                    <p className="p-3 text-sm text-center text-muted-foreground bg-background/50 backdrop-blur-sm border-t">
                                        {block.caption}
                                    </p>
                                )}
                            </div>
                        );
                    // ... rest of the file

                    case "link": {
                        const iconDef = block.icon ? LINK_ICONS[block.icon] : null;
                        const IconComponent = iconDef?.component;
                        return (
                            <a
                                key={index}
                                href={block.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg overflow-hidden border bg-muted/50 hover:bg-muted transition-colors no-underline"
                            >
                                        {block.thumbnail ? (
                                    <div className="relative w-full">
                                        <img
                                            src={block.thumbnail}
                                            alt={block.caption || "Link preview"}
                                            className="w-full h-48 object-cover"
                                        />
                                        {IconComponent && (
                                            <span className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-background/80 text-foreground backdrop-blur-sm border">
                                                <IconComponent className="h-3.5 w-3.5" />
                                                {iconDef.label}
                                            </span>
                                        )}
                                    </div>
                                ) : IconComponent ? (
                                    <div className="flex items-center justify-center h-24 w-full bg-muted">
                                        <IconComponent className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                ) : null}
                                <div className="flex items-center justify-between p-4 gap-3">
                                    <div className="min-w-0">
                                        {block.caption && (
                                            <p className="font-medium text-foreground truncate">{block.caption}</p>
                                        )}
                                        <p className="text-sm text-muted-foreground truncate">{block.url}</p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                                </div>
                            </a>
                        );
                    }

                    case "iframe":
                        return (
                            <ScaledIframe
                                key={index}
                                url={block.url}
                                height={block.height ?? 500}
                                caption={block.caption}
                                contentWidth={block.contentWidth}
                            />
                        );

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
