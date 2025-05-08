import type { Access, CollectionConfig } from 'payload'
import { noteChatEndpoint } from './endpoints/chat'
import { generateNoteEndpoint } from './endpoints/generate'
import { Note } from '@/payload-types'

const noteAccess: Access<Note> = ({ data, req: { user } }) => {
  if (!user) return false

  if (!data)
    return {
      or: [
        {
          author: {
            equals: user.id,
          },
          status: {},
        },
        {
          author: {},
          status: {
            equals: 'public',
          },
        },
      ],
    }

  if (data.status !== 'private') return true
  if (data.author === user.id) return true

  return false
}

const authorAccess: Access<Note> = ({ req: { user } }) => {
  if (!user) return false
  return {
    author: {
      equals: user.id,
    },
  }
}

export const Notes: CollectionConfig = {
  slug: 'notes',
  endpoints: [noteChatEndpoint, generateNoteEndpoint],
  access: {
    read: noteAccess,
    update: authorAccess,
    delete: authorAccess,
  },
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
      type: 'textarea',
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
