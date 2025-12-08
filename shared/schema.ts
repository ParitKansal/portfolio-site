import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password"),
  googleId: text("google_id").unique(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  googleId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type ContentBlock =
  | { type: "text"; value: string }
  | { type: "image"; url: string; caption?: string }
  | { type: "code"; value: string; language?: string }
  | { type: "video"; url: string; caption?: string };

export const knowledgeEntries = sqliteTable("knowledge_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content", { mode: "json" }).$type<ContentBlock[]>().notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  date: integer("date", { mode: "timestamp" }).notNull().default(new Date()),
});

export const insertKnowledgeEntrySchema = createInsertSchema(knowledgeEntries, {
  tags: z.array(z.string()),
  content: z.array(z.object({
    type: z.enum(["text", "image", "code", "video"]),
    value: z.string().optional(),
    url: z.string().optional(),
    caption: z.string().optional(),
    language: z.string().optional(),
  })),
}).omit({
  id: true,
  date: true
});

export type InsertKnowledgeEntry = z.infer<typeof insertKnowledgeEntrySchema>;
export type KnowledgeEntry = typeof knowledgeEntries.$inferSelect;

export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content", { mode: "json" }).$type<ContentBlock[]>().notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  readTime: text("read_time").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull().default(new Date()),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts, {
  tags: z.array(z.string()),
  content: z.array(z.object({
    type: z.enum(["text", "image", "code", "video"]),
    value: z.string().optional(),
    url: z.string().optional(),
    caption: z.string().optional(),
    language: z.string().optional(),
  })),
}).omit({
  id: true,
  date: true
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull().default(new Date()),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  date: true
});


export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export const education = sqliteTable("education", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  score: text("score").notNull(),
});

export const insertEducationSchema = createInsertSchema(education).omit({ id: true });
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof education.$inferSelect;

export const experience = sqliteTable("experience", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company: text("company").notNull(),
  role: text("role").notNull(),
  period: text("period").notNull(),
  location: text("location").notNull(),
  projects: text("projects", { mode: "json" }).$type<{ title: string, description: string, tags: string[] }[]>().notNull(),
});

export const insertExperienceSchema = createInsertSchema(experience, {
  projects: z.array(z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string())
  }))
}).omit({ id: true });
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experience.$inferSelect;

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  date: text("date"),
  description: text("description").notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  category: text("category").notNull(), // "Academic" or "Research"
  status: text("status"), // Optional, e.g. "In Progress"
  link: text("link"),
});

export const insertProjectSchema = createInsertSchema(projects, {
  tags: z.array(z.string())
}).omit({ id: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(), // "Programming Languages", "Tools", etc.
  icon: text("icon").notNull(), // Icon name
  skills: text("skills", { mode: "json" }).$type<string[]>().notNull(),
});

export const insertSkillSchema = createInsertSchema(skills, {
  skills: z.array(z.string())
}).omit({ id: true });
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export const certifications = sqliteTable("certifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  date: text("date").notNull(),
  link: text("link"),
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({ id: true });
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Certification = typeof certifications.$inferSelect;

export const resumes = sqliteTable("resumes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  uploadedAt: integer("uploaded_at", { mode: "timestamp" }).notNull().default(new Date()),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({ id: true, uploadedAt: true });
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;
