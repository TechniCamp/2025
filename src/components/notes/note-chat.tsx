import { Media } from '@/payload-types'
import { ChevronDown, File, Send, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function Message({ role, content }: { role: 'user' | 'assistant' | 'tool'; content: string }) {
  const [fileId, setFileId] = useState<string | null>(null)
  const [file, setFile] = useState<Media | null>(null)

  let thinking: string | null = null
  let response: string = content

  if (role !== 'user' && content.includes('<think>')) {
    const parts = content.split('</think>')
    thinking = parts[0]?.replace('<think>', '').trim() || null
    response = parts.slice(1).join('</think>').trim()
  }

  useEffect(() => {
    if (role !== 'tool') return

    try {
      JSON.parse(content)
    } catch {
      return
    }

    setFileId(JSON.parse(content).file)
  }, [role, content])

  useEffect(() => {
    if (fileId) {
      const fetchFile = async () => {
        const res = await fetch('/api/media/' + fileId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (res.ok) {
          const data = await res.json()
          setFile(data)
        } else {
          console.error('Error fetching file:', res.statusText)
        }
      }
      fetchFile()
    }
  }, [fileId])

  if (role === 'tool' && fileId && !file) {
    return (
      <div className={`flex justify-start`}>
        <div className={`max-w-[80%] rounded-lg px-4 py-2 bg-slate-700 text-gray-200`}>
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
    )
  }
  if (role === 'tool' && file && fileId) {
    return (
      <div className={`flex justify-start`}>
        <div className={`max-w-[80%] rounded-lg px-4 pl-3 py-2 bg-slate-700 text-gray-200`}>
          <a
            href={file.url || ''}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline flex items-center gap-1"
          >
            <File className="h-4" />
            {file.filename}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-200'
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
      </div>
    </div>
  )
}

export default function NoteChat({ noteId }: { noteId: string }) {
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: 'user' | 'assistant' | 'tool'; content: string }>
  >([])
  const [messageInput, setMessageInput] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)

  // Add this function before the saveNote function
  const handleSendMessage = async (predefinedMessage?: string) => {
    const message = predefinedMessage || messageInput
    if (!message.trim() || isAiTyping) return

    const userMessage = { role: 'user' as const, content: message }
    setChatMessages((prev) => [...prev, userMessage])

    setMessageInput('')
    setIsAiTyping(true)

    const res = await fetch(`/api/notes/${noteId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: chatMessages,
      }),
    })

    if (!res.ok) {
      console.error('Error sending message:', res.statusText)
      return
    }

    const data = await res.json()

    setChatMessages((prev) => [...prev, ...data.response.messages])
    setIsAiTyping(false)
  }

  return (
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
                  {chatMessages
                    .filter((msg) => msg.role !== 'tool' || JSON.parse(msg.content)?.file)
                    .map((message, index) => (
                      <Message key={index} role={message.role} content={message.content} />
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
                  <h4 className="text-lg font-medium mb-2">Ask me anything about this note</h4>
                  <p className="text-gray-400 mb-4">
                    I can help explain concepts, provide additional information, or answer questions
                    about the content.
                  </p>
                </div>
              )}
            </div>

            {/* Suggested questions */}
            {chatMessages.length === 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Suggested questions:</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      handleSendMessage('Can you create me presentaction from that note?')
                    }
                    className="text-sm bg-slate-700 hover:bg-slate-600 text-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Create presentation
                  </button>
                  <button
                    onClick={() =>
                      handleSendMessage('Can you ask me some questions about this note?')
                    }
                    className="text-sm bg-slate-700 hover:bg-slate-600 text-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Ask me questions
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
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 self-stretch rounded-r-lg ${
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
  )
}
