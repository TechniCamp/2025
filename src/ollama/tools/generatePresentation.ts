import { ollamaClient } from '@/services/ollama'
import { ToolFunction } from '../toolsLoader'
import PptxGenJS from 'pptxgenjs'
import { randomUUID } from 'crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'
import fs from 'fs'

const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:14b'

type LayoutType = 'title' | 'bullets' | 'image' | 'comparison'

interface SlideContent {
  layout: LayoutType
  title: string
  bullets?: string[]
  imageUrl?: string
  caption?: string
  leftColumn?: string[]
  rightColumn?: string[]
  backgroundColor?: string
  titleColor?: string
  bulletColor?: string
  captionColor?: string
}

async function generatePresentationContent(data: string): Promise<SlideContent[]> {
  const prompt = `
You are a presentation designer. Given the following data, generate a set of slides with the best layouts and colors.
Add title slide on the first slide, and use the following layouts for each slide:

Each slide should include:
- layout: "title" | "bullets"
- title: string
- relevant content fields based on layout
- backgroundColor (HEX)
- titleColor (HEX)
- other colors (bulletColor, captionColor if needed)

DATA:
${data}

Respond STRICTLY in JSON like this:

[
  {
    "layout": "bullets",
    "title": "Slide Title",
    "bullets": ["First point", "Second point"],
    "backgroundColor": "#FFFFFF",
    "titleColor": "#000000",
    "bulletColor": "#333333"
  }
]

Ensure all HEX codes are valid, layout values are one of [title, bullets, image, comparison].
Do not include any other text or explanation. Only output the JSON array of slides.
`

  const response = await ollamaClient.chat({
    model: OLLAMA_MODEL,
    messages: [{ role: 'user', content: prompt }],
    stream: false,
  })

  try {
    const content: string = response.message.content
    // Try to find valid JSON in the response
    const jsonStart = content.indexOf('[')
    const jsonEnd = content.lastIndexOf(']')

    if (jsonStart < 0 || jsonEnd < 0 || jsonEnd <= jsonStart) {
      console.error('Invalid JSON structure in response:', content)
      throw new Error('Could not find valid JSON array in the response')
    }

    const jsonStr = content.substring(jsonStart, jsonEnd + 1)

    // Clean the JSON string to remove any non-JSON characters
    const cleanJson = jsonStr.replace(/[^\x20-\x7E]/g, '').replace(/\\+([^"])/g, '\\$1')

    try {
      const slides: SlideContent[] = JSON.parse(cleanJson)
      return slides
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'for string:', cleanJson)
      // Fallback to a basic slide if parsing fails
      return [
        {
          layout: 'title',
          title: 'Presentation',
          backgroundColor: '#1e293b',
          titleColor: '#ffffff',
        },
      ]
    }
  } catch (error) {
    console.error('Error processing AI response:', error)
    // Return a fallback slide
    return [
      {
        layout: 'title',
        title: 'Presentation',
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
      },
    ]
  }
}

async function createPpt(
  slides: SlideContent[],
  outputFile: string,
  defaultTheme?: { backgroundColor?: string; titleColor?: string; bulletColor?: string },
) {
  const pptx = new PptxGenJS()

  slides.forEach((slideData) => {
    const slide = pptx.addSlide()
    const bgColor = slideData.backgroundColor ?? defaultTheme?.backgroundColor ?? '#FFFFFF'
    const titleColor = slideData.titleColor ?? defaultTheme?.titleColor ?? '#000000'
    slide.background = { fill: bgColor }

    switch (slideData.layout) {
      case 'title':
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.5,
          y: '40%',
          w: 9,
          h: 1,
          fill: { color: titleColor },
        })
        slide.addText(slideData.title, {
          x: 1,
          y: '50%',
          fontSize: 28,
          bold: true,
          color: '#FFFFFF',
        })
        break

      case 'bullets':
        slide.addText(slideData.title, {
          x: 0.5,
          y: 0.5,
          fontSize: 20,
          bold: true,
          color: titleColor,
        })
        const bulletColor = slideData.bulletColor ?? defaultTheme?.bulletColor ?? '#000000'
        const bulletsText = slideData.bullets?.map((b) => `• ${b}`).join('\n') ?? ''
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.5,
          y: 0.8,
          w: 9,
          h: 4,
          fill: { color: '#F5F5F5' },
        })
        slide.addText(bulletsText, {
          x: 0.7,
          y: '50%',
          fontSize: 16,
          color: bulletColor,
          lineSpacingMultiple: 1.2,
        })
        break

      default:
        slide.addText('Unsupported layout', { x: 1, y: 2, fontSize: 18, color: '#FF0000' })
    }
  })

  return await pptx.writeFile({ fileName: outputFile })
}

const functions: ToolFunction[] = [
  {
    type: 'function',
    function: {
      name: 'generatePresentation',
      description:
        'Generates a PowerPoint presentation (.pptx) from provided data using Ollama, including AI-selected layouts, colors, and styles.',
      parameters: {
        type: 'object',
        properties: {
          data: {
            type: 'string',
            description:
              'The input data to generate presentation slides from (e.g., report text, company updates).',
          },
          outputFile: {
            type: 'string',
            description: 'Optional filename for the output .pptx file.',
          },
          themeBackgroundColor: {
            type: 'string',
            description:
              'Optional default background color for slides (HEX). Used if AI does not specify.',
          },
          themeTitleColor: {
            type: 'string',
            description: 'Optional default title text color (HEX). Used if AI does not specify.',
          },
          themeBulletColor: {
            type: 'string',
            description: 'Optional default bullet text color (HEX). Used if AI does not specify.',
          },
        },
        required: ['data'],
      },
    },
    execute: async (args: {
      data: string
      outputFile?: string
      themeBackgroundColor?: string
      themeTitleColor?: string
      themeBulletColor?: string
    }): Promise<{ file: string }> => {
      const payload = await getPayload({ config })
      const {
        data,
        outputFile = 'generated_presentation.pptx',
        themeBackgroundColor = '#FFFFFF',
        themeTitleColor = '#000000',
        themeBulletColor = '#333333',
      } = args

      const slides = await generatePresentationContent(data)

      const filePath = `./media/chats/${randomUUID().toString()}/${outputFile}`
      fs.mkdirSync(path.dirname(filePath), { recursive: true })

      await createPpt(slides, filePath, {
        backgroundColor: themeBackgroundColor,
        titleColor: themeTitleColor,
        bulletColor: themeBulletColor,
      })

      const file = await payload.create({
        collection: 'media',
        data: {},
        filePath,
      })

      return Promise.resolve({
        file: file.id,
      })
    },
  },
]

export default functions
