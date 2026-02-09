import type { VercelRequest, VercelResponse } from '@vercel/node';

// Environment variables
const NTFY_TOPIC = process.env.NTFY_TOPIC || "rohit-portfolio-contact-2026";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "rohitshelhalkar17@gmail.com";
const HCAPTCHA_SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY;
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
// SECURITY: hCaptcha Verification
// ============================================
async function verifyHcaptcha(token: string, ip: string): Promise<boolean> {
  if (!HCAPTCHA_SECRET_KEY) {
    console.log('hCaptcha not configured - skipping verification');
    return true;
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: HCAPTCHA_SECRET_KEY,
        response: token,
        remoteip: ip
      })
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('hCaptcha verification failed:', error);
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

    const emailSubject = `✨ ${subjectLabels[contact.subject] || 'New Message'} from ${contact.firstName} ${contact.lastName}`;

    const subjectColors: Record<string, { bg: string; text: string; icon: string }> = {
      'job-opportunity': { bg: '#10b981', text: '#ffffff', icon: '💼' },
      'freelance-project': { bg: '#8b5cf6', text: '#ffffff', icon: '🚀' },
      'technical-consultation': { bg: '#f59e0b', text: '#ffffff', icon: '💡' },
      'partnership': { bg: '#3b82f6', text: '#ffffff', icon: '🤝' },
      'general-inquiry': { bg: '#6b7280', text: '#ffffff', icon: '📩' }
    };

    const colors = subjectColors[contact.subject] || subjectColors['general-inquiry'];
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); padding: 40px 40px 30px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                          ${colors.icon} New Portfolio Message
                        </h1>
                        <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                          ${currentDate}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Subject Badge -->
              <tr>
                <td style="padding: 30px 40px 0;">
                  <table role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="background-color: ${colors.bg}; color: ${colors.text}; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                        ${subjectLabels[contact.subject] || 'General Inquiry'}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Contact Card -->
              <tr>
                <td style="padding: 25px 40px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; border: 1px solid #e2e8f0;">
                    <tr>
                      <td style="padding: 25px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="60" valign="top">
                              <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 20px; font-weight: bold; text-align: center; line-height: 50px;">
                                ${contact.firstName.charAt(0).toUpperCase()}${contact.lastName.charAt(0).toUpperCase()}
                              </div>
                            </td>
                            <td style="padding-left: 15px;">
                              <h2 style="margin: 0 0 5px; color: #1e293b; font-size: 20px; font-weight: 600;">
                                ${contact.firstName} ${contact.lastName}
                              </h2>
                              <a href="mailto:${contact.email}" style="color: #2563eb; text-decoration: none; font-size: 14px;">
                                ${contact.email}
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <h3 style="margin: 0 0 15px; color: #374151; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    📝 Message
                  </h3>
                  <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-left: 4px solid #2563eb; border-radius: 8px; padding: 20px;">
                    <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${contact.message}</p>
                  </div>
                </td>
              </tr>

              <!-- Action Button -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="mailto:${contact.email}?subject=Re: ${encodeURIComponent(subjectLabels[contact.subject] || 'Your inquiry')}"
                           style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
                          ✉️ Reply to ${contact.firstName}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 25px 40px; border-top: 1px solid #e5e7eb;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <p style="margin: 0 0 10px; color: #64748b; font-size: 13px;">
                          This message was sent from your portfolio contact form
                        </p>
                        <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                          🔒 Protected by rate limiting & spam detection
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>

            <!-- Brand Footer -->
            <table role="presentation" width="600" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="padding: 30px 20px;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    Rohit Shelhalkar • Healthcare Technology Leader
                    <br>
                    <a href="https://rohit-portfolio-psi.vercel.app" style="color: #6b7280; text-decoration: none;">rohit-portfolio-psi.vercel.app</a>
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
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
      hcaptchaToken,   // hCaptcha token
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
    // SECURITY CHECK 4: hCaptcha Verification
    // ============================================
    if (HCAPTCHA_SECRET_KEY && hcaptchaToken) {
      const isHuman = await verifyHcaptcha(hcaptchaToken, ip);
      if (!isHuman) {
        console.log(`hCaptcha verification failed from IP: ${ip}`);
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
