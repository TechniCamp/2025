import { NextResponse } from 'next/server';
import { Ollama, Message } from "ollama";

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'https://ollama4.kkhost.pl/';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:8b';

const ollamaClient = new Ollama({
  host: OLLAMA_HOST,
});

const SYSTEM_PROMPT = `
  You are a helpful assistant. Your task is to create scenarios for given learning materials.
  You will be providing a detailed description of learning materials and scenarios for teachers to use in their classes.
  Make your response clear, well-structured, and uses appropriate formatting for html component with tailwind so serewer can put it directly into existing page.tsx.
  Return no more than data in the response, no other text.
  Do not include any explanations or additional comments.
` as const;

export async function POST(request: Request) {
  try {
    const { note } = await request.json();
    
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
        content: `Please create learning materials with additional relevant details:
        "${note}"
        /nothink` 
      }
    ];

    const response = await ollamaClient.chat({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
    });

    let extendedNote = response.message?.content || '';

    console.log('Extended note:', extendedNote);

    const htmlRegex = /```html\s*([\s\S]*?)\s*```/;
    const match = extendedNote.match(htmlRegex);
    
    if (match && match[1]) {
      extendedNote = match[1].trim();
    }

    console.log('Extracted HTML:', extendedNote);

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