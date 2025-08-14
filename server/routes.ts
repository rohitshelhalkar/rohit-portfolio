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
Email: rohitshelhalkar17@gmail.com | Phone: +91-9657066980 | Location: Pune, India

PROFESSIONAL SUMMARY
Technical Lead with 10+ years of experience in healthcare technology, specializing in full-stack development and team leadership. Expert in architecting cloud-native platforms using React.js, NestJS, Node.js, and BigQuery. Proven track record of delivering scalable, compliant, and user-centric healthcare tech solutions while driving cross-functional alignment and improving sprint velocity.

CORE EXPERIENCE

FOLDHEALTH - Lead Software Engineer (Nov 2021 - Present)
• Led end-to-end development of healthcare CRM platform with team of 5+ engineers
• Architected scalable modules using React, NestJS, and GraphQL, boosting user engagement by 50%
• Built comprehensive CRM with membership management and Stripe payment integration
• Developed omnichannel communication engine supporting secure in-app messaging, email (Gmail/Outlook), and SMS (Twilio)
• Created dynamic reporting engine with Power BI and BigQuery integration for advanced analytics
• Implemented scalable JWT authentication system with rotational keys for enhanced security
• Integrated AI tools (ChatGPT, Claude, Gemini) reducing repetitive tasks by 30%

ATHENAHEALTH - Senior Member of Technical Staff (Jun 2017 - Oct 2021)
• Developed medical imaging viewer for real-time diagnostic scan access and review
• Built internal configuration management system for microservices and frontend applications
• Created secure provider communication platform with real-time messaging capabilities
• Designed unified health record views aggregating data from multiple systems with reconciliation workflows
• Implemented secure JWT authentication with rotational keys for critical applications
• Led frontend development of OneChart module for unified patient records across platforms

PRAXIFY - Web Developer (Jun 2014 - Oct 2017)
• Built multi-tenant healthcare applications with patient records and encounter workflow modules
• Improved frontend rendering performance by 40% through modular jQuery approach
• Introduced feature rollout toggles enabling controlled deployment across different customers
• Contributed to patient encounter workflows handling 10,000+ daily transactions
• Participated in company-wide hackathons for innovative deployment strategies

TECHNICAL EXPERTISE
Frontend: React.js, TypeScript, Angular, Vue.js, jQuery, JavaScript
Backend: Node.js, NestJS, Java (Servlets, JSF), GraphQL, Spring Boot, Vert.x
Databases: PostgreSQL, Redis, MySQL, BigQuery
Healthcare: Medical imaging (DICOM), EHR systems, HIPAA compliance, Clinical workflows
Cloud & Tools: Hasura, WebSockets, Stripe, Twilio, Power BI, Cube.js, Maven
Authentication: JWT with rotational keys, OAuth2, Multi-factor authentication
Leadership: Team management, System architecture, Agile/Scrum methodologies, Mentoring

EDUCATION
Master of Computer Applications (MCA) - Pune University, 2014
Bachelor of Computer Applications (BCA) - Pune University, 2010

KEY ACHIEVEMENTS
• 50% increase in user engagement through CRM platform optimization
• 70% reduction in production bugs via structured code review processes
• 30% improvement in team efficiency through Agile practices adoption
• Zero security incidents since implementing JWT authentication systems
• Served 50+ healthcare organizations with scalable technology solutions
      `.trim();

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="Rohit_Shelhalkar_Resume.txt"');
      res.send(resumeData);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
