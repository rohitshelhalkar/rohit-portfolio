import type { VercelRequest, VercelResponse } from '@vercel/node';

// Environment variables
const NTFY_TOPIC = process.env.NTFY_TOPIC || "rohit-portfolio-contact-2026";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "rohitshelhalkar17@gmail.com";
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// ============================================
// SECURITY: Rate Limiting with Upstash Redis
// ============================================
async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    console.log('Rate limiting not configured - allowing request');
    return { allowed: true, remaining: 999, resetIn: 0 };
  }

  const key = `ratelimit:contact:${ip}`;
  const limit = 3; // 3 messages per hour
  const window = 3600; // 1 hour in seconds

  try {
    // Get current count
    const getResponse = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
    });
    const getData = await getResponse.json();
    const currentCount = parseInt(getData.result) || 0;

    if (currentCount >= limit) {
      // Get TTL to know when it resets
      const ttlResponse = await fetch(`${UPSTASH_REDIS_REST_URL}/ttl/${key}`, {
        headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
      });
      const ttlData = await ttlResponse.json();
      return { allowed: false, remaining: 0, resetIn: ttlData.result || window };
    }

    // Increment counter
    await fetch(`${UPSTASH_REDIS_REST_URL}/incr/${key}`, {
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
    });

    // Set expiry if this is first request
    if (currentCount === 0) {
      await fetch(`${UPSTASH_REDIS_REST_URL}/expire/${key}/${window}`, {
        headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
      });
    }

    return { allowed: true, remaining: limit - currentCount - 1, resetIn: window };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true, remaining: 999, resetIn: 0 }; // Fail open
  }
}

// ============================================
// SECURITY: Cloudflare Turnstile Verification
// ============================================
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    console.log('Turnstile not configured - skipping verification');
    return true;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip
      })
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification failed:', error);
    return false;
  }
}

// ============================================
// SECURITY: Spam Detection
// ============================================
function detectSpam(message: string, email: string): { isSpam: boolean; reason: string } {
  // Check for common spam patterns
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|prize|click here|act now|limited time)\b/i,
    /\b(make money|earn \$|free money|bitcoin|crypto investment)\b/i,
    /(http[s]?:\/\/.*){3,}/i, // More than 3 URLs
    /(.)\1{10,}/i, // Same character repeated 10+ times
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(message)) {
      return { isSpam: true, reason: 'Spam pattern detected' };
    }
  }

  // Check message length
  if (message.length < 10) {
    return { isSpam: true, reason: 'Message too short' };
  }

  if (message.length > 5000) {
    return { isSpam: true, reason: 'Message too long' };
  }

  // Check for suspicious email patterns
  const disposableEmailDomains = ['tempmail', 'throwaway', 'mailinator', 'guerrillamail', '10minutemail'];
  if (disposableEmailDomains.some(domain => email.toLowerCase().includes(domain))) {
    return { isSpam: true, reason: 'Disposable email detected' };
  }

  return { isSpam: false, reason: '' };
}

// ============================================
// Send push notification via ntfy.sh
// ============================================
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

// ============================================
// Send email notification via Resend
// ============================================
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

// ============================================
// Main Handler
// ============================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get client IP
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    || req.headers['x-real-ip'] as string
    || 'unknown';

  try {
    const {
      firstName,
      lastName,
      email,
      subject,
      message,
      turnstileToken,  // Cloudflare Turnstile token
      honeypot,        // Honeypot field (should be empty)
      timestamp        // Form load timestamp
    } = req.body;

    // ============================================
    // SECURITY CHECK 1: Honeypot
    // ============================================
    if (honeypot) {
      console.log(`Honeypot triggered from IP: ${ip}`);
      // Return success to fool bots, but don't send
      return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    }

    // ============================================
    // SECURITY CHECK 2: Time-based validation
    // ============================================
    if (timestamp) {
      const formLoadTime = parseInt(timestamp);
      const submissionTime = Date.now();
      const timeDiff = submissionTime - formLoadTime;

      // If form submitted in less than 3 seconds, likely a bot
      if (timeDiff < 3000) {
        console.log(`Form submitted too fast (${timeDiff}ms) from IP: ${ip}`);
        return res.status(400).json({
          success: false,
          message: 'Please take your time filling out the form.'
        });
      }
    }

    // ============================================
    // SECURITY CHECK 3: Rate Limiting
    // ============================================
    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const minutes = Math.ceil(rateLimit.resetIn / 60);
      return res.status(429).json({
        success: false,
        message: `Too many messages. Please try again in ${minutes} minutes.`,
        retryAfter: rateLimit.resetIn
      });
    }

    // ============================================
    // SECURITY CHECK 4: Cloudflare Turnstile
    // ============================================
    if (TURNSTILE_SECRET_KEY && turnstileToken) {
      const isHuman = await verifyTurnstile(turnstileToken, ip);
      if (!isHuman) {
        console.log(`Turnstile verification failed from IP: ${ip}`);
        return res.status(400).json({
          success: false,
          message: 'Security verification failed. Please try again.'
        });
      }
    }

    // ============================================
    // SECURITY CHECK 5: Input Validation
    // ============================================
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // ============================================
    // SECURITY CHECK 6: Spam Detection
    // ============================================
    const spamCheck = detectSpam(message, email);
    if (spamCheck.isSpam) {
      console.log(`Spam detected from IP: ${ip} - ${spamCheck.reason}`);
      return res.status(400).json({
        success: false,
        message: 'Your message could not be sent. Please try again with a different message.'
      });
    }

    // ============================================
    // All checks passed - send notifications
    // ============================================
    const contact = { firstName, lastName, email, subject, message };

    await Promise.all([
      sendPushNotification(contact).catch(console.error),
      sendEmailNotification(contact).catch(console.error)
    ]);

    console.log(`Contact form submitted successfully from ${email} (IP: ${ip})`);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
      remaining: rateLimit.remaining
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
}
