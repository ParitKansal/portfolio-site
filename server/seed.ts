import { db } from "./db";
import {
  blogPosts, knowledgeEntries, messages, users,
  education, experience, projects, skills, certifications,
  type ContentBlock
} from "@shared/schema";
import { hashPassword } from "./auth";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(blogPosts);
  await db.delete(knowledgeEntries);
  await db.delete(messages);
  await db.delete(users);
  await db.delete(education);
  await db.delete(experience);
  await db.delete(projects);
  await db.delete(skills);
  await db.delete(certifications);

  // Seed Admin User
  const hashedPassword = await hashPassword("admin123");
  await db.insert(users).values({
    username: "admin",
    password: hashedPassword,
  });
  console.log("Admin user seeded: admin / admin123");

  // Seed Blog Posts
  await db.insert(blogPosts).values([
    {
      title: "The Future of Generative AI in Healthcare",
      excerpt: "Exploring how LLMs and diffusion models are transforming medical imaging and drug discovery.",
      content: [
        { type: "text", value: "Generative AI is making waves in healthcare, revolutionizing how we approach diagnosis and treatment." },
        { type: "image", url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop", caption: "AI analyzing medical scans" },
        { type: "text", value: "**Medical Imaging**\nOne of the most promising applications is in medical imaging, where models can detect anomalies with superhuman accuracy." }
      ] as ContentBlock[],
      tags: ["AI", "Healthcare", "Generative Models"],
      readTime: "5 min read",
      date: new Date(),
    },
    {
      title: "Optimizing Transformer Models for Edge Devices",
      excerpt: "Techniques for quantization and pruning to run BERT-like models on mobile devices.",
      content: [
        { type: "text", value: "Running large language models on edge devices involves significant challenges due to limited compute and memory." },
        { type: "code", value: "model = quantize_dynamic(model, {Linear}, dtype=qint8)", language: "python" },
        { type: "text", value: "**Quantization**\nQuantization reduces the precision of the weights, allowing for faster inference and lower power consumption." }
      ] as ContentBlock[],
      tags: ["Edge AI", "Optimization", "Transformers"],
      readTime: "8 min read",
      date: new Date(Date.now() - 86400000 * 5),
    },
  ]);

  // Seed Knowledge Entries
  await db.insert(knowledgeEntries).values([
    {
      title: "LoRA (Low-Rank Adaptation)",
      content: [
        { type: "text", value: "LoRA freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture." },
        { type: "image", url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop", caption: "Neural Network Architecture" }
      ] as ContentBlock[],
      tags: ["Fine-tuning", "LLMs"],
      date: new Date(),
    },
    {
      title: "Vector Databases",
      content: [
        { type: "text", value: "Vector databases allow for efficient similarity search of high-dimensional vectors, essential for RAG (Retrieval-Augmented Generation) applications." },
        { type: "video", url: "https://www.youtube.com/embed/klTvE99TEr8", caption: "Intro to Vector Databases" }
      ] as ContentBlock[],
      tags: ["Database", "RAG"],
      date: new Date(Date.now() - 86400000 * 2),
    },
    {
      title: "Transformer Self-Attention",
      content: [
        { type: "text", value: "The core mechanism of the Transformer architecture is Scaled Dot-Product Attention." },
        { type: "text", value: "$$ Attention(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V $$" },
        { type: "text", value: "Where $Q$ is Query, $K$ is Key, and $V$ is Value matrices." }
      ] as ContentBlock[],
      tags: ["Deep Learning", "Transformers", "Math"],
      date: new Date(Date.now() - 86400000 * 1),
    },
  ]);


  // Seed Education
  await db.insert(education).values([
    {
      institution: "Harcourt Butler Technical University",
      degree: "Bachelor of Technology in Computer Science & Engineering",
      date: "May 2025",
      location: "Kanpur, India",
      score: "CGPA: 8.3/10.0",
    },
    {
      institution: "Dewan Public School",
      degree: "Senior Secondary Education (Class XII)",
      date: "May 2020",
      location: "Hapur, India",
      score: "Percentage: 94%",
    },
    {
      institution: "Dewan Public School",
      degree: "Secondary Education (Class X)",
      date: "May 2018",
      location: "Hapur, India",
      score: "Percentage: 98%",
    },
  ]);

  // Seed Experience
  await db.insert(experience).values([
    {
      company: "Xelpmoc Design and Tech Ltd.",
      role: "Machine Learning Scientist",
      period: "January 2025 – Present",
      location: "Hyderabad, India",
      projects: [
        {
          title: "Live Store Analysis",
          description: "Contributed in building a CCTV-based real-time store monitoring system for a major global fast-food chain, analyzing live RTSP feeds to detect customer entry/exit, staff presence at counters, and triggering alerts when customers wait too long unattended. Implemented automatic detection of unclean tables after customer departure and dustbin cleanliness, generating manager alerts. Deployed using a microservice-based backend for continuous live processing.",
          tags: ["Computer Vision", "RTSP", "Microservices", "Real-time Processing"],
        },
        {
          title: "Intelligent Document Understanding",
          description: "Fine-tuned DONUT for conditional key-value extraction from insurance claims, achieving 98% field-level accuracy. Developed a Gemma-3-4B (4-bit VLM) automated judge to validate predictions against the original document image, reaching 96.67% document-level accuracy. The production pipeline processes 100,000+ documents monthly.",
          tags: ["DONUT", "VLM", "Document AI", "Fine-tuning"],
        },
        {
          title: "Integrated Lead Scoring Model",
          description: "Built an event-level scoring pipeline to predict post-site visit likelihood by integrating WhatsApp, web, and audio interactions. Engineered cumulative behavioral features for each event and trained a ModernBERT model on interaction transitions, using its outputs as features in a final XGBoost model, achieving 83% recall in the top 13% events.",
          tags: ["ModernBERT", "XGBoost", "Feature Engineering", "NLP"],
        },
        {
          title: "Web Visit Scoring",
          description: "Designed an end-to-end scoring pipeline to address a 2+ month feedback delay. Analyzed 8M+ sessions using XGBoost, achieving 88% session-level recall and 90% visitor-level recall.",
          tags: ["XGBoost", "Data Analysis", "ML Pipeline"],
        },
        {
          title: "Multi-Document Detection",
          description: "Developed a synthetic document generation pipeline to train a Mask R-CNN model for multi-document detection, achieving 97.1% AP@[IoU=0.50:0.95].",
          tags: ["Mask R-CNN", "Object Detection", "Synthetic Data"],
        },
      ],
    },
  ]);

  // Seed Projects
  await db.insert(projects).values([
    {
      title: "Comparative Analysis of Recommendation Algorithms",
      date: "June 2024",
      description: "Benchmarked SVD, SVD++, KNN, RBM, and AutoRec models on RMSE, Hit Rate, and Novelty, providing a comprehensive performance comparison.",
      tags: ["Machine Learning", "Recommendation Systems", "Benchmarking"],
      category: "Academic",
    },
    {
      title: "Question Pair Similarity Detection",
      date: "October 2023",
      description: "Developed a duplicate question detection model on the 400K+ Quora dataset using Optuna-based hyperparameter tuning, achieving 83.7% accuracy.",
      tags: ["NLP", "Deep Learning", "Optuna"],
      category: "Academic",
    },
    {
      title: "Few-Shot Layout Detection",
      status: "In Progress",
      description: "Building a few-shot document layout detection model that generalizes layout understanding from a limited set of annotated exemplars. For instance, when a user provides bounding boxes around headings in a few sample images, the model learns the visual and spatial characteristics of those regions and predicts the corresponding heading boundaries in unseen documents.",
      tags: ["Few-Shot Learning", "Document AI", "Computer Vision"],
      category: "Research",
    },
  ]);

  // Seed Skills
  await db.insert(skills).values([
    {
      category: "Programming Languages",
      icon: "Code2",
      skills: ["Python", "C++", "C"],
    },
    {
      category: "Areas of Expertise",
      icon: "Brain",
      skills: ["Data Science", "Machine Learning", "Deep Learning", "Computer Vision", "Natural Language Processing", "Graph Neural Networks", "Few-shot VLM Training"],
    },
    {
      category: "Tools & Technologies",
      icon: "Wrench",
      skills: ["LangChain", "MySQL", "Power BI", "Microsoft Azure", "Large Language Models", "Web Scraping", "CI/CD", "Retrieval-Augmented Generation", "Workflow & Agent", "LangGraph"],
    },
    {
      category: "Frameworks",
      icon: "Layers",
      skills: ["TensorFlow", "PyTorch", "FastAPI"],
    },
  ]);

  // Seed Certifications
  await db.insert(certifications).values([
    {
      name: "TensorFlow: Advanced Techniques",
      issuer: "Coursera & DeepLearning.AI",
      date: "June 2024",
      link: "",
    },
    {
      name: "Machine Learning with Python",
      issuer: "freeCodeCamp",
      date: "April 2024",
      link: "",
    },
  ]);

  console.log("Seeding complete!");
}

seed().catch(console.error);
