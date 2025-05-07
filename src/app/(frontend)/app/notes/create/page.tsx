'use client'

import type React from 'react'

import { useState } from 'react'
import {
  ArrowLeft,
  Save,
  Globe,
  Lock,
  Plus,
  X,
  Sparkles,
  Loader2,
  FileText,
  LinkIcon,
  Copy,
  Check,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function GenerateNotePage() {
  const router = useRouter()
  // Replace isPublic state with visibility state
  const [visibility, setVisibility] = useState<'private' | 'public' | 'link'>('private')
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [topic, setTopic] = useState('')
  const [linkInput, setLinkInput] = useState('')
  const [links, setLinks] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTitle, setGeneratedTitle] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerated, setIsGenerated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const addLink = () => {
    // Basic URL validation
    try {
      const url = new URL(linkInput)
      if (!links.includes(linkInput.trim())) {
        setLinks([...links, linkInput.trim()])
        setLinkInput('')
      }
    } catch (e) {
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

  const generateNote = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic for your note')
      return
    }

    setIsGenerating(true)

    try {
      // Simulate API call to AI service
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock generated content based on topic and links
      const mockTitle = `Understanding ${topic.charAt(0).toUpperCase() + topic.slice(1)}`

      const mockContent = `# ${mockTitle}

## Introduction

This note explores the fascinating topic of ${topic}. Based on the provided references, we'll dive deep into the key concepts, applications, and latest developments in this field.

## Key Concepts

${topic.charAt(0).toUpperCase() + topic.slice(1)} encompasses several important principles:

- First principle of ${topic}
- Second principle of ${topic}
- Third principle of ${topic}

## Analysis of References

${links
  .map(
    (link, index) => `### Reference ${index + 1}: [Source](${link})

This source provides valuable insights on ${topic}, particularly focusing on specific aspects and applications.

`,
  )
  .join('')}

## Practical Applications

The practical applications of ${topic} include:

1. First application area
2. Second application area
3. Third application area

## Conclusion

${topic.charAt(0).toUpperCase() + topic.slice(1)} represents an important area of study with significant implications for future developments. The references provided offer a solid foundation for understanding this topic in greater depth.
`

      setGeneratedTitle(mockTitle)
      setGeneratedContent(mockContent)
      setIsGenerated(true)
    } catch (error) {
      console.error('Error generating note:', error)
      alert('Failed to generate note. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const saveNote = async () => {
    if (!generatedTitle.trim() || !generatedContent.trim()) {
      alert('Please generate content before saving')
      return
    }

    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a share link if visibility is set to 'link'
      let generatedShareLink = null
      if (visibility === 'link') {
        // In a real app, you would generate a unique link on the server
        const uniqueId = Math.random().toString(36).substring(2, 10)
        generatedShareLink = `${window.location.origin}/shared/${uniqueId}`
        setShareLink(generatedShareLink)
      }

      // In a real app, you would send data to your API
      console.log({
        title: generatedTitle,
        content: generatedContent,
        tags,
        visibility,
        shareLink: generatedShareLink,
      })

      // Navigate back to dashboard after successful save
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const editInFullEditor = () => {
    // In a real app, you would store the generated content in a state management solution
    // or local storage, then redirect to the full editor
    localStorage.setItem('draftNoteTitle', generatedTitle)
    localStorage.setItem('draftNoteContent', generatedContent)
    localStorage.setItem('draftNoteTags', JSON.stringify(tags))
    localStorage.setItem('draftNoteIsPublic', String(visibility))

    router.push('/notes/create')
  }

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (text: string) => {
    const html = text
      // Headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/<\/li>\n<li>/g, '</li><li>')
      .replace(/<li>(.+?)(?=<\/li>|$)/g, '<ul><li>$1</li></ul>')
      .replace(/<\/ul>\n<ul>/g, '')
      // Numbered lists
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/<\/li>\n<li>/g, '</li><li>')
      .replace(/<li>(.+?)(?=<\/li>|$)/g, '<ol><li>$1</li></ol>')
      .replace(/<\/ol>\n<ol>/g, '')
      // Links
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" class="text-blue-400 hover:underline" target="_blank">$1</a>',
      )
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Line breaks
      .replace(/\n/g, '<br>')

    return { __html: html }
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
          {!isGenerated ? (
            <>
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
                      onClick={() => setVisibility('link')}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        visibility === 'link'
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
                      {visibility === 'link' && (
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
                  onClick={generateNote}
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
            </>
          ) : (
            <>
              {/* Generated note preview */}
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
                  Generated Note
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setVisibility(visibility === 'public' ? 'private' : 'public')}
                    className={`flex items-center px-3 py-1 rounded-lg text-sm transition-colors ${
                      visibility === 'public'
                        ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    {visibility === 'public' ? (
                      <>
                        <Globe className="w-3 h-3 mr-1" /> Public
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" /> Private
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50 mb-8">
                <div className="prose prose-invert prose-slate max-w-none">
                  <div dangerouslySetInnerHTML={renderMarkdown(generatedContent)} />
                </div>
              </div>

              {visibility === 'link' && shareLink && (
                <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                  <div className="text-sm font-medium mb-2 text-purple-400 flex items-center">
                    <LinkIcon className="w-4 h-4 mr-2" /> Share link
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-grow bg-slate-900 border border-slate-700 rounded-l-lg py-2 px-3 text-sm text-gray-300"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareLink)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-r-lg text-sm flex items-center"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setIsGenerated(false)}
                    className="flex items-center justify-center px-4 py-2 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Generator
                  </button>
                  <button
                    onClick={editInFullEditor}
                    className="flex items-center justify-center px-4 py-2 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Edit in Full Editor
                  </button>
                </div>

                <button
                  onClick={saveNote}
                  disabled={isSaving}
                  className={`flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                       text-white font-medium py-2 px-6 rounded-lg shadow-md 
                       hover:shadow-lg transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Note
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
