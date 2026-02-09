import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // In Vercel, we'll redirect to the static PDF file
  // The PDF should be in the public folder
  const resumeUrl = '/attached_assets/Rohit_Shelhalkar_Resume.pdf';

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Rohit_Shelhalkar_Resume.pdf"');

  // Redirect to the static file
  res.redirect(307, resumeUrl);
}
