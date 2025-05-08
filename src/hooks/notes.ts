import { Note, User } from '@/payload-types'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useNotes() {
  return useQuery({
    queryKey: ['my-notes'],
    queryFn: async (): Promise<(Note & { author: User })[]> => {
      const response = await fetch('/api/notes?depth=1')
      const data = await response.json()
      return data.docs
    },
  })
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ['note', id],
    queryFn: async (): Promise<Note & { author: User }> => {
      const response = await fetch(`/api/notes/${id}?depth=1`)
      const data = await response.json()
      return data
    },
  })
}

export function useUpdateNote(id: string) {
  return useMutation({
    mutationFn: async (data: Partial<Note>) => {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to update note')
      }
      return response.json()
    },
    mutationKey: ['update-note', id],
  })
}

export function useGenerateNote() {
  return useMutation({
    mutationFn: async (data: {
      note: string
      links?: string[]
      status: 'private' | 'public' | 'link-only'
    }) => {
      const response = await fetch('/api/notes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to create note')
      }
      return response.json()
    },
    mutationKey: ['create-note'],
  })
}

export function useDeleteNote(id: string) {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete note')
      }
      return response.json()
    },
    mutationKey: ['delete-note', id],
  })
}
