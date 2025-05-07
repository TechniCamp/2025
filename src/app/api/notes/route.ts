import { NextResponse } from 'next/server';
import { Ollama, Message } from "ollama";
import https from 'https';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'https://ollama4.kkhost.pl/';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:8b';

const ollamaClient = new Ollama({ host: OLLAMA_HOST });

const SYSTEM_PROMPT = `
You are an expert AI assistant that creates clean, structured learning content.

Your task is to take user input and optional reference data, and return a clear, expanded version of the note, enriched with accurate details and logical structure.

Only output HTML suitable for direct rendering inside a <div> with Tailwind CSS classes. Do not include code blocks, markdown, comments, or explanation.

Start directly with the HTML content. Do not say anything before or after.

Always use HTML with appropriate Tailwind classes (e.g., <h2>, <ul>, <p>, etc.), and preserve good readability.
`.trim();


function fetchTextFromLink(link: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(link, (res) => {
      
      let html = '';

      res.on('data', (chunk: Buffer) => {
        html += chunk.toString();
      });

      res.on('end', () => {
        try {
          const text = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<\/?[^>]+(>|$)/g, '')
            .replace(/\s+/g, ' ')
            .trim();

          resolve(text);
        } catch (err) {
          reject(err);
        }
      });

    }).on('error', (err: Error) => {
      reject(err);
    });
  });
}

async function extractTextsFromLinks(links: string): Promise<string[]> {
  const linkList = typeof links === 'string'
    ? links.split('\n').map(l => l.trim()).filter(Boolean)
    : [];

  // Promise.all zwraca Promise<string[]>
  const texts = await Promise.all(linkList.map(fetchTextFromLink));
  return texts;  
}


export async function POST(request: Request) {
  try {
    const { note, links } = await request.json();

    if (!note || typeof note !== 'string' || note.trim() === '') {
      return NextResponse.json(
        { error: 'Please provide a valid note' },
        { status: 400 }
      );
    }

    const extractedTexts = await extractTextsFromLinks(links);
    const linksData = extractedTexts.join(' ');
    console.log(linksData)

    const content = `
    Expand the following user note into clear and structured learning materials.
    
    Include only important, relevant insights. Use the supporting information provided to add factual detail, but ignore formatting tags, links, and irrelevant data.
    
    User note:
    ${note}
    
    Supporting information from external sources:
    ${linksData}
    
    Output only the final content, in valid HTML format using Tailwind CSS classes. Do not include any code blocks, markdown, tags, explanations, or comments.
    
    Begin directly with the HTML content. No preface, no footer. Only the note.

    Your mission: 
    1 - Make whole note in the same great lookin style
    2 - Add as much real informations for current topic as you can, but make it related to prompted subjects
    3 - try making each point the same length
    /nothink
    `.trim();
    

    const messages: Message[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content }
    ];

    const response = await ollamaClient.chat({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
    });

    let extendedNote = response.message?.content || '';

    const htmlRegex = /```html\s*([\s\S]*?)\s*```/;
    const match = extendedNote.match(htmlRegex);

    if (match && match[1]) {
      extendedNote = match[1].trim();
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
