import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { GoogleGenAI } from '@google/genai';
// import { supabase } from '@/lib/supabase';

// ✅ Validate environment variable properly
function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined in environment variables`);
  }
  return value;
}

// ✅ Initialize Gemini safely
const ai = new GoogleGenAI({
  apiKey: getEnv('GEMINI_API_KEY'),
});

export async function POST(request: Request) {
  try {
    const { rawText, cvLink, image } = await request.json();

    // ✅ Input validation
    if (!rawText || !cvLink) {
      return NextResponse.json(
        { error: 'Missing CV text or link' },
        { status: 400 }
      );
    }

    // ✅ Gemini Request
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Analyze the CV text and extract the user's best professional information. 
        Output MUST be a valid JSON object matching exactly this format:
        { 
          "name": "Jane Doe", 
          "role": "Software Engineer", 
          "experience": "3+ Years",
          "education": "B.S. Computer Science",
          "award": "Top Performer 2023",
          "website": "janedoe.com",
          "linkedin": "linkedin.com/in/janedoe",
          "github": "github.com/janedoe",
          "skills": ["React", "Node.js", "Docker", "AWS"],
          "summary": "A highly professional, elegant 2-sentence bio.",
          "featured_project": "Architected a scalable cloud infrastructure handling 10k+ DAU.",
          "email": "jane@example.com",
          "phone": "+1 234 567 8900",
          "location": "New York, NY"
        }
        Rules: 
        1. Keep the role short. 
        2. Extract exactly 4 skills. 
        3. 'award' should be their biggest hackathon win, certification, or honor.
        4. Clean up URLs (remove https://).
        5. Abbreviate degrees for brevity (e.g., "B.Tech CSE" instead of "Bachelor of Technology Computer Science").
        6. If ANY information is missing from the CV, leave that specific string completely empty ("").
        
        CV text:
        ${rawText}
      `,
      config: { responseMimeType: 'application/json' }
    });

    // ✅ Safe JSON parsing
    let cardData;
    try {
      cardData = JSON.parse(response.text || '{}');
    } catch (err) {
      console.error('AI Parse Error:', response.text);
      return NextResponse.json(
        { error: 'AI failed to structure data properly' },
        { status: 500 }
      );
    }

    // ✅ Normalize data safely
    cardData = {
      name: cardData.name || '',
      role: cardData.role || '',
      education: cardData.education || '',
      award: cardData.award || '',
      linkedin: cardData.linkedin || '',
      github: cardData.github || '',
      skills: Array.isArray(cardData.skills)
        ? cardData.skills.slice(0, 4)
        : [],
      summary: cardData.summary || '',
      featured_project: cardData.featured_project || '',
      email: cardData.email || '',
      phone: cardData.phone || '',
      location: cardData.location || '',
    };

    // ✅ Generate QR Code
    const qrCode = await QRCode.toDataURL(cvLink, {
      color: { dark: '#0F172A', light: '#10B981' },
      margin: 2,
    });

    // ✅ Generate slug safely
    const safeName = cardData.name || 'user';
    const slug = `${safeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    return NextResponse.json({
      ...cardData,
      qrCode,
      slug,
      image,
    });

  } catch (error) {
    console.error('Engine Error:', error);
    return NextResponse.json(
      { error: 'Failed to process CV' },
      { status: 500 }
    );
  }
}