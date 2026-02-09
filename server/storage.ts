import { type User, type InsertUser, type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTACTS_FILE = path.join(__dirname, '../data/contacts.json');

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Contact methods
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
}

export class FileStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
    this.ensureDataDirectory();
  }

  private ensureDataDirectory() {
    const dataDir = path.dirname(CONTACTS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(CONTACTS_FILE)) {
      fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2));
    }
  }

  private readContacts(): Contact[] {
    try {
      const data = fs.readFileSync(CONTACTS_FILE, 'utf-8');
      const contacts = JSON.parse(data);
      return contacts.map((c: any) => ({
        ...c,
        createdAt: c.createdAt ? new Date(c.createdAt) : new Date()
      }));
    } catch {
      return [];
    }
  }

  private writeContacts(contacts: Contact[]) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date()
    };

    const contacts = this.readContacts();
    contacts.push(contact);
    this.writeContacts(contacts);

    console.log(`New contact message from ${insertContact.firstName} ${insertContact.lastName} (${insertContact.email})`);

    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return this.readContacts().sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }
}

export const storage = new FileStorage();
