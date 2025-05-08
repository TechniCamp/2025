import { generateChatResponse } from '@/services/ollama'
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

    const { message, history } = body as {
      message: string
      history?: Message[]
    }

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    try {
      const response = await generateChatResponse(message, [
        {
          role: 'system',
          content: `
You are a helpful assistant. You are chatting about the note titled "${note.title}". 
If you asked for ask questions about the note, you should ask them in a way that is relevant to the note's content.
Every question should be in own messages. After each question, wait for the user to respond and check if the user answered the question correctly. 
          `.trim(),
        },
        {
          role: 'system',
          content: `Note content: ${note.content}`,
        },
        ...(history || []),
      ])

      return Response.json({ response })
    } catch (error) {
      console.error('Error in chat API:', error)
      return Response.json({ error: 'Failed to process request' }, { status: 500 })
    }
  },
}
