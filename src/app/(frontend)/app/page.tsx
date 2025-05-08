'use client'

import MyNote from '@/components/notes/my-note'
import { useNotes } from '@/hooks/notes'
import { FileText, Globe, Star, ArrowRight, BookOpen, Eye, Calendar, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePayloadSession } from 'payload-authjs/client'

export default function AppPage() {
  const notes = useNotes()
  const { session } = usePayloadSession()

  if (!session) return null

  const userNotes =
    notes.data?.filter((note) => note.author.id === session.user.id).slice(0, 3) ?? []

  const publicNotes =
    notes.data
      ?.filter((note) => note.status === 'public' && note.author.id !== session.user.id)
      .slice(0, 3) ?? []

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Hello,{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-500">
            {session.user.name}
          </span>
        </h1>
        <p className="text-gray-400">
          Manage your notes, create new content, or explore public notes from other users.
        </p>
      </div>

      {/* Recent notes section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-500" />
            Recent Notes
          </h2>
          {userNotes.length > 0 && (
            <Link
              href="/app/notes"
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All Notes
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Recent notes grid or empty state */}
        {userNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userNotes.map((note) => (
              <MyNote key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-slate-700/50 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No notes yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              You haven't created any notes yet. Start by creating your first note to capture your
              ideas, knowledge, and insights.
            </p>
            <Link
              href="/app/notes/create"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
         text-white font-medium py-2 px-4 rounded-lg shadow-md 
         hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Note
            </Link>
          </div>
        )}
      </div>

      {/* Public notes section */}
      <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Globe className="w-5 h-5 mr-2 text-green-500" />
            Recently Published Public Notes
          </h2>
          {publicNotes.length > 0 && (
            <Link
              href="/app/notes/public"
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              View All
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          )}
        </div>

        {publicNotes.length > 0 ? (
          <div className="space-y-3">
            {publicNotes.map((note) => (
              <Link
                href={`/app/notes/${note.id}`}
                key={note.id}
                className="flex items-center p-3 pr-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="mr-3 p-2 bg-slate-700 rounded-lg">
                  <BookOpen className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-sm">{note.title}</h4>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    By {note.author.name} •{' '}
                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">No public notes available</h3>
            <p className="text-gray-400 mb-4 max-w-md mx-auto">
              There are no public notes available at the moment. Be the first to share your
              knowledge with the community!
            </p>
            <Link
              href="/app/notes/create"
              className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
            >
              Create and publish a note
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
