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
    const resumePath = path.join(__dirname, '../attached_assets/Rohit_Shelhalkar_1755117427760.pdf');
    
    // Check if file exists
    if (fs.existsSync(resumePath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Rohit_Shelhalkar_Resume.pdf"');
      res.sendFile(resumePath);
    } else {
      // Fallback if PDF not found
      const resumeData = `
ROHIT SHELHALKAR
Healthcare Technology Leader

EXPERIENCE:
• Lead Software Engineer at FoldHealth (Nov 2021 - Present)
  - Built Healthcare CRM with Stripe payment integration and omnichannel communication
  - Integrated Power BI, BigQuery for advanced analytics and reporting
  - Implemented JWT authentication with rotational keys

• Senior Member of Technical Staff at AthenaHealth (Jun 2017 - Oct 2021)
  - Developed medical imaging viewer for real-time diagnostic scans
  - Built secure provider communication platform with real-time messaging
  - Created unified health record views with data reconciliation workflows

• Web Developer at Praxify (Jun 2014 - Oct 2017)
  - Built multi-tenant healthcare applications with patient records modules
  - Improved frontend performance with modular jQuery approach
  - Introduced feature rollout toggles for controlled deployment

TECHNICAL SKILLS:
• Frontend: React, TypeScript, Angular, Vue.js, jQuery
• Backend: Node.js, NestJS, Java, GraphQL, PostgreSQL, Redis
• Healthcare: Medical imaging, EHR systems, HIPAA compliance
• Leadership: Team management, system architecture, agile methodologies

CONTACT:
Email: rohitshelhalkar17@gmail.com
Phone: +91-9657066980
Location: Pune, India
      `.trim();

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="Rohit_Shelhalkar_Resume.txt"');
      res.send(resumeData);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
