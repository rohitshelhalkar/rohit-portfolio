import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json({ success: true, contact });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Invalid contact data" 
      });
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch contacts" 
      });
    }
  });

  // Resume download endpoint
  app.get("/api/download-resume", (req, res) => {
    // In a real application, you would serve the actual resume file
    // For now, we'll create a simple response
    const resumeData = `
ROHIT SHELHALKAR
Healthcare Technology Leader

EXPERIENCE:
• Lead Software Engineer at Fold Health (Nov 2021 - Present)
• Senior Member of Technical Staff at Athenahealth (Jun 2017 - Oct 2021)
• Web Developer at Praxify (Jun 2014 - Oct 2017)

SKILLS:
• React.js, TypeScript, Node.js, Nest.js, GraphQL
• Healthcare Domain Expertise
• Team Leadership & Agile Methodologies

CONTACT:
Email: rohitshelhalkar17@gmail.com
Phone: +91-9657066980
Location: Pune, India
    `.trim();

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="Rohit_Shelhalkar_Resume.txt"');
    res.send(resumeData);
  });

  const httpServer = createServer(app);
  return httpServer;
}
