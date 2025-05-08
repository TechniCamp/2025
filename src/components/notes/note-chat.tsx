import { ChevronDown, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function NoteChat({ noteId }: { noteId: string }) {
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'ai'; content: string }>
  >([])
  const [messageInput, setMessageInput] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)

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
                      handleSendMessage('Can you explain the key concepts in simpler terms?')
                    }
                    className="text-sm bg-slate-700 hover:bg-slate-600 text-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Explain key concepts
                  </button>
                  <button
                    onClick={() =>
                      handleSendMessage('What are some practical applications of this topic?')
                    }
                    className="text-sm bg-slate-700 hover:bg-slate-600 text-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Practical applications
                  </button>
                  <button
                    onClick={() =>
                      handleSendMessage('Can you provide more examples related to this topic?')
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
  )
}
