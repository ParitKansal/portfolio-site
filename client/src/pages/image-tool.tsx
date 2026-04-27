import { useState, useRef, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, ArrowLeft, RefreshCw, Maximize, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

// This helps center the initial crop
function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

export default function ImageTool() {
    const [imgSrc, setImgSrc] = useState("");
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(4 / 1);
    const [targetWidth, setTargetWidth] = useState<number>(1200);
    const [targetHeight, setTargetHeight] = useState<number>(300);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined); // Reset crop when new image is selected
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                setImgSrc(reader.result?.toString() || ""),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (aspect) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect));
        }
    };

    // Update target height when aspect or width changes
    useEffect(() => {
        if (aspect && targetWidth) {
            setTargetHeight(Math.round(targetWidth / aspect));
        }
    }, [aspect, targetWidth]);

    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    // Update preview canvas whenever crop changes
    useEffect(() => {
        if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return;

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;

        ctx.imageSmoothingQuality = "high";
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height,
        );
    }, [completedCrop]);

    const downloadImage = async () => {
        const image = imgRef.current;
        const previewCanvas = previewCanvasRef.current;
        if (!image || !completedCrop || !previewCanvas) return;

        // Create a final canvas for resizing to target dimensions
        const finalCanvas = document.createElement("canvas");
        const ctx = finalCanvas.getContext("2d");
        if (!ctx) return;

        finalCanvas.width = targetWidth;
        finalCanvas.height = targetHeight;
        ctx.imageSmoothingQuality = "high";

        // Draw the already cropped content from preview canvas to final canvas (resizing it)
        ctx.drawImage(previewCanvas, 0, 0, finalCanvas.width, finalCanvas.height);

        const base64Image = finalCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "cropped-thumbnail.png";
        link.href = base64Image;
        link.click();
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Thumbnail Utility Tool</h1>
                            <p className="text-muted-foreground">Crop and resize images for your portfolio blocks.</p>
                        </div>
                    </div>
                    {imgSrc && (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setImgSrc("")} className="gap-2">
                                <RefreshCw className="h-4 w-4" /> Reset
                            </Button>
                            <Button onClick={downloadImage} disabled={!completedCrop} className="gap-2 bg-primary hover:bg-primary/90">
                                <Download className="h-4 w-4" /> Download Result
                            </Button>
                        </div>
                    )}
                </div>

                {!imgSrc ? (
                    <Card className="border-dashed border-2 flex flex-col items-center justify-center py-20 bg-muted/30">
                        <CardContent className="text-center space-y-4">
                            <div className="h-20 w-20 bg-background rounded-full flex items-center justify-center mx-auto shadow-sm border">
                                <Upload className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">Upload an image</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Select a high-resolution image to crop and resize. 
                                    Works entirely in your browser.
                                </p>
                            </div>
                            <Button asChild>
                                <label className="cursor-pointer">
                                    <Input type="file" className="hidden" accept="image/*" onChange={onSelectFile} />
                                    Choose File
                                </label>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Editor Column */}
                        <div className="lg:col-span-8 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Maximize className="h-5 w-5" />
                                        Crop Selection
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center bg-black/5 rounded-b-lg p-0 overflow-hidden">
                                    <div className="max-w-full overflow-auto p-4">
                                        <ReactCrop
                                            crop={crop}
                                            onChange={(c) => setCrop(c)}
                                            onComplete={(c) => setCompletedCrop(c)}
                                            aspect={aspect}
                                            className="max-h-[60vh]"
                                        >
                                            <img
                                                ref={imgRef}
                                                alt="Crop me"
                                                src={imgSrc}
                                                onLoad={onImageLoad}
                                                className="max-w-full block"
                                            />
                                        </ReactCrop>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Exact Portfolio Preview</CardTitle>
                                    <p className="text-sm text-muted-foreground">This is how it will look inside a Link Block in your portfolio.</p>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Link Block Mockup */}
                                    <div className="max-w-3xl mx-auto">
                                        <div className="rounded-lg overflow-hidden border bg-muted/50 shadow-sm transition-all hover:border-primary/50">
                                            <div className="relative w-full h-48 bg-muted overflow-hidden">
                                                {completedCrop ? (
                                                    <canvas 
                                                        ref={previewCanvasRef}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground italic">
                                                        Select a crop area above
                                                    </div>
                                                )}
                                                <span className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-background/80 text-foreground backdrop-blur-sm border">
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                    Link Preview
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 gap-3 bg-background">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-foreground truncate">My Beautiful Link Title</p>
                                                    <p className="text-sm text-muted-foreground truncate">https://your-portfolio-link.com</p>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Column */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg text-primary">Tool Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <Label>Aspect Ratio</Label>
                                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
                                            <p className="text-sm font-medium text-primary">Locked to 4:1 (Thumbnail)</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                Optimized for your portfolio's Link Block components.
                                            </p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <Label>Target Output Dimensions</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <span className="text-xs text-muted-foreground">Width (px)</span>
                                                <Input 
                                                    type="number" 
                                                    value={targetWidth} 
                                                    onChange={(e) => setTargetWidth(Number(e.target.value))} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-xs text-muted-foreground">Height (px)</span>
                                                <Input 
                                                    type="number" 
                                                    value={targetHeight} 
                                                    readOnly
                                                    className="bg-muted cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic">
                                            Height is automatically calculated to maintain the 4:1 ratio.
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="p-4 bg-muted/50 rounded-lg space-y-2 border border-border/50">
                                        <h4 className="text-sm font-medium">Why use this?</h4>
                                        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                                            <li>Control exactly what's visible in your Link Blocks.</li>
                                            <li>Optimize image file size for faster loading.</li>
                                            <li>Maintain consistent styling across your portfolio.</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
