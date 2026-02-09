import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import path from "path";
import fs from "fs";

// ntfy.sh topic for push notifications (change this to your own unique topic)
const NTFY_TOPIC = process.env.NTFY_TOPIC || "rohit-portfolio-contact-2026";

// Resend API key for email notifications (get free key at resend.com)
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "rohitshelhalkar17@gmail.com";

// Send email notification via Resend (3000 free emails/month)
async function sendEmailNotification(contact: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!RESEND_API_KEY) {
    console.log('Resend API key not configured - skipping email notification');
    return;
  }

  try {
    const subjectLabels: Record<string, string> = {
      'job-opportunity': 'Job Opportunity',
      'freelance-project': 'Freelance Project',
      'technical-consultation': 'Technical Consultation',
      'partnership': 'Partnership',
      'general-inquiry': 'General Inquiry'
    };

    const emailSubject = `Portfolio Contact: ${subjectLabels[contact.subject] || 'New Message'} from ${contact.firstName} ${contact.lastName}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Contact Form Submission</h2>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>From:</strong> ${contact.firstName} ${contact.lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
          <p><strong>Subject:</strong> ${subjectLabels[contact.subject] || contact.subject}</p>
        </div>
        <div style="padding: 20px; border-left: 4px solid #2563eb;">
          <h3 style="margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap;">${contact.message}</p>
        </div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          This email was sent from your portfolio contact form.
          <br>Reply directly to this email to respond to ${contact.firstName}.
        </p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [NOTIFICATION_EMAIL],
        reply_to: contact.email,
        subject: emailSubject,
        html: htmlContent,
      }),
    });

    if (response.ok) {
      console.log(`Email notification sent for contact from ${contact.email}`);
    } else {
      const error = await response.text();
      console.error('Failed to send email:', error);
    }
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
}

// Send push notification via ntfy.sh (completely free)
async function sendPushNotification(contact: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const subjectLabels: Record<string, string> = {
      'job-opportunity': 'Job Opportunity',
      'freelance-project': 'Freelance Project',
      'technical-consultation': 'Technical Consultation',
      'partnership': 'Partnership',
      'general-inquiry': 'General Inquiry'
    };

    const subjectTags: Record<string, string> = {
      'job-opportunity': 'briefcase,moneybag',
      'freelance-project': 'rocket',
      'technical-consultation': 'bulb',
      'partnership': 'handshake',
      'general-inquiry': 'envelope'
    };

    const title = `New ${subjectLabels[contact.subject] || 'Message'} from ${contact.firstName}`;
    const body = `From: ${contact.firstName} ${contact.lastName}\nEmail: ${contact.email}\n\nMessage:\n${contact.message}`;

    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: {
        'Title': title,
        'Priority': contact.subject === 'job-opportunity' ? '5' : '3',
        'Tags': subjectTags[contact.subject] || 'envelope',
        'Click': `mailto:${contact.email}`,
      },
      body: body
    });

    console.log(`Push notification sent for contact from ${contact.email}`);
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);

      // Send notifications (non-blocking)
      sendPushNotification(validatedData).catch(console.error);
      sendEmailNotification(validatedData).catch(console.error);

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
    const resumePath = path.join(__dirname, '../attached_assets/Rohit_Shelhalkar_Resume.pdf');
    
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

FOLDHEALTH - Lead Software Engineer (Nov 2021 - Mar 2025)
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
