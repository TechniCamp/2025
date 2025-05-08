import type { CollectionConfig } from 'payload'
import { noteChatEndpoint } from './endpoints/chat'
import { generateNoteEndpoint } from './endpoints/generate'
import { presentationsEndpoint } from './endpoints/presentations';

export const Notes: CollectionConfig = {
  slug: 'notes',
  endpoints: [noteChatEndpoint, generateNoteEndpoint, presentationsEndpoint],
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
