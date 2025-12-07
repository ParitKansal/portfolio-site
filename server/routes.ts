import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertKnowledgeEntrySchema, insertBlogPostSchema } from "@shared/schema";

const updateKnowledgeEntrySchema = insertKnowledgeEntrySchema.partial();
const updateBlogPostSchema = insertBlogPostSchema.partial();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Knowledge Vault API routes
  app.get("/api/knowledge", async (req, res) => {
    try {
      const entries = await storage.getKnowledgeEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge entries" });
    }
  });

  app.get("/api/knowledge/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const entries = await storage.searchKnowledgeEntries(query);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to search knowledge entries" });
    }
  });

  app.get("/api/knowledge/:id", async (req, res) => {
    try {
      const entry = await storage.getKnowledgeEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: "Knowledge entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge entry" });
    }
  });

  app.post("/api/knowledge", async (req, res) => {
    try {
      const parseResult = insertKnowledgeEntrySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
      }
      const entry = await storage.createKnowledgeEntry(parseResult.data);
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to create knowledge entry" });
    }
  });

  app.patch("/api/knowledge/:id", async (req, res) => {
    try {
      const parseResult = updateKnowledgeEntrySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
      }
      const entry = await storage.updateKnowledgeEntry(req.params.id, parseResult.data);
      if (!entry) {
        return res.status(404).json({ error: "Knowledge entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update knowledge entry" });
    }
  });

  app.delete("/api/knowledge/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteKnowledgeEntry(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Knowledge entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete knowledge entry" });
    }
  });

  // Blog API routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const parseResult = insertBlogPostSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
      }
      const post = await storage.createBlogPost(parseResult.data);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.patch("/api/blog/:id", async (req, res) => {
    try {
      const parseResult = updateBlogPostSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
      }
      const post = await storage.updateBlogPost(req.params.id, parseResult.data);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  return httpServer;
}
