'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sparkles,
  BookOpen,
  FileText,
  Loader2,
  History,
  PlusCircle,
  ArrowRight,
  Search,
} from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Note {
  id: string
  title: string
  content: string
  status: 'private' | 'public' | 'link-only'
  createdAt: string
  updatedAt: string
  author:
    | {
        id: string
        email: string
      }
    | string
}

export default function PresentationsScenariosGenerator() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [noteLoading, setNoteLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [generatedScenario, setGeneratedScenario] = useState<string>('')
  const [generatedPresentation, setGeneratedPresentation] = useState<string>('')
  const [customPrompt, setCustomPrompt] = useState<string>('')

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    setNoteLoading(true)
    try {
      const response = await fetch('/api/notes')
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      const data = await response.json()
      setNotes(data.docs || [])
    } catch (err) {
      setError('Failed to load notes. Please try again.')
      console.error('Error fetching notes:', err)
    } finally {
      setNoteLoading(false)
    }
  }

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note)
    setGeneratedScenario('')
    setCustomPrompt('')
  }

  const handleGenerateScenario = async () => {
    if (!selectedNote) {
      setError('Please select a note first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: `${selectedNote.title}: ${selectedNote.content}${customPrompt ? `\nAdditional instructions: ${customPrompt}` : ''}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate scenario')
      }

      setGeneratedScenario(data.extended)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }
  const handleGeneratePresentation = async () => {
    if (!selectedNote) {
      setError('Please select a note first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/notes/presentations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: `${selectedNote.title}: ${selectedNote.content}${customPrompt ? `\nAdditional instructions: ${customPrompt}` : ''}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate presentation')
      }

      // Update UI with file information
      const fileUrl = data.fileDetails.url

      // Set presentation download link or display info
      setGeneratedPresentation(`
        <div class="flex flex-col items-center justify-center p-6 border border-blue-500 rounded-lg bg-slate-800/50">
          <h3 class="text-lg font-bold text-blue-400 mb-4">Your presentation is ready!</h3>
          <p class="mb-4 text-gray-300">Click below to download your presentation:</p>
          <a href="${fileUrl}" download class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Presentation
          </a>
        </div>
      `)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Note to Learning Scenario Generator
            </span>
          </h1>
          <p className="text-gray-400">
            Convert your notes into detailed teaching scenarios and learning materials
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 shadow-xl overflow-hidden mb-6">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                  {selectedNote ? `Create Scenario from: ${selectedNote.title}` : 'Select a Note'}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                {selectedNote ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-lg shadow-inner">
                      <h3 className="font-medium mb-2 text-blue-400">Note Content:</h3>
                      <div className="text-gray-300 whitespace-pre-wrap">
                        {selectedNote.content}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Additional Instructions (Optional)
                      </label>
                      <Textarea
                        placeholder="Add specific requirements for your learning scenario (e.g., 'for 10th grade', 'include group activities', 'focus on practical applications')"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-900/90 border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-500 resize-none"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-md text-red-300 text-sm">
                        {error}
                      </div>
                    )}
                    <div className="flex flex-row gap-5 max-w-full">
                      <Button
                        onClick={handleGenerateScenario}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-blue-900/40"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating Learning Scenario...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Learning Scenario
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleGeneratePresentation}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-blue-900/40"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating Presentation...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Presentation
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <BookOpen className="w-12 h-12 mx-auto text-blue-400 opacity-50 mb-3" />
                    <p className="text-gray-400">
                      Select a note from the list to generate a learning scenario
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            {generatedScenario && (
              <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Generated Learning Scenario
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="p-5 bg-slate-900/80 border border-slate-700/80 rounded-lg shadow-inner">
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: generatedScenario }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            {generatedPresentation && (
              <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 shadow-xl overflow-hidden mt-6">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Generated Presentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="p-5 bg-slate-900/80 border border-slate-700/80 rounded-lg shadow-inner">
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: generatedPresentation }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 shadow-xl mb-6">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="flex items-center text-base">
                  <History className="w-5 h-5 mr-2 text-blue-400" />
                  My Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-slate-900/90 border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {noteLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                  </div>
                ) : filteredNotes.length > 0 ? (
                  <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                    {filteredNotes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => handleNoteSelect(note)}
                        className={`w-full flex items-center p-3 hover:bg-slate-700/50 transition-colors text-left rounded-md ${selectedNote?.id === note.id ? 'bg-blue-900/20 border border-blue-800/40' : ''}`}
                      >
                        <div className="mr-3 p-2 bg-slate-700 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <h4 className="font-medium text-sm truncate">{note.title}</h4>
                          <p className="text-xs text-gray-400 truncate">
                            {note.content?.substring(0, 50)}...
                          </p>
                        </div>
                        {selectedNote?.id === note.id && (
                          <ArrowRight className="w-4 h-4 text-blue-400 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">No notes found</div>
                )}
              </CardContent>
            </Card>

            {/* Tips Panel */}
            <Card className="bg-slate-800/50 backdrop-blur border border-slate-700/50 shadow-xl">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center text-base">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
                  Tips for Better Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex">
                    <PlusCircle className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Add target audience in additional instructions</span>
                  </li>
                  <li className="flex">
                    <PlusCircle className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Specify time constraints for activities</span>
                  </li>
                  <li className="flex">
                    <PlusCircle className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Request specific teaching methods</span>
                  </li>
                  <li className="flex">
                    <PlusCircle className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Ask for assessment ideas or follow-up activities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
