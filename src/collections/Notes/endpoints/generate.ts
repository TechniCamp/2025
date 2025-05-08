import { ollamaClient } from '@/services/ollama'
import { Message } from 'ollama'
import { Endpoint } from 'payload'
import https from 'https'

const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:14b'
const SYSTEM_PROMPT = `
You are an expert AI assistant that creates clean, structured learning content.

Your task is to take user input and optional reference data, and return a clear, expanded version of the note, enriched with accurate details and logical structure.

Only output HTML suitable for direct rendering inside a <div> with Tailwind CSS classes. Do not include code blocks, markdown, comments, or explanation.

Start directly with the HTML content. Do not say anything before or after.

Always use HTML with appropriate Tailwind classes (e.g., <h2>, <ul>, <p>, etc.), and preserve good readability.

Always use dark background.

Make notes readable - not full history, make notes in points and describe them

Add as much information as you can, make notes long and well readable, structured

Also use every information from link that is topic related

If text is in ** text ** make it bold

Bold the most important info, even underscore some

Format text well, use lines to split the important data
enrich with accurate, relevant details from the user’s note and any supplied reference text. Prioritize clarity, completeness, and logical flow.  


`.trim()

function fetchTextFromLink(link: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(link, (res) => {
        let html = ''

        res.on('data', (chunk: Buffer) => {
          html += chunk.toString()
        })

        res.on('end', () => {
          try {
            const text = html
              .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
              .replace(/<\/?[^>]+(>|$)/g, '')
              .replace(/\s+/g, ' ')
              .trim()

            resolve(text)
          } catch (err) {
            reject(err)
          }
        })
      })
      .on('error', (err: Error) => {
        reject(err)
      })
  })
}

async function extractTextsFromLinks(links: string[]): Promise<string[]> {
  const texts = await Promise.all(links.map(fetchTextFromLink))
  return texts
}

export const generateNoteEndpoint: Endpoint = {
  path: '/generate',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await req.json!()
    } catch (error) {
      return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { note, links, status } = body as {
      note: string
      links?: string[]
      status: 'private' | 'public' | 'link-only'
    }

    if (!note || typeof note !== 'string' || note.trim() === '') {
      return Response.json({ error: 'Please provide a valid note' }, { status: 400 })
    }

    const extractedTexts = await extractTextsFromLinks(links || [])
    const linksData = extractedTexts.join(' ')

    const content = `
Expand the following user note into clear and structured learning materials.

Include only important, relevant insights. Use the supporting information provided to add factual detail, but ignore formatting tags, links, and irrelevant data.

User note:
${note}

Supporting information from external sources:
${linksData}

Output only the final content, in valid Markdown. Do not include any tags, explanations, or comments.
Supports Markdown: **bold**, *italic*, # Heading, ## Subheading, - list, 1. numbered list, > quote, \`\`\`code\`\`\`, --- horizontal line

Begin directly with the Markdown content. No preface, no footer. Only the note.

Your mission: 
1 - Make whole note in the same great lookin style
2 - Add as much real informations for current topic as you can, but make it related to prompted subjects
3 - try making each point the same length
    `.trim()

    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content },
    ]

    try {
      const response = await ollamaClient.chat({
        model: OLLAMA_MODEL,
        messages,
        stream: false,
      })

      let extendedNote = (response.message?.content || '')
        .replace(/^<think>[\s\S]*?<\/think>/, '')
        .trim()

      const note = await req.payload.create({
        collection: 'notes',
        data: {
          title: 'Generated Note',
          content: extendedNote,
          author: req.user.id,
          status,
        },
      })

      return Response.json(note)
    } catch (error) {
      console.error('Error processing note:', error)
      return Response.json({ error: 'Failed to process note' }, { status: 500 })
    }
  },
}
