import { useState } from "react";
import { PenLine, Clock, ArrowRight, X, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// todo: remove mock functionality - replace with real data from backend
const mockBlogs = [
  {
    id: 1,
    title: "Building Production-Ready ML Pipelines",
    excerpt: "A comprehensive guide to designing scalable machine learning systems that handle millions of predictions daily. From feature engineering to model serving.",
    date: "2025-11-28",
    readTime: "8 min read",
    tags: ["MLOps", "Engineering"],
    content: `Building production-ready ML pipelines requires careful consideration of several factors:

**1. Data Pipeline Architecture**
Your data pipeline should handle both batch and real-time processing. Consider using Apache Kafka for streaming and Apache Spark for batch operations.

**2. Feature Engineering**
Feature stores like Feast or Tecton help maintain consistency between training and serving. Always version your features.

**3. Model Training**
Use experiment tracking tools like MLflow or Weights & Biases. Implement proper cross-validation and hyperparameter tuning.

**4. Model Serving**
Consider latency requirements. For real-time inference, use frameworks like TensorFlow Serving or Triton Inference Server.

**5. Monitoring**
Implement data drift detection and model performance monitoring. Set up alerts for degraded performance.`,
  },
  {
    id: 2,
    title: "Vision-Language Models: A Deep Dive",
    excerpt: "Exploring the architecture and training strategies behind modern VLMs. From CLIP to GPT-4V, understanding how these models bridge vision and language.",
    date: "2025-11-15",
    readTime: "12 min read",
    tags: ["Computer Vision", "NLP", "Research"],
    content: `Vision-Language Models (VLMs) represent one of the most exciting developments in AI:

**The Evolution of VLMs**
From early captioning models to modern multimodal transformers, VLMs have evolved significantly. CLIP (Contrastive Language-Image Pre-training) marked a turning point.

**Architecture Patterns**
Modern VLMs typically use:
- Vision encoders (ViT, ConvNeXt)
- Language models (GPT, LLaMA)
- Cross-attention or projection layers

**Training Strategies**
Contrastive learning remains popular, but instruction tuning and RLHF have become crucial for alignment.

**Applications**
VLMs enable document understanding, visual QA, image generation control, and multimodal reasoning.`,
  },
  {
    id: 3,
    title: "Optimizing BERT for Production",
    excerpt: "Practical techniques for deploying transformer models efficiently. Covering quantization, pruning, knowledge distillation, and runtime optimizations.",
    date: "2025-10-22",
    readTime: "6 min read",
    tags: ["NLP", "Optimization"],
    content: `Deploying BERT models efficiently requires multiple optimization strategies:

**Quantization**
INT8 quantization can reduce model size by 4x with minimal accuracy loss. Use dynamic quantization for easy implementation.

**Pruning**
Structured pruning removes entire attention heads or layers. Unstructured pruning offers better compression but requires sparse support.

**Knowledge Distillation**
Train a smaller student model to mimic the larger teacher. DistilBERT achieves 97% of BERT performance at 60% the size.

**Runtime Optimizations**
Use ONNX Runtime or TensorRT for optimized inference. Batch requests when possible.`,
  },
];

export function BlogSection() {
  const [selectedBlog, setSelectedBlog] = useState<typeof mockBlogs[0] | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (selectedBlog) {
    return (
      <section id="blog" className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            className="mb-8 gap-2"
            onClick={() => setSelectedBlog(null)}
            data-testid="button-back-to-blogs"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Button>

          <article>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {selectedBlog.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {selectedBlog.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              <span>{formatDate(selectedBlog.date)}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {selectedBlog.readTime}
              </span>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {selectedBlog.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h3 key={index} className="text-lg font-semibold mt-6 mb-3">
                      {paragraph.replace(/\*\*/g, "")}
                    </h3>
                  );
                }
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <PenLine className="h-8 w-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-semibold">Blog</h2>
        </div>
        <p className="text-muted-foreground mb-12">
          Occasional deep dives into ML concepts, tutorials, and industry insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="hover-elevate cursor-pointer group"
              onClick={() => setSelectedBlog(blog)}
              data-testid={`card-blog-${blog.id}`}
            >
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-lg leading-snug">{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDate(blog.date)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {blog.readTime}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
