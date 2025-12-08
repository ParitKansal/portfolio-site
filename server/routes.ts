import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertKnowledgeEntrySchema,
  insertBlogPostSchema,
  insertMessageSchema,
  insertEducationSchema,
  insertExperienceSchema,
  insertProjectSchema,
  insertSkillSchema,
  insertCertificationSchema,
  insertResumeSchema,
} from "@shared/schema";
import nodemailer from "nodemailer";

const updateKnowledgeEntrySchema = insertKnowledgeEntrySchema.partial();
const updateBlogPostSchema = insertBlogPostSchema.partial();
const updateEducationSchema = insertEducationSchema.partial();
const updateExperienceSchema = insertExperienceSchema.partial();
const updateProjectSchema = insertProjectSchema.partial();
const updateSkillSchema = insertSkillSchema.partial();
const updateCertificationSchema = insertCertificationSchema.partial();

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
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      const entry = await storage.getKnowledgeEntry(id);
      if (!entry) {
        return res.status(404).json({ error: "Knowledge entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge entry" });
    }
  });

  function isAuthenticated(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: "Unauthorized" });
  }

  app.post("/api/knowledge", isAuthenticated, async (req, res) => {
    try {
      const parseResult = insertKnowledgeEntrySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
      }
      const entry = await storage.createKnowledgeEntry(parseResult.data as any);
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to create knowledge entry" });
    }
  });

  app.patch("/api/knowledge/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      const parseResult = updateKnowledgeEntrySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
      }
      const entry = await storage.updateKnowledgeEntry(id, parseResult.data as any);
      if (!entry) {
        return res.status(404).json({ error: "Knowledge entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update knowledge entry" });
    }
  });

  app.delete("/api/knowledge/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      const deleted = await storage.deleteKnowledgeEntry(id);
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
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Blog API routes - Protected
  app.post("/api/blog", isAuthenticated, async (req, res) => {
    try {
      console.log("Received POST /api/blog body:", JSON.stringify(req.body, null, 2));
      const parseResult = insertBlogPostSchema.safeParse(req.body);
      if (!parseResult.success) {
        console.error("Validation failed:", JSON.stringify(parseResult.error, null, 2));
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
      }
      const post = await storage.createBlogPost(parseResult.data as any);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.patch("/api/blog/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      const parseResult = updateBlogPostSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
      }
      const post = await storage.updateBlogPost(id, parseResult.data as any);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });


  app.post("/api/contact", async (req, res) => {
    try {
      const parseResult = insertMessageSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
      }

      const message = await storage.createMessage(parseResult.data);

      // Send email notification
      if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
          subject: `New Portfolio Message from ${message.name}`,
          text: `Name: ${message.name}\nEmail: ${message.email}\n\nMessage:\n${message.message}`,
          html: `
                  <h3>New Contact Form Submission</h3>
                  <p><strong>Name:</strong> ${message.name}</p>
                  <p><strong>Email:</strong> ${message.email}</p>
                  <br>
                  <p><strong>Message:</strong></p>
                  <p>${message.message.replace(/\n/g, "<br>")}</p>
              `,
        });
      }

      res.status(201).json(message);
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Register generic CRUD routes for new entities
  registerEntityRoutes(app, "education", {
    getAll: storage.getEducation.bind(storage),
    create: storage.createEducation.bind(storage),
    update: storage.updateEducation.bind(storage),
    delete: storage.deleteEducation.bind(storage)
  }, insertEducationSchema, updateEducationSchema);

  registerEntityRoutes(app, "experience", {
    getAll: storage.getExperience.bind(storage),
    create: storage.createExperience.bind(storage),
    update: storage.updateExperience.bind(storage),
    delete: storage.deleteExperience.bind(storage)
  }, insertExperienceSchema, updateExperienceSchema);

  registerEntityRoutes(app, "projects", {
    getAll: storage.getProjects.bind(storage),
    create: storage.createProject.bind(storage),
    update: storage.updateProject.bind(storage),
    delete: storage.deleteProject.bind(storage)
  }, insertProjectSchema, updateProjectSchema);

  registerEntityRoutes(app, "skills", {
    getAll: storage.getSkills.bind(storage),
    create: storage.createSkill.bind(storage),
    update: storage.updateSkill.bind(storage),
    delete: storage.deleteSkill.bind(storage)
  }, insertSkillSchema, updateSkillSchema);

  registerEntityRoutes(app, "certifications", {
    getAll: storage.getCertifications.bind(storage),
    create: storage.createCertification.bind(storage),
    update: storage.updateCertification.bind(storage),
    delete: storage.deleteCertification.bind(storage)
  }, insertCertificationSchema, updateCertificationSchema);

  // Resume Routes
  app.get("/api/resume", async (req, res) => {
    try {
      const resume = await storage.getResume();
      res.json(resume || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resume" });
    }
  });

  app.post("/api/resume", isAuthenticated, async (req, res) => {
    try {
      const parseResult = insertResumeSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
      }
      const resume = await storage.createResume(parseResult.data);
      res.status(201).json(resume);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload resume" });
    }
  });

  return httpServer;
}

function registerEntityRoutes(app: Express, entityName: string, storageMethods: any, insertSchema: any, updateSchema: any) {
  const basePath = `/api/${entityName}`;

  app.get(basePath, async (req, res) => {
    try {
      const items = await storageMethods.getAll();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch ${entityName}` });
    }
  });

  app.post(basePath, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    try {
      const parseResult = insertSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
      }
      const item = await storageMethods.create(parseResult.data);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: `Failed to create ${entityName}` });
    }
  });

  app.patch(`${basePath}/:id`, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

      const parseResult = updateSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
      }
      const item = await storageMethods.update(id, parseResult.data);
      if (!item) return res.status(404).json({ error: `${entityName} not found` });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: `Failed to update ${entityName}` });
    }
  });

  app.delete(`${basePath}/:id`, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

      const success = await storageMethods.delete(id);
      if (!success) return res.status(404).json({ error: `${entityName} not found` });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: `Failed to delete ${entityName}` });
    }
  });
}
