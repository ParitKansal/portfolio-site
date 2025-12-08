import {
  type User,
  type InsertUser,
  type KnowledgeEntry,
  type InsertKnowledgeEntry,
  type BlogPost,
  type InsertBlogPost,
  users,
  knowledgeEntries,
  blogPosts,
  type InsertMessage,
  type Message,
  messages,
  type Education, type InsertEducation, education,
  type Experience, type InsertExperience, experience,
  type Project, type InsertProject, projects,
  type Skill, type InsertSkill, skills,
  type Certification, type InsertCertification, certifications,
  type Resume, type InsertResume, resumes,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  sessionStore: session.Store;

  getKnowledgeEntries(): Promise<KnowledgeEntry[]>;
  getKnowledgeEntry(id: number): Promise<KnowledgeEntry | undefined>;
  createKnowledgeEntry(entry: InsertKnowledgeEntry): Promise<KnowledgeEntry>;
  updateKnowledgeEntry(id: number, entry: Partial<InsertKnowledgeEntry>): Promise<KnowledgeEntry | undefined>;
  deleteKnowledgeEntry(id: number): Promise<boolean>;
  searchKnowledgeEntries(query: string): Promise<KnowledgeEntry[]>;

  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  createMessage(message: InsertMessage): Promise<Message>;

  // Education
  getEducation(): Promise<Education[]>;
  createEducation(edu: InsertEducation): Promise<Education>;
  updateEducation(id: number, edu: Partial<InsertEducation>): Promise<Education | undefined>;
  deleteEducation(id: number): Promise<boolean>;

  // Experience
  getExperience(): Promise<Experience[]>;
  createExperience(exp: InsertExperience): Promise<Experience>;
  updateExperience(id: number, exp: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<boolean>;

  // Projects
  getProjects(): Promise<Project[]>;
  createProject(proj: InsertProject): Promise<Project>;
  updateProject(id: number, proj: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Skills
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;

  // Certifications
  getCertifications(): Promise<Certification[]>;
  createCertification(cert: InsertCertification): Promise<Certification>;
  updateCertification(id: number, cert: Partial<InsertCertification>): Promise<Certification | undefined>;
  deleteCertification(id: number): Promise<boolean>;

  // Resume
  getResume(): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // ... (previous methods remain, skipping for brevity in replacement but they exist in file) ...

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getKnowledgeEntries(): Promise<KnowledgeEntry[]> {
    return db.select().from(knowledgeEntries).orderBy(desc(knowledgeEntries.date));
  }

  async getKnowledgeEntry(id: number): Promise<KnowledgeEntry | undefined> {
    const [entry] = await db.select().from(knowledgeEntries).where(eq(knowledgeEntries.id, id));
    return entry;
  }

  async createKnowledgeEntry(entry: InsertKnowledgeEntry): Promise<KnowledgeEntry> {
    const [newEntry] = await db.insert(knowledgeEntries).values(entry as any).returning();
    return newEntry;
  }

  async updateKnowledgeEntry(id: number, entry: Partial<InsertKnowledgeEntry>): Promise<KnowledgeEntry | undefined> {
    const [updatedEntry] = await db.update(knowledgeEntries).set(entry as any).where(eq(knowledgeEntries.id, id)).returning();
    return updatedEntry;
  }

  async deleteKnowledgeEntry(id: number): Promise<boolean> {
    const result = await db.delete(knowledgeEntries).where(eq(knowledgeEntries.id, id)).returning();
    return result.length > 0;
  }

  async searchKnowledgeEntries(query: string): Promise<KnowledgeEntry[]> {
    return db.select().from(knowledgeEntries).where(or(like(knowledgeEntries.title, `%${query}%`), like(knowledgeEntries.content, `%${query}%`))).orderBy(desc(knowledgeEntries.date));
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(desc(blogPosts.date));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post as any).returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db.update(blogPosts).set(post as any).where(eq(blogPosts.id, id)).returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result.length > 0;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(message).returning();
    return created;
  }

  // Education
  async getEducation(): Promise<Education[]> {
    return db.select().from(education).orderBy(desc(education.id));
  }

  async createEducation(edu: InsertEducation): Promise<Education> {
    const [newEdu] = await db.insert(education).values(edu).returning();
    return newEdu;
  }

  async updateEducation(id: number, edu: Partial<InsertEducation>): Promise<Education | undefined> {
    const [updated] = await db.update(education).set(edu).where(eq(education.id, id)).returning();
    return updated;
  }

  async deleteEducation(id: number): Promise<boolean> {
    const result = await db.delete(education).where(eq(education.id, id)).returning();
    return result.length > 0;
  }

  // Experience
  async getExperience(): Promise<Experience[]> {
    return db.select().from(experience).orderBy(desc(experience.id));
  }

  async createExperience(exp: InsertExperience): Promise<Experience> {
    const [newExp] = await db.insert(experience).values(exp as any).returning();
    return newExp;
  }

  async updateExperience(id: number, exp: Partial<InsertExperience>): Promise<Experience | undefined> {
    const [updated] = await db.update(experience).set(exp as any).where(eq(experience.id, id)).returning();
    return updated;
  }

  async deleteExperience(id: number): Promise<boolean> {
    const result = await db.delete(experience).where(eq(experience.id, id)).returning();
    return result.length > 0;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(desc(projects.id));
  }

  async createProject(proj: InsertProject): Promise<Project> {
    const [newProj] = await db.insert(projects).values(proj as any).returning();
    return newProj;
  }

  async updateProject(id: number, proj: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db.update(projects).set(proj as any).where(eq(projects.id, id)).returning();
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return db.select().from(skills).orderBy(skills.id);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(skill as any).returning();
    return newSkill;
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const [updated] = await db.update(skills).set(skill as any).where(eq(skills.id, id)).returning();
    return updated;
  }

  async deleteSkill(id: number): Promise<boolean> {
    const result = await db.delete(skills).where(eq(skills.id, id)).returning();
    return result.length > 0;
  }

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    return db.select().from(certifications).orderBy(desc(certifications.id));
  }

  async createCertification(cert: InsertCertification): Promise<Certification> {
    const [newCert] = await db.insert(certifications).values(cert).returning();
    return newCert;
  }

  async updateCertification(id: number, cert: Partial<InsertCertification>): Promise<Certification | undefined> {
    const [updated] = await db.update(certifications).set(cert).where(eq(certifications.id, id)).returning();
    return updated;
  }

  async deleteCertification(id: number): Promise<boolean> {
    const result = await db.delete(certifications).where(eq(certifications.id, id)).returning();
    return result.length > 0;
  }

  // Resume
  async getResume(): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).orderBy(desc(resumes.uploadedAt)).limit(1);
    return resume;
  }

  async createResume(resume: InsertResume): Promise<Resume> {
    const [newResume] = await db.insert(resumes).values(resume).returning();
    return newResume;
  }
}

export const storage = new DatabaseStorage();
