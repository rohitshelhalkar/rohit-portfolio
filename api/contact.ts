import type { VercelRequest, VercelResponse } from '@vercel/node';

// ntfy.sh topic for push notifications
const NTFY_TOPIC = process.env.NTFY_TOPIC || "rohit-portfolio-contact-2026";

// Resend API key for email notifications
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "rohitshelhalkar17@gmail.com";

// Send push notification via ntfy.sh
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

// Send email notification via Resend
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, subject, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const contact = { firstName, lastName, email, subject, message };

    // Send notifications (non-blocking)
    await Promise.all([
      sendPushNotification(contact).catch(console.error),
      sendEmailNotification(contact).catch(console.error)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
}
