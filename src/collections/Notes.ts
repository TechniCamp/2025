import { generateChatResponse } from '@/services/ollama'
import { NextResponse } from 'next/server'
import { Message } from 'ollama'
import type { CollectionConfig } from 'payload'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

export const Notes: CollectionConfig = {
  slug: 'notes',
  endpoints: [
    {
      path: '/:id/chat',
      method: 'post',
      handler: async (req) => {
        const { id } = req.routeParams as { id: string }

        const note = await req.payload.findByID({
          collection: 'notes',
          id,
          depth: 1,
        })

        if (!note) {
          return Response.json({ error: 'Note not found' }, { status: 404 })
        }

        let body
        try {
          body = await req.json!()
        } catch (error) {
          return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 })
        }

        const { message } = body as {
          message: string
        }

        if (!message) {
          return Response.json({ error: 'Message is required' }, { status: 400 })
        }

        const history = (note.chatMessages || []) as Message[]

        try {
          const response = await generateChatResponse(message, [
            {
              role: 'system',
              content: `You are a helpful assistant. You are chatting about the note titled "${note.title}".`,
            },
            {
              role: 'system',
              content: `Note content: ${convertLexicalToPlaintext({ data: note.content })}`,
            },
            // ...history,
          ])

          await req.payload.update({
            collection: 'notes',
            id,
            data: {
              chatMessages: [
                ...history,
                {
                  role: 'user',
                  content: message,
                },
                ...response.messages,
              ],
            },
          })

          return Response.json({ response })
        } catch (error) {
          console.error('Error in chat API:', error)
          return Response.json({ error: 'Failed to process request' }, { status: 500 })
        }
      },
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Private',
          value: 'private',
        },
        {
          label: 'Public',
          value: 'public',
        },
        {
          label: 'Link Only',
          value: 'link-only',
        },
      ],
      defaultValue: 'private',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'chatMessages',
      type: 'json',
      defaultValue: [
        {
          role: 'assistant',
          content:
            'Hi! Do you want me to check your knowledge about this note? Or do you want to ask me something?',
        },
      ],
    },
  ],
}
