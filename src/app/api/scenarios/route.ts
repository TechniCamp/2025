import { NextResponse } from 'next/server';
import { Message } from "ollama";
import { ollamaClient } from '@/services/ollama';

const SYSTEM_PROMPT = `
You are an expert educational content creator specialized in transforming notes into comprehensive learning materials and teaching scenarios.

Your task is to take the provided note and create a detailed, well-structured learning scenario that a teacher can use in their classroom.

Include the following sections:
1. Learning Objectives - Clear, measurable goals
2. Target Audience - Age/grade level and prerequisites
3. Materials Needed - List of required resources
4. Lesson Structure - Organized timeline with activities
   - Introduction/Hook (5-10 min)
   - Main Activities (25-30 min)
   - Assessment/Reflection (10-15 min)
5. Additional Resources - Optional extensions or references

Format your response as clean HTML with appropriate tags (h1, h2, h3, p, ul, li, etc.) and use Tailwind CSS classes for basic styling.

Do not include any markdown code blocks, explanations about what you're doing, or any text outside the actual learning materials.
` as const;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:14b'

interface RequestBody {
  note: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;
    const { note } = body;
    
    if (!note || typeof note !== 'string' || note.trim() === '') {
      return NextResponse.json(
        { error: 'Please provide a valid note' },
        { status: 400 }
      );
    }

    const messages: Message[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { 
        role: "user", 
        content: `Create a detailed learning scenario based on this note content:
        
        "${note}"
        
        Format your entire response as clean HTML with Tailwind CSS classes that can be directly inserted into a React component. Do not use Markdown formatting or code blocks.` 
      }
    ];

    const response = await ollamaClient.chat({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
    });

    let extendedNote = response.message?.content || '';

    // Clean up the response if it contains code blocks
    const htmlRegex = /```html\s*([\s\S]*?)\s*```/;
    const match = extendedNote.match(htmlRegex);
    
    if (match && match[1]) {
      extendedNote = match[1].trim();
    }
    
    // If the response doesn't contain HTML tags, wrap it in basic HTML
    if (!extendedNote.includes('<')) {
      extendedNote = `<div class="space-y-4">${extendedNote}</div>`;
    }

    if (!extendedNote) {
      return NextResponse.json(
        { error: 'AI did not generate a response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      original: note,
      extended: extendedNote,
    });
  } catch (error) {
    console.error('Error processing note:', error);
    return NextResponse.json(
      { error: 'Failed to process note' },
      { status: 500 }
    );
  }
}