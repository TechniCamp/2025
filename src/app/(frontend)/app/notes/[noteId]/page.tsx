'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import {
  FileText,
  Save,
  Globe,
  Lock,
  Bold,
  Italic,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Heading1,
  Heading2,
  Quote,
  Code,
  Edit,
  Calendar,
  Loader2,
  Share2,
  Trash2,
  ChevronDown,
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useDeleteNote, useNote, useUpdateNote } from '@/hooks/notes'
import NoteChat from '@/components/notes/note-chat'
import { usePayloadSession } from 'payload-authjs/client'

export default function NoteViewPage() {
  const router = useRouter()
  const params = useParams()
  const { session } = usePayloadSession()
  const noteId = params.noteId as string
  const note = useNote(noteId)
  const updateNote = useUpdateNote(noteId)
  const deleteNote = useDeleteNote(noteId)

  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [createdDate, setCreatedDate] = useState('')
  const [updatedDate, setUpdatedDate] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Add these state variables
  const [visibility, setVisibility] = useState<'private' | 'public' | 'link-only'>('private')
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const [visibilityMenuOpen, setVisibilityMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (note.isLoading) {
      setIsLoading(true)
    } else if (note.isError) {
      setIsLoading(false)
      alert('Failed to load note. Please try again.')
    } else if (note.data) {
      setIsLoading(false)
    }
  }, [note.isLoading, note.isError, note.data])

  // Fetch note data
  useEffect(() => {
    if (!note.data) return

    setTitle(note.data.title)
    setContent(note.data.content)
    setOriginalContent(note.data.content)
    setVisibility(note.data.status || 'private')
    setShareLink(`${window.location.origin}/app/notes/${note.data.id}`)
    setCreatedDate(note.data.createdAt)
    setUpdatedDate(note.data.updatedAt)
  }, [note.data])

  const insertTextAtCursor = (textBefore: string, textAfter = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText =
      content.substring(0, start) + textBefore + selectedText + textAfter + content.substring(end)

    setContent(newText)

    // Set cursor position after the operation
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + textBefore.length,
        start + textBefore.length + selectedText.length,
      )
    }, 0)
  }

  const formatText = (type: string) => {
    switch (type) {
      case 'bold':
        insertTextAtCursor('**', '**')
        break
      case 'italic':
        insertTextAtCursor('*', '*')
        break
      case 'h1':
        insertTextAtCursor('# ')
        break
      case 'h2':
        insertTextAtCursor('## ')
        break
      case 'ul':
        insertTextAtCursor('- ')
        break
      case 'ol':
        insertTextAtCursor('1. ')
        break
      case 'quote':
        insertTextAtCursor('> ')
        break
      case 'code':
        insertTextAtCursor('```\n', '\n```')
        break
      case 'link':
        insertTextAtCursor('[', '](url)')
        break
      case 'image':
        insertTextAtCursor('![alt text](', ')')
        break
      default:
        break
    }
  }

  const saveNote = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your note')
      return
    }

    setIsSaving(true)

    try {
      await updateNote.mutateAsync({
        title,
        content,
        status: visibility,
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const cancelEditing = () => {
    // Revert to original content
    setContent(originalContent)
    setIsEditing(false)
  }

  const askToDeleteNote = async () => {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return
    }

    try {
      await deleteNote.mutateAsync()

      router.push('/app/notes')
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note. Please try again.')
    }
  }

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (text: string) => {
    const html = text
      // Headers
      .replace(/^# (.*$)/gm, '<div class="text-2xl font-bold mb-4">$1</div>')
      .replace(/^## (.*$)/gm, '<div class="text-xl font-semibold mb-3">$1</div>')
      .replace(/^### (.*$)/gm, '<div class="text-lg font-medium mb-2">$1</div>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
      .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>')
      // Lists
      .replace(/^- (.*$)/gm, '<ul class="list-disc list-inside"><li>$1</li></ul>')
      .replace(/<\/div>\n<div>/g, '</div><div>')
      .replace(/<div>(.+?)(?=<\/div>|$)/g, '<ul class="list-disc list-inside"><li>$1</li></ul>')
      .replace(/<\/div>\n<div>/g, '')
      // Numbered lists
      .replace(/^\d+\. (.*$)/gm, '<ol class="list-decimal list-inside"><li>$1</li></ol>')
      .replace(/<\/div>\n<div>/g, '</div><div>')
      .replace(/<div>(.+?)(?=<\/div>|$)/g, '<ol class="list-decimal list-inside"><li>$1</li></ol>')
      .replace(/<\/div>\n<div>/g, '')
      // Blockquotes
      .replace(
        /^> (.*$)/gm,
        '<div class="border-l-4 border-gray-500 pl-4 italic text-gray-400">$1</div>',
      )
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-400 hover:underline" target="_blank">$1</a>',
      )
      // Code blocks
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-800 text-gray-200 p-4 rounded"><code>$1</code></pre>',
      )
      // Line breaks
      .replace(/\n{2}/g, '<br>')
      // Tripple dash
      .replace(/---/g, '<hr class="border-t border-gray-700 my-4" />')

    return { __html: html }
  }

  if (!session) return null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-300">Loading note...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white">
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Note metadata */}
          {isEditing ? (
            <div className="flex items-center space-x-3 justify-end text-sm mb-6">
              <div className="relative">
                <button
                  onClick={() => setVisibilityMenuOpen(!visibilityMenuOpen)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    visibility === 'private'
                      ? 'bg-blue-600/20 text-blue-400'
                      : visibility === 'public'
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-purple-600/20 text-purple-400'
                  }`}
                >
                  {visibility === 'private' && (
                    <>
                      <Lock className="w-4 h-4 mr-2" /> Private
                    </>
                  )}
                  {visibility === 'public' && (
                    <>
                      <Globe className="w-4 h-4 mr-2" /> Public
                    </>
                  )}
                  {visibility === 'link-only' && (
                    <>
                      <LinkIcon className="w-4 h-4 mr-2" /> With only
                    </>
                  )}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>

                {visibilityMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg py-2 border border-slate-700 z-50">
                    <button
                      onClick={() => {
                        setVisibility('private')
                        setVisibilityMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Lock className="w-4 h-4 mr-2" /> Private
                    </button>
                    <button
                      onClick={() => {
                        setVisibility('public')
                        setVisibilityMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Globe className="w-4 h-4 mr-2" /> Public
                    </button>
                    <button
                      onClick={() => {
                        setVisibility('link-only')
                        setVisibilityMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" /> With link
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={cancelEditing}
                className="flex items-center px-4 py-2 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                disabled={isSaving}
                className={`flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                   text-white font-medium py-2 px-4 rounded-lg shadow-md 
                   hover:shadow-lg transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between mb-6 text-sm text-gray-400">
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    Created:{' '}
                    {new Date(createdDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {updatedDate && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      Updated:{' '}
                      {new Date(updatedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {visibility === 'private' ? (
                  <div className="flex items-center text-blue-400">
                    <Lock className="w-4 h-4 mr-1" />
                    <span>Private</span>
                  </div>
                ) : visibility === 'public' ? (
                  <div className="flex items-center text-green-400">
                    <Globe className="w-4 h-4 mr-1" />
                    <span>Public</span>
                  </div>
                ) : (
                  <div className="flex items-center text-purple-400">
                    <LinkIcon className="w-4 h-4 mr-1" />
                    <span>With link</span>
                  </div>
                )}
                {visibility !== 'private' && shareLink && (
                  <div className="relative ml-2">
                    <button
                      onClick={() => setShareMenuOpen(!shareMenuOpen)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-300"
                      aria-label="Share note"
                      title="Share note"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>

                    {shareMenuOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-slate-800 rounded-lg shadow-lg py-3 px-4 border border-slate-700 z-50">
                        <h3 className="text-sm font-medium mb-2">Share this note</h3>

                        <div className="flex mb-3">
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
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-r-lg text-sm"
                          >
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {note.data?.author.id === session.user.id && (
                  <>
                    <button
                      onClick={askToDeleteNote}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-400"
                      aria-label="Delete note"
                      title="Delete note"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Note
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Title section */}
          <div className="mb-6 flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mr-4">
              <FileText className="w-6 h-6" />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full bg-transparent border-b border-slate-700 text-2xl font-bold focus:outline-none focus:border-blue-500 pb-2"
              />
            ) : (
              <h1 className="text-2xl font-bold">{title}</h1>
            )}
          </div>

          {/* Formatting toolbar (only in edit mode) */}
          {isEditing && (
            <div className="bg-slate-800 rounded-t-xl p-2 border-b border-slate-700 flex flex-wrap gap-1">
              <button
                onClick={() => formatText('bold')}
                className="p-2 rounded hover:bg-slate-700 text-gray-300"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('italic')}
                className="p-2 rounded hover:bg-slate-700 text-gray-300"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('h1')}
                className="p-2 rounded hover:bg-slate-700 text-gray-300"
                title="Heading 1"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('h2')}
                className="p-2 rounded hover:bg-slate-700 text-gray-300"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-slate-700 mx-1 self-center"></div>
              <button
                onClick={() => formatText('ul')}
                className="p-2 rounded hover:bg-slate-700 text-gray-300"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('ol')}
                className="p-2 rounded hover:bg-slate-700 text-gray-300"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-slate-700 mx-1 self-center"></div>
              <button
                onClick={() => formatText('link')}
                className="p-2 rounded hover:bg-slate-700 text-gray-300"
                title="Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('image')}
                className="p-2 rounded hover:bg-slate-700 text-gray-300"
                title="Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-slate-700 mx-1 self-center"></div>
              <button
                onClick={() => formatText('quote')}
                className="p-2 rounded hover:bg-slate-700 text-gray-300"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('code')}
                className="p-2 rounded hover:bg-slate-700 text-gray-300"
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Content editor or preview */}
          <div
            className={`bg-slate-800/50 backdrop-blur ${
              isEditing ? 'rounded-b-xl' : 'rounded-xl'
            } p-6 border border-slate-700/50`}
          >
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your note here... Use markdown for formatting."
                className="w-full h-[400px] bg-transparent resize-none focus:outline-none text-gray-200 font-mono"
              ></textarea>
            ) : (
              <div className="prose prose-invert prose-slate max-w-none">
                <div dangerouslySetInnerHTML={renderMarkdown(content)} />
              </div>
            )}
          </div>

          {/* Markdown help */}
          {isEditing && (
            <div className="mt-4 text-xs text-gray-400">
              <p>
                Supports Markdown: **bold**, *italic*, # Heading, ## Subheading, - list, 1. numbered
                list, &gt; quote, \`\`\`code\`\`\`
              </p>
            </div>
          )}

          {/* Save button (bottom) - only in edit mode */}
          {isEditing && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={saveNote}
                disabled={isSaving}
                className={`flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                       text-white font-medium py-2 px-6 rounded-lg shadow-md 
                       hover:shadow-lg transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Save className="w-5 h-5 mr-2" />
                {isSaving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          )}

          {/* AI Chat Assistant Section */}
          {!isEditing && <NoteChat noteId={noteId} />}
        </div>
      </main>
    </div>
  )
}
