import { generateChatResponse } from '@/services/ollama'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { Message } from 'ollama'
import { Endpoint } from 'payload'

export const noteChatEndpoint: Endpoint = {
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
          content: `Note content: ${note.content}`,
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
}
