import { Note, User } from '@/payload-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useNotes() {
  return useQuery({
    queryKey: ['notes'],
    queryFn: async (): Promise<(Note & { author: User })[]> => {
      const response = await fetch('/api/notes?depth=1')
      const data = await response.json()
      return data.docs
    },
  })
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: async (): Promise<Note & { author: User }> => {
      const response = await fetch(`/api/notes/${id}?depth=1`)
      const data = await response.json()
      return data
    },
  })
}

export function useUpdateNote(id: string) {
  const queryClient = useQueryClient()
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useGenerateNote() {
  const queryClient = useQueryClient()
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useDeleteNote(id: string) {
  const queryClient = useQueryClient()
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}
