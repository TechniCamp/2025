import { consolidateHTMLConverters } from '@payloadcms/richtext-lexical';
import { NextResponse } from 'next/server';
import { Ollama, Message } from "ollama";

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'https://ollama4.kkhost.pl/';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:8b';

const ollamaClient = new Ollama({
  host: OLLAMA_HOST,
});

const SYSTEM_PROMPT = `
You are an assistant that creates flashcards from user-provided notes.

Your task is to:
- Extract all valid flashcard pairs from the note content.
- For each flashcard, generate a "front" (question or prompt) and "back" (answer).
- If the note includes multiple Q&A pairs (e.g. front1/back1, front2/back2, etc.), generate a flashcard for each pair.
- If the note includes a list of facts, definitions, or explanations, break them into useful flashcards.
- Return the flashcards as an array of objects in this format:
  [{ "front": "Question or term", "back": "Answer or explanation", "category" : "Category of note" }, ...]

Be concise but informative. Avoid repeating identical flashcards. Use clear and simple language.

Example note content:
"1. What is a variable? - A container for storing data values.
2. What is a function? - A block of code designed to perform a particular task."

Expected output:
[
   { "front": "What is a variable?", "back": "A container for storing data values.", "category" : "IT" },
  { "front": "What is a function?", "back": "A block of code designed to perform a particular task.", "category" : "IT" }
]
` as const;


export async function POST(request: Request) {

  try {
    const { note_id, user_id } = await request.json();
    
    if (!note_id || typeof note_id !== 'string') {
      return NextResponse.json(
        { error: 'Error in occured while fetching note' },
        { status: 400 }
        
      );
    }



    let note = `World War II Overview

World War II lasted from 1939 to 1945.

It was a global conflict involving most of the world's nations, including the Allies and the Axis powers.

The war began when Germany, led by Adolf Hitler, invaded Poland on September 1, 1939.

Major Axis powers: Germany, Italy, Japan.

Major Allied powers: United Kingdom, Soviet Union, United States, France, and China.

The Holocaust occurred during WWII, where millions of Jews and other minorities were murdered by the Nazis.

The U.S. entered the war after the Japanese attack on Pearl Harbor on December 7, 1941.

The war ended in Europe with Germany’s surrender in May 1945, and in the Pacific after the U.S. dropped atomic bombs on Hiroshima and Nagasaki in August 1945.`;
    const messages: Message[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { 
        role: "user", 
        content: `Please create flashcards materials with this note:
        ${note}
        
        /nothink` 
      }
    ];

    const response = await ollamaClient.chat({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
    });

    let flash_cards = response.message?.content || '';
    const htmlRegex = /```html\s*([\s\S]*?)\s*```/;
    const match = flash_cards.match(htmlRegex);
    if (match && match[1]) {
      flash_cards = match[1].trim();
    }

    if (!flash_cards) {
      return NextResponse.json(
        { error: 'AI did not generate a response' },
        { status: 500 }
      );
    }

    try {
      // Try to extract JSON array from the response string
      const jsonMatch = flash_cards.match(/\[\s*{[\s\S]*}\s*\]/);
      if (!jsonMatch) {
        return NextResponse.json(
          { error: 'Could not extract JSON from AI response' },
          { status: 500 }
        );
      }
    
      const parsed = JSON.parse(jsonMatch[0]);
    
      return NextResponse.json({
        flashcards: parsed,
      });
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Failed to parse flashcards JSON', details: parseError.message },
        { status: 500 }
      );
    }
    
    
  } catch (error) {
    console.log(error)
  }

}