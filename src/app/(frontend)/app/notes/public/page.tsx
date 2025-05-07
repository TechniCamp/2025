'use client'

import { useState } from 'react'
import {
  BookOpen,
  Search,
  ArrowRight,
  Calendar,
  SortAsc,
  SortDesc,
  Clock,
  AlignLeft,
  TagIcon,
  Eye,
  ThumbsUp,
  Globe,
  Plus,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useNotes } from '@/hooks/notes'
import { usePayloadSession } from 'payload-authjs/client'

export default function PublicNotesPage() {
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const notes = useNotes()
  const { session } = usePayloadSession()

  if (!session) return null

  const publicNotes =
    notes.data?.filter((note) => note.status === 'public' && note.author.id !== session.user.id) ??
    []

  // Filter notes based on search query and selected tag
  const filteredNotes = publicNotes
    .filter((note) => {
      // Filter by search query
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        note.title.toLowerCase().includes(query) || note.author.name?.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === 'date') {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      } else if (sortBy === 'title') {
        return sortOrder === 'desc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title)
      }
      return 0
    })

  // Check if we have any public notes at all
  const hasPublicNotes = publicNotes.length > 0

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Public{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
            Notes
          </span>
        </h1>
        <p className="text-gray-400">Discover and learn from notes shared by the community</p>
      </div>

      {hasPublicNotes ? (
        <>
          {/* Search and filters */}
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-grow">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search public notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center bg-slate-800 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-slate-700 text-sm text-gray-300 flex items-center">
                  {sortOrder === 'desc' ? (
                    <SortDesc className="w-4 h-4 mr-1" />
                  ) : (
                    <SortAsc className="w-4 h-4 mr-1" />
                  )}
                  Sort
                </div>
                <button
                  onClick={() => setSortBy('date')}
                  className={`px-3 py-2 text-sm flex items-center ${
                    sortBy === 'date'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1" /> Date
                </button>
                <button
                  onClick={() => setSortBy('title')}
                  className={`px-3 py-2 text-sm flex items-center ${
                    sortBy === 'title'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <AlignLeft className="w-3 h-3 mr-1" /> Title
                </button>
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="px-3 py-2 text-sm text-gray-300 hover:bg-slate-700"
                >
                  {sortOrder === 'desc' ? '↓' : '↑'}
                </button>
              </div>
            </div>
          </div>

          {/* Public notes grid */}
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNotes.map((note) => (
                <Link
                  href={`/notes/public/${note.id}`}
                  key={note.id}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-95 group-hover:opacity-90 transition-opacity"></div>

                  {/* Border gradient */}
                  <div className="absolute inset-0 p-0.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-slate-800/70 p-2 rounded-lg">
                        <BookOpen className="w-5 h-5 text-green-500" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{note.title}</h3>

                    <div className="flex items-center mt-auto mb-4">
                      <div className="flex items-center mr-2 justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{note.author.name}</p>
                        <p className="text-xs text-gray-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(note.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <div className="flex items-center text-sm font-medium text-green-400 group-hover:text-green-300">
                        <span>Read Note</span>
                        <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-slate-700/50 text-center">
              <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No public notes found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedTag
                  ? 'No notes match your search criteria. Try different search terms or filters.'
                  : 'There are no public notes available at the moment.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTag('')
                }}
                className="inline-flex items-center bg-slate-800 hover:bg-slate-700 
              text-white font-medium py-2 px-4 rounded-lg shadow-md 
              hover:shadow-lg transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-12 border border-slate-700/50 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-700/50 rounded-full flex items-center justify-center">
            <Globe className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No public notes available</h3>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            There are no public notes available at the moment. Be the first to share your knowledge
            with the community by creating and publishing a note!
          </p>
          <Link
            href="/notes/create"
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
           text-white font-medium py-3 px-6 rounded-lg shadow-md 
           hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Public Note
          </Link>
        </div>
      )}
    </main>
  )
}
