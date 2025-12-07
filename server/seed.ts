import { db } from "./db";
import { knowledgeEntries, blogPosts } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  const existingKnowledge = await db.select().from(knowledgeEntries);
  if (existingKnowledge.length === 0) {
    await db.insert(knowledgeEntries).values([
      {
        title: "Attention Mechanisms in Transformers",
        content: "Today I explored multi-head attention and how it enables transformers to focus on different parts of the input sequence simultaneously. Key insight: the scaled dot-product attention prevents gradients from vanishing in deep networks.",
        tags: ["Deep Learning", "Transformers", "NLP"],
        date: new Date("2025-12-07"),
      },
      {
        title: "ONNX Runtime Optimization",
        content: "Learned about graph optimization levels in ONNX Runtime. Level 99 enables all optimizations including constant folding, redundant node elimination, and operator fusion for faster inference.",
        tags: ["MLOps", "Optimization", "Deployment"],
        date: new Date("2025-12-06"),
      },
      {
        title: "Few-Shot Prompting Strategies",
        content: "Experimented with chain-of-thought prompting for complex reasoning tasks. Adding step-by-step examples significantly improves accuracy on mathematical word problems.",
        tags: ["LLM", "Prompting", "Few-Shot Learning"],
        date: new Date("2025-12-05"),
      },
      {
        title: "Contrastive Learning for Vision",
        content: "Studied SimCLR and how contrastive learning creates meaningful representations without labels. The key is using strong augmentations and large batch sizes for effective negative sampling.",
        tags: ["Computer Vision", "Self-Supervised", "Representation Learning"],
        date: new Date("2025-12-04"),
      },
    ]);
    console.log("Seeded knowledge entries");
  }

  const existingBlogs = await db.select().from(blogPosts);
  if (existingBlogs.length === 0) {
    await db.insert(blogPosts).values([
      {
        title: "Building Production-Ready ML Pipelines",
        excerpt: "A comprehensive guide to designing scalable machine learning systems that handle millions of predictions daily. From feature engineering to model serving.",
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
        tags: ["MLOps", "Engineering"],
        readTime: "8 min read",
        date: new Date("2025-11-28"),
      },
      {
        title: "Vision-Language Models: A Deep Dive",
        excerpt: "Exploring the architecture and training strategies behind modern VLMs. From CLIP to GPT-4V, understanding how these models bridge vision and language.",
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
        tags: ["Computer Vision", "NLP", "Research"],
        readTime: "12 min read",
        date: new Date("2025-11-15"),
      },
      {
        title: "Optimizing BERT for Production",
        excerpt: "Practical techniques for deploying transformer models efficiently. Covering quantization, pruning, knowledge distillation, and runtime optimizations.",
        content: `Deploying BERT models efficiently requires multiple optimization strategies:

**Quantization**

INT8 quantization can reduce model size by 4x with minimal accuracy loss. Use dynamic quantization for easy implementation.

**Pruning**

Structured pruning removes entire attention heads or layers. Unstructured pruning offers better compression but requires sparse support.

**Knowledge Distillation**

Train a smaller student model to mimic the larger teacher. DistilBERT achieves 97% of BERT performance at 60% the size.

**Runtime Optimizations**

Use ONNX Runtime or TensorRT for optimized inference. Batch requests when possible.`,
        tags: ["NLP", "Optimization"],
        readTime: "6 min read",
        date: new Date("2025-10-22"),
      },
    ]);
    console.log("Seeded blog posts");
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
