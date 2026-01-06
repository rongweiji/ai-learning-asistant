import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Sparkles, BookOpen, Lightbulb, Loader2 } from 'lucide-react'
import aiService from '../../services/aiService.js'
import toast from 'react-hot-toast'
import MarkdownRenderer from '../common/MarkdownRenderer.jsx'
import Modal from '../common/Modal.jsx'


const AiAction = () => {
    const { id: documentId } = useParams()
    const [loadingAction, setLoadingAction] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [concept, setConcept] = useState('')

    const handleGenerateSummary = async () => {
        setLoadingAction('summary')
        try {
            const { summary } = await aiService.generateSummary(documentId)
            setModalTitle('Document Summary')
            setModalContent(summary)
            setIsModalOpen(true)

        } catch (error) {
            toast.error(error.message || 'Failed to generate summary')
        } finally {
            setLoadingAction(null)
        }
    }

    const handleExplainConcept = async (e) => {
        e.preventDefault()
        if (!concept.trim()) {
            toast.error('Please enter a concept to explain')
            return
        }
        setLoadingAction('explain')
        try {
            const { explanation } = await aiService.explainConcept(documentId, concept)
            setModalTitle(`Explanation: ${concept}`)
            setModalContent(explanation)
            setIsModalOpen(true)
            setConcept('')
        } catch (error) {
            toast.error(error.message || 'Failed to explain concept')
        } finally {
            setLoadingAction(null)
        }
    }





    return (
        <>
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden">
                {/* header */}
                <div className="p-6 border-b border-slate-200 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">AI Assistant</h3>
                        <p className="text-sm text-slate-500">Summaries and concept explanations for this document</p>
                    </div>
                </div>

                <div className="p-6 grid gap-6 md:grid-cols-2">
                    {/* Generate summary card */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-slate-800">
                            <BookOpen className="h-5 w-5 text-emerald-600" />
                            <h4 className="font-semibold">Generate Summary</h4>
                        </div>
                        <p className="text-sm text-slate-600">Get a concise summary of your document.</p>
                        <button
                            onClick={handleGenerateSummary}
                            disabled={loadingAction === 'summary'}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {loadingAction === 'summary' ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Summarizing...</span>
                                </>
                            ) : (
                                <span>Summarize Document</span>
                            )}
                        </button>
                    </div>

                    {/* Explain concept card */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-slate-800">
                            <Lightbulb className="h-5 w-5 text-emerald-600" />
                            <h4 className="font-semibold">Explain Concept</h4>
                        </div>
                        <p className="text-sm text-slate-600">Enter a topic from the document for a detailed explanation.</p>
                        <form onSubmit={handleExplainConcept} className="flex flex-col gap-3">
                            <input
                                type="text"
                                value={concept}
                                onChange={(e) => setConcept(e.target.value)}
                                disabled={loadingAction === 'explain'}
                                placeholder="e.g. Gradient descent"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={loadingAction === 'explain'}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {loadingAction === 'explain' ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Explaining...</span>
                                    </>
                                ) : (
                                    <span>Explain Concept</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* result modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
            >
                <div className="whitespace-pre-wrap text-sm text-slate-700">
                    <MarkdownRenderer content={modalContent} />
                </div>
            </Modal>

        </>
    )
}

export default AiAction