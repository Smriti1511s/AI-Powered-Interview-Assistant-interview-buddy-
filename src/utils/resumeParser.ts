import { ParsedResume } from '../types';

// PDF parsing using pdfjs-dist (browser friendly)
export const parsePDF = async (file: File): Promise<ParsedResume> => {
  return new Promise(async (resolve) => {
    try {
      console.log('Starting PDF parsing for file:', file.name);
      
      // Convert file to array buffer
      const arrayBuffer = await file.arrayBuffer();
      console.log('File converted to array buffer, size:', arrayBuffer.byteLength);
      
      // Dynamic import of pdfjs-dist
      const pdfjsLib = await import('pdfjs-dist');
      console.log('PDF.js library loaded');
      
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useSystemFonts: true,
        disableFontFace: true
      });
      
      const pdf = await loadingTask.promise;
      console.log('PDF loaded, pages:', pdf.numPages);
      
      let fullText = '';
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`Processing page ${pageNum}`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine all text items
        const pageText = (textContent.items as any[])
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
        console.log(`Page ${pageNum} text length:`, pageText.length);
      }
      
      console.log('PDF parsed successfully, total text length:', fullText.length);
      console.log('First 500 characters:', fullText.substring(0, 500));
      
      // Parse the extracted text
      const parsed = extractResumeData(fullText);
      console.log('Parsed data:', parsed);
      
      resolve(parsed);
      
    } catch (error) {
      console.error('PDF parsing error:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      
      // Final fallback to manual entry
      resolve({
        name: undefined,
        email: undefined,
        phone: undefined,
        text: 'PDF file uploaded - please fill the form manually',
        isValid: false,
        missingFields: ['name', 'email', 'phone'],
      });
    }
  });
};

export const parseDOCX = async (file: File): Promise<ParsedResume> => {
  return new Promise(async (resolve) => {
    try {
      console.log('Starting DOCX parsing for file:', file.name);
      
      // Convert file to array buffer for mammoth
      const arrayBuffer = await file.arrayBuffer();
      
      // Dynamic import of mammoth
      const mammoth = await import('mammoth');
      console.log('mammoth library loaded');
      
      // Parse DOCX
      const result = await mammoth.extractRawText({ arrayBuffer });
      const fullText = result.value;
      
      console.log('DOCX parsed successfully, total text length:', fullText.length);
      console.log('First 500 characters:', fullText.substring(0, 500));
      
      // Parse the extracted text
      const parsed = extractResumeData(fullText);
      console.log('Parsed data:', parsed);
      
      resolve(parsed);
      
    } catch (error) {
      console.error('DOCX parsing error:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      
      // Fallback to manual entry
      resolve({
        name: undefined,
        email: undefined,
        phone: undefined,
        text: 'DOCX file uploaded - please fill the form manually',
        isValid: false,
        missingFields: ['name', 'email', 'phone'],
      });
    }
  });
};

const extractResumeData = (text: string): ParsedResume => {
  console.log('Extracting data from text:', text.substring(0, 200) + '...');
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  console.log('Text lines:', lines.slice(0, 10));
  
  let name = '';
  let email = '';
  let phone = '';
  let score: number | undefined = undefined;
  const missingFields: string[] = [];
  
  // Extract score if present in format 'Score: 85' or 'score: 85'
  const scoreRegex = /score\s*[:-]?\s*(\d{1,3})/i;
  for (const line of lines) {
    const match = line.match(scoreRegex);
    if (match && match[1]) {
      const parsedScore = parseInt(match[1], 10);
      if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 100) {
        score = parsedScore;
        break;
      }
    }
  }
  
  // Extract name - improved logic
  for (const line of lines.slice(0, 15)) { // Check more lines
    // Look for lines that look like names (2-4 words, proper case)
    if (
      /^[A-Z][a-zA-Z]+(\s+[A-Z][a-zA-Z]+){1,3}$/.test(line) &&
      !line.includes('@') &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('cv') &&
      !line.toLowerCase().includes('phone') &&
      !line.toLowerCase().includes('email') &&
      !line.toLowerCase().includes('address') &&
      !line.toLowerCase().includes('experience') &&
      !line.toLowerCase().includes('education') &&
      !line.toLowerCase().includes('skills') &&
      line.length > 3 && line.length < 50
    ) {
      name = line;
      break;
    }
  }
  
  // If no name found, try to extract from first meaningful line
  if (!name && lines.length > 0) {
    for (const line of lines.slice(0, 5)) {
      if (line.length > 3 && line.length < 50 && !line.includes('@') && !line.includes('http')) {
        name = line;
        console.log('Using fallback line as name:', name);
        break;
      }
    }
  }
  
  // Extract email using the specified regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  for (const line of lines) {
    const match = line.match(emailRegex);
    if (match) {
      email = match[0];
      break;
    }
  }
  
  // Extract phone using the specified regex
  const phoneRegex = /\+?\d[\d\s-]{8,15}/;
  for (const line of lines) {
    const match = line.match(phoneRegex);
    if (match) {
      phone = match[0].replace(/\s+/g, ' ').trim();
      break;
    }
  }
  
  // Clean up extracted data
  name = name.trim();
  email = email.trim();
  phone = phone.trim();
  
  // Check for missing fields
  if (!name || name.length < 2) missingFields.push('name');
  if (!email) missingFields.push('email');
  if (!phone) missingFields.push('phone');
  
  console.log('Final extracted data:', { name, email, phone, missingFields });
  
  return {
    name: name || undefined,
    email: email || undefined,
    phone: phone || undefined,
    score,
    text,
    isValid: missingFields.length === 0,
    missingFields,
  };
};

export const validateResumeFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 5MB' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only PDF and DOCX files are allowed' };
  }
  
  return { isValid: true };
};
