import type { ParsedResume } from '../types';

// PDF parsing: use pdf-parse (node) or pdfjs-dist (browser)
// DOCX parsing: use docx (node) or mammoth (browser)
// This is a mock implementation for browser/Next.js

export async function parseResume(file: File): Promise<ParsedResume> {
  const text = await file.text();
  // Extract Name, Email, Phone using regex
  let name = '';
  let email = '';
  let phone = '';
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // Name: first line with two words, not email/phone
  for (const line of lines.slice(0, 10)) {
    if (/^[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+/.test(line) && !line.includes('@')) {
      name = line;
      break;
    }
  }
  // Email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  for (const line of lines) {
    const match = line.match(emailRegex);
    if (match) { email = match[0]; break; }
  }
  // Phone
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?(\(?\d{3,4}\)?[-.\s]?){2,3}\d{3,4}/;
  for (const line of lines) {
    const match = line.match(phoneRegex);
    if (match) { phone = match[0]; break; }
  }
  // Missing fields
  const missingFields: string[] = [];
  if (!name) missingFields.push('name');
  if (!email) missingFields.push('email');
  if (!phone) missingFields.push('phone');

  return {
    name,
    email,
    phone,
    text,
    isValid: missingFields.length === 0,
    missingFields,
  };
}
