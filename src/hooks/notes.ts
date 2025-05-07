import { Note, User } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'

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
