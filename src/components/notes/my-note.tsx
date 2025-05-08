import { useDeleteNote } from '@/hooks/notes'
import { Note } from '@/payload-types'
import { ArrowRight, Calendar, Edit, FileText, Globe, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function MyNote({ note, tools = false }: { note: Note; tools?: boolean }) {
  const deleteNote = useDeleteNote(note.id)

  const askToDeleteNote = async () => {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return
    }

    try {
      await deleteNote.mutateAsync()
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note. Please try again.')
    }
  }

  return (
    <div
      key={note.id}
      className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-95 group-hover:opacity-90 transition-opacity"></div>

      {/* Border gradient */}
      <div className="absolute inset-0 p-0.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-6 h-full flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="bg-slate-800/70 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex space-x-2">
            {note.status === 'public' && (
              <div className="p-1 bg-slate-800/70 rounded-md">
                <Globe className="w-4 h-4 text-green-500" />
              </div>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2">{note.title}</h3>

        <div className={'mt-auto' + (tools ? '' : ' flex items-center justify-between')}>
          <div className="flex items-center text-xs text-gray-400 mb-3">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(note.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          {tools ? (
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Link
                  href={`/app/notes/${note.id}`}
                  className="p-2 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors"
                >
                  <Edit className="w-4 h-4 text-blue-400" />
                </Link>
                <button
                  className="p-2 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors"
                  onClick={() => askToDeleteNote()}
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>

              <Link
                href={`/app/notes/${note.id}`}
                className="flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300"
              >
                <span>Open</span>
                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ) : (
            <Link
              href={`/app/notes/${note.id}`}
              className="flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300"
            >
              <span>Open</span>
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
