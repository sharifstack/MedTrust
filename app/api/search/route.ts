import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const dbPath = path.join(process.cwd(), 'lib', 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an AI search engine for a medical platform called MedTrust.
      The user is searching for: "${query}"

      Here is the database context:
      Doctors: ${JSON.stringify(dbData.doctors.map((d: any) => ({ id: d.id, name: d.name, specialty: d.specialty })))}
      
      Platform Pages:
      - / (Dashboard, Home, Overview)
      - /appointments (Book, Schedule, Calendar, Visits)
      - /search (Find Doctors, Specialists, Directory)
      - /profile (My Account, Settings, Avatar, Picture)

      Analyze the user's intent and provide an array of up to 4 relevant search suggestions in valid JSON format.
      Each suggestion must have:
      - type: "doctor" | "page" | "action"
      - title: The display text
      - subtitle: A helpful description
      - url: The route to navigate to (e.g. "/appointments", "/search", "/profile")
      - icon: A string representing the icon type ("person", "calendar", "settings", "search", "medical", "home")

      Output ONLY the raw JSON array. Do not include markdown formatting or backticks.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/```json/g, '').replace(/```/g, '');
    
    let suggestions = [];
    try {
      suggestions = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini response:", text);
      suggestions = [];
    }

    return NextResponse.json({ results: suggestions });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
