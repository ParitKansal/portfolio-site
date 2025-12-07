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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, or } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getKnowledgeEntries(): Promise<KnowledgeEntry[]>;
  getKnowledgeEntry(id: string): Promise<KnowledgeEntry | undefined>;
  createKnowledgeEntry(entry: InsertKnowledgeEntry): Promise<KnowledgeEntry>;
  updateKnowledgeEntry(id: string, entry: Partial<InsertKnowledgeEntry>): Promise<KnowledgeEntry | undefined>;
  deleteKnowledgeEntry(id: string): Promise<boolean>;
  searchKnowledgeEntries(query: string): Promise<KnowledgeEntry[]>;

  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getKnowledgeEntries(): Promise<KnowledgeEntry[]> {
    return db.select().from(knowledgeEntries).orderBy(desc(knowledgeEntries.date));
  }

  async getKnowledgeEntry(id: string): Promise<KnowledgeEntry | undefined> {
    const [entry] = await db.select().from(knowledgeEntries).where(eq(knowledgeEntries.id, id));
    return entry;
  }

  async createKnowledgeEntry(entry: InsertKnowledgeEntry): Promise<KnowledgeEntry> {
    const [created] = await db.insert(knowledgeEntries).values(entry).returning();
    return created;
  }

  async updateKnowledgeEntry(id: string, entry: Partial<InsertKnowledgeEntry>): Promise<KnowledgeEntry | undefined> {
    const [updated] = await db.update(knowledgeEntries).set(entry).where(eq(knowledgeEntries.id, id)).returning();
    return updated;
  }

  async deleteKnowledgeEntry(id: string): Promise<boolean> {
    const result = await db.delete(knowledgeEntries).where(eq(knowledgeEntries.id, id)).returning();
    return result.length > 0;
  }

  async searchKnowledgeEntries(query: string): Promise<KnowledgeEntry[]> {
    return db
      .select()
      .from(knowledgeEntries)
      .where(or(ilike(knowledgeEntries.title, `%${query}%`), ilike(knowledgeEntries.content, `%${query}%`)))
      .orderBy(desc(knowledgeEntries.date));
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(desc(blogPosts.date));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
