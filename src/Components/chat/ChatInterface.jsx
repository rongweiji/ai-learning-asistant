import React, { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare, Sparkles, Loader2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import aiService from '../../services/aiService.js'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../common/Spinner'
import MarkdownRenderer from '../common/MarkdownRenderer.jsx'

const ChatInterface = () => {
    const { id: documentId } = useParams()
    const { user } = useAuth()
    const [history, setHistory] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                setInitialLoading(true)
                const response = await aiService.getChatHistory(documentId)
                // API returns { success, data: messages }
                setHistory(response.data || [])
            } catch (error) {
                // If no history yet, start empty instead of blocking the UI
                if (error?.status === 404) {
                    setHistory([])
                } else {
                    console.error('Error fetching chat history:', error)
                }
            } finally {
                setInitialLoading(false)
            }
        }

        fetchChatHistory()
    }, [documentId])

    useEffect(() => {
        scrollToBottom()
    }, [history])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!message.trim()) return

        const userMessage = {
            role: 'user',
            content: message.trim(),
            timestamp: new Date(),
        }

        setHistory((prev) => [...prev, userMessage])
        setMessage('')
        setLoading(true)

        try {
            const response = await aiService.chat(documentId, userMessage.content)
            const assistantMessage = {
                role: 'assistant',
                content: response.data.answer,
                timestamp: new Date(),
                relativeChunks: response.data.relativeChunks,
            }
            setHistory((prev) => [...prev, assistantMessage])
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setLoading(false)
        }
    }

    const renderMessage = (msg, index) => {
        const isUser = msg.role === 'user'

        return (
            <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                        <Sparkles className="h-5 w-5 text-slate-600" />
                    </div>
                )}
                <div
                    className={`max-w-lg p-4 rounded-2xl shadow-sm ${isUser ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-900'}`}
                >
                    {isUser ? <p>{msg.content}</p> : <MarkdownRenderer content={msg.content} />}
                    {isUser && user?.username && (
                        <div className="mt-3 text-xs font-semibold opacity-80">{user.username}</div>
                    )}
                </div>
            </div>
        )
    }

    if (initialLoading) {
        return (
            <div className="flex flex-col w-full h-[70vh] max-h-[70vh] bg-white/70 rounded-lg border border-slate-200 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center text-slate-500">
                    <div className="flex items-center gap-3">
                        <MessageSquare strokeWidth={2} />
                        <span>Loading chat history...</span>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-200 flex justify-center">
                    <Spinner />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full h-[70vh] max-h-[70vh] bg-white/70 rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            {/* Messages area */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                {history.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">
                        <MessageSquare className="mx-auto mb-4" />
                        <p>No messages yet. Start the conversation!</p>
                        <p>Ask me anything about this document.</p>
                    </div>
                ) : (
                    history.map(renderMessage)
                )}
                <div ref={messagesEndRef} />
                {loading && (
                    <div className="flex items-center justify-center p-4 text-slate-500 gap-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                    </div>
                )}
            </div>

            {/* Input area */}
            <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-200/60 bg-white/80 flex items-center gap-3"
            >
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                />
                <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
            </form>
        </div>
    )
}

export default ChatInterface