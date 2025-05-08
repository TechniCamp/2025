'use client'

import { useState } from 'react'
import {
  FileText,
  Search,
  Plus,
  Star,
  ArrowRight,
  Calendar,
  Filter,
  Globe,
  SortAsc,
  SortDesc,
  Clock,
  AlignLeft,
  TagIcon,
  Trash2,
  Edit,
  FileQuestion,
  Lock,
} from 'lucide-react'
import Link from 'next/link'
import { useNotes } from '@/hooks/notes'
import { usePayloadSession } from 'payload-authjs/client'

export default function AllNotesPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const notes = useNotes()
  const { session } = usePayloadSession()

  if (!session) return null

  const userNotes = notes.data?.filter((note) => note.author.id === session.user.id) ?? []

  // Filter notes based on active filter and search query
  const filteredNotes = userNotes
    .filter((note) => {
      // Filter by type (all, starred, public)
      if (activeFilter === 'all') return true
      if (activeFilter === 'private') return note.status === 'private'
      if (activeFilter === 'public') return note.status === 'public'
      return true
    })
    .filter((note) => {
      // Filter by search query
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return note.title.toLowerCase().includes(query)
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

  // Check if we have any notes at all
  const hasNotes = userNotes.length > 0

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            All{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-500">
              Notes
            </span>
          </h1>
          <p className="text-gray-400">Manage, organize, and search through all your notes</p>
        </div>

        <Link
          href="/notes/create"
          className="mt-4 md:mt-0 inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
         text-white font-medium py-2 px-4 rounded-lg shadow-md 
         hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Note
        </Link>
      </div>

      {hasNotes ? (
        <>
          {/* Search and filters */}
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-grow">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes by title, content, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center bg-slate-800 rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-slate-700 text-sm text-gray-300 flex items-center">
                    <Filter className="w-4 h-4 mr-1" /> Filter
                  </div>
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-2 text-sm ${
                      activeFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveFilter('private')}
                    className={`px-3 py-2 text-sm flex items-center ${
                      activeFilter === 'private'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    <Lock className="w-3 h-3 mr-1" /> Private
                  </button>
                  <button
                    onClick={() => setActiveFilter('public')}
                    className={`px-3 py-2 text-sm flex items-center ${
                      activeFilter === 'public'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    <Globe className="w-3 h-3 mr-1" /> Public
                  </button>
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
          </div>

          {/* Notes grid */}
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
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

                    <div className="mt-auto">
                      <div className="flex items-center text-xs text-gray-400 mb-3">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(note.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Link
                            href={`/notes/${note.id}/edit`}
                            className="p-2 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                          </Link>
                          <button className="p-2 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>

                        <Link
                          href={`/notes/${note.id}`}
                          className="flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300"
                        >
                          <span>Open</span>
                          <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-slate-700/50 text-center">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No notes found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery
                  ? 'No notes match your search criteria. Try a different search term.'
                  : 'No notes match the selected filters. Try changing your filter settings.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setActiveFilter('all')
                }}
                className="inline-flex items-center bg-slate-700 hover:bg-slate-600 
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
            <FileQuestion className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold mb-3">You don't have any notes yet</h3>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Start your knowledge journey by creating your first note. Notes help you organize your
            thoughts, ideas, and learning materials in one place.
          </p>
          <Link
            href="/app/notes/create"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
           text-white font-medium py-3 px-6 rounded-lg shadow-md 
           hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Note
          </Link>
        </div>
      )}
    </main>
  )
}
