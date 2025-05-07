'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import {
  FileText,
  ArrowLeft,
  Save,
  Globe,
  Lock,
  Tag,
  Plus,
  X,
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
  Eye,
  Calendar,
  Star,
  Loader2,
  Share2,
  Trash2,
  ChevronDown,
  Sparkles,
  Send,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

export default function NoteViewPage() {
  const router = useRouter()
  const params = useParams()
  const noteId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isStarred, setIsStarred] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [createdDate, setCreatedDate] = useState('')
  const [updatedDate, setUpdatedDate] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Add these state variables
  const [visibility, setVisibility] = useState<'private' | 'public' | 'link'>('private')
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const [visibilityMenuOpen, setVisibilityMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Add these state variables after the other state declarations (around line 40)
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'ai'; content: string }>
  >([])
  const [messageInput, setMessageInput] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)

  // Fetch note data
  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data - in a real app, you would fetch from your API
        const mockNote = {
          id: noteId,
          title: 'Understanding Machine Learning',
          content: `# Understanding Machine Learning

## Introduction

Machine learning is a branch of artificial intelligence (AI) and computer science which focuses on the use of data and algorithms to imitate the way that humans learn, gradually improving its accuracy.

## Key Concepts

- **Supervised Learning**: The algorithm is trained on labeled data
- **Unsupervised Learning**: The algorithm finds patterns in unlabeled data
- **Reinforcement Learning**: The algorithm learns through trial and error

## Applications

Machine learning has numerous applications across various industries:

1. Healthcare
2. Finance
3. Transportation
4. Marketing
5. Education

## Challenges

Despite its potential, machine learning faces several challenges:

> "The biggest challenge in machine learning isn't the algorithms, but the data quality and interpretation of results."

## Future Directions

As computing power increases and algorithms improve, we can expect machine learning to become even more integrated into our daily lives.

\`\`\`
# Simple Python example
import sklearn
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
\`\`\`

## Conclusion

Machine learning represents one of the most transformative technologies of our time, with the potential to revolutionize how we work, live, and interact with the world around us.`,
          tags: ['AI', 'Technology', 'Data Science'],
          visibility: 'public', // or 'private' or 'link'
          // shareLink: 'public' === 'link' ? `${window.location.origin}/shared/abc123` : null,
          isStarred: true,
          createdDate: 'May 1, 2025',
          updatedDate: 'May 7, 2025',
        }

        setTitle(mockNote.title)
        setContent(mockNote.content)
        setOriginalContent(mockNote.content)
        setTags(mockNote.tags)
        setVisibility(mockNote.visibility as 'private' | 'public' | 'link')
        // setShareLink(mockNote.shareLink)
        setIsStarred(mockNote.isStarred)
        setCreatedDate(mockNote.createdDate)
        setUpdatedDate(mockNote.updatedDate)
      } catch (error) {
        console.error('Error fetching note:', error)
        alert('Failed to load note. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNote()
  }, [noteId])

  const addTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

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

  // Add this function before the saveNote function
  const handleSendMessage = (predefinedMessage?: string) => {
    const message = predefinedMessage || messageInput
    if (!message.trim() || isAiTyping) return

    // Add user message
    const userMessage = { sender: 'user' as const, content: message }
    setChatMessages((prev) => [...prev, userMessage])
    setMessageInput('')
    setIsAiTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = ''

      // Generate contextual responses based on the message
      if (
        message.toLowerCase().includes('explain') ||
        message.toLowerCase().includes('simpler terms')
      ) {
        aiResponse = `Machine learning is essentially teaching computers to learn from data and make decisions without being explicitly programmed for each task. Think of it like teaching a child - you show them examples, and they learn patterns to apply to new situations.

The key concepts are:
- Supervised learning: Learning with labeled examples (like flashcards)
- Unsupervised learning: Finding patterns without labels (like grouping similar objects)
- Reinforcement learning: Learning through trial and error (like training a pet)

Does that help clarify things?`
      } else if (
        message.toLowerCase().includes('practical') ||
        message.toLowerCase().includes('applications')
      ) {
        aiResponse = `Machine learning has numerous practical applications across industries:

1. Healthcare: Disease diagnosis, personalized treatment plans, drug discovery
2. Finance: Fraud detection, algorithmic trading, credit scoring
3. Transportation: Self-driving vehicles, traffic prediction, route optimization
4. Marketing: Customer segmentation, recommendation systems, sentiment analysis
5. Agriculture: Crop monitoring, yield prediction, automated harvesting

These applications are transforming how businesses operate and how we live our daily lives.`
      } else if (message.toLowerCase().includes('examples')) {
        aiResponse = `Here are some concrete examples of machine learning in action:

1. Netflix's recommendation system suggests shows based on your viewing history
2. Gmail's spam filter learns to identify unwanted emails
3. Voice assistants like Siri and Alexa understand and respond to natural language
4. Medical imaging systems that can detect cancer in scans
5. Fraud detection systems that flag unusual credit card transactions

Each of these examples uses different ML techniques to solve specific problems.`
      } else if (
        message.toLowerCase().includes('latest') ||
        message.toLowerCase().includes('developments')
      ) {
        aiResponse = `Some of the latest developments in machine learning include:

1. Large language models (like GPT-4) that can understand and generate human-like text
2. Multimodal models that can process text, images, and audio simultaneously
3. Advancements in reinforcement learning for robotics and complex decision-making
4. Federated learning for privacy-preserving ML across distributed devices
5. Neuromorphic computing that mimics brain structures for more efficient AI

The field is evolving rapidly, with new breakthroughs happening regularly.`
      } else {
        aiResponse = `That's an interesting question about machine learning. Based on the note content, machine learning is a branch of AI focused on building systems that learn from data.

The note covers supervised learning (using labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error).

Would you like me to elaborate on any specific aspect of machine learning mentioned in the note?`
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', content: aiResponse }])
      setIsAiTyping(false)
    }, 1500)
  }

  const saveNote = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your note')
      return
    }

    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a share link if visibility is set to 'link' and no link exists
      let updatedShareLink = shareLink
      if (visibility === 'link' && !shareLink) {
        // In a real app, you would generate a unique link on the server
        const uniqueId = Math.random().toString(36).substring(2, 10)
        updatedShareLink = `${window.location.origin}/shared/${uniqueId}`
        setShareLink(updatedShareLink)
      }

      // In a real app, you would send data to your API
      console.log({
        id: noteId,
        title,
        content,
        tags,
        visibility,
        shareLink: updatedShareLink,
        isStarred,
      })

      // Update original content after successful save
      setOriginalContent(content)

      // Exit edit mode
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

  const deleteNote = async () => {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would send a delete request to your API
      console.log(`Deleting note ${noteId}`)

      // Navigate back to notes list
      router.push('/notes')
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note. Please try again.')
    }
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
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
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
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            href="/notes"
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Notes
          </Link>

          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={cancelEditing}
                  className="flex items-center px-4 py-2 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
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
                    {visibility === 'link' && (
                      <>
                        <LinkIcon className="w-4 h-4 mr-2" /> Shared
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
                          setVisibility('link')
                          setVisibilityMenuOpen(false)
                          if (!shareLink) {
                            // Generate a share link if it doesn't exist
                            const uniqueId = Math.random().toString(36).substring(2, 10)
                            const newShareLink = `${window.location.origin}/shared/${uniqueId}`
                            setShareLink(newShareLink)
                          }
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        <LinkIcon className="w-4 h-4 mr-2" /> Share with link
                      </button>
                    </div>
                  )}
                </div>
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
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsStarred(!isStarred)}
                  className={`p-2 rounded-lg transition-colors ${
                    isStarred
                      ? 'text-yellow-400 hover:text-yellow-300'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  aria-label={isStarred ? 'Unstar note' : 'Star note'}
                  title={isStarred ? 'Unstar note' : 'Star note'}
                >
                  <Star className="w-5 h-5" fill={isStarred ? 'currentColor' : 'none'} />
                </button>
                <div className="relative">
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

                      {visibility === 'private' ? (
                        <div className="text-xs text-gray-400 mb-3">
                          This note is private. Change visibility to share it.
                        </div>
                      ) : visibility === 'link' && shareLink ? (
                        <>
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
                        </>
                      ) : (
                        <div className="text-xs text-gray-400 mb-3">
                          This note is public. Anyone can access it.
                        </div>
                      )}

                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => {
                            setVisibility('private')
                            setShareMenuOpen(false)
                          }}
                          className={`flex items-center px-3 py-1.5 rounded text-sm ${
                            visibility === 'private'
                              ? 'bg-blue-600/20 text-blue-400'
                              : 'hover:bg-slate-700'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5 mr-2" /> Private
                        </button>
                        <button
                          onClick={() => {
                            setVisibility('public')
                            setShareMenuOpen(false)
                          }}
                          className={`flex items-center px-3 py-1.5 rounded text-sm ${
                            visibility === 'public'
                              ? 'bg-green-600/20 text-green-400'
                              : 'hover:bg-slate-700'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5 mr-2" /> Public
                        </button>
                        <button
                          onClick={() => {
                            setVisibility('link')
                            setShareMenuOpen(false)
                            if (!shareLink) {
                              // Generate a share link if it doesn't exist
                              const uniqueId = Math.random().toString(36).substring(2, 10)
                              const newShareLink = `${window.location.origin}/shared/${uniqueId}`
                              setShareLink(newShareLink)
                            }
                          }}
                          className={`flex items-center px-3 py-1.5 rounded text-sm ${
                            visibility === 'link'
                              ? 'bg-purple-600/20 text-purple-400'
                              : 'hover:bg-slate-700'
                          }`}
                        >
                          <LinkIcon className="w-3.5 h-3.5 mr-2" /> Share with link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={deleteNote}
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
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Note metadata */}
          {!isEditing && (
            <div className="flex flex-wrap items-center justify-between mb-6 text-sm text-gray-400">
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Created: {createdDate}</span>
                </div>
                {updatedDate && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Updated: {updatedDate}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center">
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
                    <span>Shared with link</span>
                  </div>
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

          {/* Tags section */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Tag className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-400">Tags</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-slate-800 text-gray-300 px-3 py-1 rounded-md text-sm"
                >
                  {tag}
                  {isEditing && (
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-gray-400 hover:text-gray-200"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a tag..."
                    className="bg-slate-800 border border-slate-700 rounded-lg py-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
                  />
                  <button
                    onClick={addTag}
                    className="ml-2 p-1 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors"
                    aria-label="Add tag"
                  >
                    <Plus className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* View/Edit toggle */}
          {isEditing && (
            <div className="flex items-center mb-4 space-x-4">
              <button
                onClick={() => setIsEditing(true)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isEditing
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-800 text-gray-300'
                }`}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  !isEditing
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-800 text-gray-300'
                }`}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
            </div>
          )}

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
          {!isEditing && (
            <div className="max-w-4xl mx-auto mt-12">
              <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-b border-slate-700/50 flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
                    AI Note Assistant
                  </h3>
                  <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="text-gray-400 hover:text-white"
                  >
                    {isChatOpen ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5 transform rotate-180" />
                    )}
                  </button>
                </div>

                {isChatOpen && (
                  <div className="p-4">
                    {/* Chat messages */}
                    <div className="mb-4 max-h-80 overflow-y-auto">
                      {chatMessages.length > 0 ? (
                        <div className="space-y-4">
                          {chatMessages.map((message, index) => (
                            <div
                              key={index}
                              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                  message.sender === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700 text-gray-200'
                                }`}
                              >
                                {message.content}
                              </div>
                            </div>
                          ))}
                          {isAiTyping && (
                            <div className="flex justify-start">
                              <div className="bg-slate-700 text-gray-200 max-w-[80%] rounded-lg px-4 py-2">
                                <div className="flex space-x-2">
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: '0ms' }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: '150ms' }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: '300ms' }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-blue-400" />
                          </div>
                          <h4 className="text-lg font-medium mb-2">
                            Ask me anything about this note
                          </h4>
                          <p className="text-gray-400 mb-4">
                            I can help explain concepts, provide additional information, or answer
                            questions about the content.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Suggested questions */}
                    {chatMessages.length === 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">
                          Suggested questions:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              handleSendMessage(
                                'Can you explain the key concepts in simpler terms?',
                              )
                            }
                            className="text-sm bg-slate-700 hover:bg-slate-600 text-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Explain key concepts
                          </button>
                          <button
                            onClick={() =>
                              handleSendMessage(
                                'What are some practical applications of this topic?',
                              )
                            }
                            className="text-sm bg-slate-700 hover:bg-slate-600 text-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Practical applications
                          </button>
                          <button
                            onClick={() =>
                              handleSendMessage(
                                'Can you provide more examples related to this topic?',
                              )
                            }
                            className="text-sm bg-slate-700 hover:bg-slate-600 text-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            More examples
                          </button>
                          <button
                            onClick={() =>
                              handleSendMessage('What are the latest developments in this field?')
                            }
                            className="text-sm bg-slate-700 hover:bg-slate-600 text-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Latest developments
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Input area */}
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask a question about this note..."
                        className="flex-grow bg-slate-700 border border-slate-600 rounded-l-lg py-2 px-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={!messageInput.trim() || isAiTyping}
                        className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg ${
                          !messageInput.trim() || isAiTyping ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
