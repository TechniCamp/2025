'use client'

import type React from 'react'

import { useState } from 'react'
import { Globe, Lock, Plus, X, Sparkles, Loader2, LinkIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGenerateNote } from '@/hooks/notes'

export default function GenerateNotePage() {
  const router = useRouter()
  const generateNote = useGenerateNote()
  const [visibility, setVisibility] = useState<'private' | 'public' | 'link-only'>('private')
  const [topic, setTopic] = useState('')
  const [linkInput, setLinkInput] = useState('')
  const [links, setLinks] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const addLink = () => {
    // Basic URL validation
    try {
      new URL(linkInput)
      if (!links.includes(linkInput.trim())) {
        setLinks([...links, linkInput.trim()])
        setLinkInput('')
      }
    } catch {
      alert('Please enter a valid URL (including http:// or https://)')
    }
  }

  const removeLink = (linkToRemove: string) => {
    setLinks(links.filter((link) => link !== linkToRemove))
  }

  const handleLinkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addLink()
    }
  }

  const generate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic for your note')
      return
    }

    setIsGenerating(true)

    try {
      const response = await generateNote.mutateAsync({
        note: topic,
        links,
        status: visibility,
      })

      if (response.error) {
        alert('Failed to generate note. Please try again.')
        return
      }

      router.push(`/app/notes/${response.id}`)
    } catch (error) {
      console.error('Error generating note:', error)
      alert('Failed to generate note. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white">
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Generate{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-500">
            Note
          </span>
        </h1>
        <div className="max-w-4xl mx-auto">
          <div>
            {/* Input form */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50 mb-8">
              <div className="mb-6">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">
                  What topic would you like to create a note about?
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic (e.g., Quantum Computing, Climate Change, etc.)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Reference links */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Add reference links (articles, papers, websites)
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {links.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-slate-800 text-gray-300 px-3 py-1 rounded-md text-sm"
                    >
                      <span className="max-w-[200px] truncate">{link}</span>
                      <button
                        onClick={() => removeLink(link)}
                        className="ml-2 text-gray-400 hover:text-gray-200"
                        aria-label={`Remove link ${link}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    onKeyDown={handleLinkKeyDown}
                    placeholder="https://example.com"
                    className="flex-grow bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addLink}
                    className="ml-2 p-2 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
                    aria-label="Add link"
                  >
                    <Plus className="w-5 h-5 text-blue-400" />
                  </button>
                </div>
              </div>

              {/* Visibility setting */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Visibility setting
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setVisibility('private')}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      visibility === 'private'
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    <Lock className="w-4 h-4 mr-2" /> Private
                  </button>
                  <button
                    onClick={() => setVisibility('public')}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      visibility === 'public'
                        ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    <Globe className="w-4 h-4 mr-2" /> Public
                  </button>
                  <button
                    onClick={() => setVisibility('link-only')}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      visibility === 'link-only'
                        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" /> With link
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <span className="flex items-center">
                    {visibility === 'private' && (
                      <>
                        <Lock className="w-3 h-3 mr-1" /> Only you can access this note
                      </>
                    )}
                    {visibility === 'public' && (
                      <>
                        <Globe className="w-3 h-3 mr-1" /> Anyone can find and access this note
                      </>
                    )}
                    {visibility === 'link-only' && (
                      <>
                        <LinkIcon className="w-3 h-3 mr-1" /> Only people with the link can access
                        this note
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={generate}
                disabled={isGenerating || !topic.trim()}
                className={`w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                       text-white font-medium py-3 px-6 rounded-lg shadow-md 
                       hover:shadow-lg transition-all ${
                         isGenerating || !topic.trim() ? 'opacity-70 cursor-not-allowed' : ''
                       }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Note...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Note
                  </>
                )}
              </button>
            </div>

            {/* How it works */}
            <div className="bg-slate-800/30 backdrop-blur rounded-xl p-6 border border-slate-700/30">
              <h2 className="text-xl font-bold mb-4">How it works</h2>
              <ol className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="flex items-center justify-center bg-blue-600/20 text-blue-400 rounded-full w-6 h-6 mr-3 mt-0.5 text-sm font-bold">
                    1
                  </span>
                  <span>Enter a topic you want to create a note about</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center bg-blue-600/20 text-blue-400 rounded-full w-6 h-6 mr-3 mt-0.5 text-sm font-bold">
                    2
                  </span>
                  <span>Add reference links to provide context and information sources</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center bg-blue-600/20 text-blue-400 rounded-full w-6 h-6 mr-3 mt-0.5 text-sm font-bold">
                    3
                  </span>
                  <span>Choose whether your note will be private or public</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center bg-blue-600/20 text-blue-400 rounded-full w-6 h-6 mr-3 mt-0.5 text-sm font-bold">
                    4
                  </span>
                  <span>Our AI will generate a comprehensive note based on your inputs</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center bg-blue-600/20 text-blue-400 rounded-full w-6 h-6 mr-3 mt-0.5 text-sm font-bold">
                    5
                  </span>
                  <span>Review, edit if needed, and save your generated note</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
