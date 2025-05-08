import { Endpoint } from 'payload'
import { NextResponse } from 'next/server'
import { Message } from "ollama"
import { ollamaClient } from '@/services/ollama'
import { getPayload } from 'payload'
import config from '@payload-config'
import functions from '@/ollama/tools/generatePresentation'

const SYSTEM_PROMPT = `
You are an expert in creating educational presentations from notes.

Your task is to convert the provided note into a series of presentation slides in HTML format.

Create a well-structured presentation with:
1. A title slide
2. An agenda/overview slide
3. Content slides (5-10) that break down the main points
4. A summary/conclusion slide
5. An optional Q&A or discussion points slide

Format your response as clean HTML with appropriate heading tags, lists, and styling.
Use <h1> for slide titles, <h2> for subtitles, and <div class="slide"> to wrap each slide.
Add data-slide-number attributes to each slide div.

Do not include any markdown code blocks or explanations outside the actual presentation content.
` as const;

const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:14b'

interface RequestBody {
  note: string;
}

export const presentationsEndpoint: Endpoint = {
  path: '/presentations',
  method: 'post',
  handler: async (req) => {
    try {
      let body;
      try {
        body = await req.json!();
      } catch (error) {
        return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
      }

      const { note } = body as RequestBody;
      
      if (!note || typeof note !== 'string' || note.trim() === '') {
        return Response.json({ error: 'Please provide a valid note' }, { status: 400 });
      }

      // Find the generatePresentation function
      const generatePresentationFunction = functions.find(
        (tool) => tool.function.name === 'generatePresentation'
      );

      if (!generatePresentationFunction) {
        return Response.json({ error: 'Presentation generation tool not found' }, { status: 500 });
      }

      // Execute the function to generate the presentation
      const result = await generatePresentationFunction.execute({
        data: note,
        outputFile: `presentation_${Date.now()}.pptx`,
        themeBackgroundColor: '#1e293b', // Slate-800 for dark theme
        themeTitleColor: '#ffffff',
        themeBulletColor: '#94a3b8'
      });

      // Get the full media object to return more details
      const payload = await getPayload({ config });
      const mediaFile = await payload.findByID({
        collection: 'media',
        id: result.file
      });

      return Response.json({
        success: true,
        file: result.file,
        fileDetails: mediaFile
      });
    } catch (error) {
      console.error('Error generating presentation:', error);
      return Response.json({ error: 'Failed to generate presentation' }, { status: 500 });
    }
  },
};