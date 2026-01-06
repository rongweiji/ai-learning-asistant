import React, { useState, useEffect, use } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

import quizService from '../../services/quizService.js'
import aiService from '../../services/aiService.js'
import Spinner from '../common/Spinner.jsx'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import QuizCard from './QuizCard.jsx'
import EmptyState from '../common/EmptyState.jsx'



const QuizManager = ({ documentId }) => {
    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
    const [numQuestions, setNumQuestions] = useState(5)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [selectdQuiz, setSelectedQuiz] = useState(null)


    const fetchQuizzes = async () => {
        setLoading(true)
        try {
            const res = await quizService.getQuizzesForDocument(documentId)
            setQuizzes(res.data||[])
        } catch (error) {
            toast.error(error.message || "Failed to load quizzes")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (documentId) {
            fetchQuizzes()
        }
    }, [documentId])


    const handleGenrerateQuiz = async (e) => {
        e.preventDefault()
        setGenerating(true)

        try {
            await aiService.generateQuiz(documentId, { numQuestions })
            toast.success("Quiz generated successfully")
            setIsGenerateModalOpen(false)
            fetchQuizzes()

        } catch (error) {
            toast.error(error.message || "Failed to generate quiz")
        }
        finally {
            setGenerating(false)
        }
    }

    const handleDeleteRequest = async (quiz) => {
        setSelectedQuiz(quiz)
        setIsDeleteModalOpen(true)
    }

    const handleComfirmDelete = async () => {
        if (!selectdQuiz) return;
        setDeleting(true)
        try {
            await quizService.deleteQuiz(selectdQuiz._id)
            toast.success("Quiz deleted successfully")
            setIsDeleteModalOpen(false)
            setSelectedQuiz(null)
            setQuizzes(quizzes.filter(q => q._id !== selectdQuiz._id))
        } catch (error) {
            toast.error(error.message || "Failed to delete quiz")
        } finally {
            setDeleting(false)
        }

    }


    const renderQuizContent = () => {
       if (loading) {
            return (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Spinner size="lg" />
                </div>
            )
        }

        if (quizzes.length === 0 ) {
            return (
                <EmptyState
                    title="No Quizzes Available"
                    description="Generate quizzes based on your document to test your knowledge."
                />
            )
        }

        return (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {quizzes.map((quiz) => (
                    <QuizCard key={quiz._id} quiz={quiz} onDelete={() => handleDeleteRequest(quiz)} />
                ))}
            </div>
        )
    }



    return (
        <div>
        <div className='bg-white border border-neutral-200 rounded-lg p-6'>
            <div className='flex justify-end gap-2 mb-4'>
                <Button onClick={() => setIsGenerateModalOpen(true)}><Plus className='mr-2 h-4 w-4' /> Generate New Quiz</Button>
            </div>
            {renderQuizContent()}
        </div>

        {/* Generate Quiz Modal */}
        <Modal isOpen={isGenerateModalOpen} onClose={() => setIsGenerateModalOpen(false)} title="Generate Quiz">
            <form onSubmit={handleGenrerateQuiz} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Number of Questions</label>
                    <input
                        type="number"
                        min={1}
                        max={20}    
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={() => setIsGenerateModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={generating}>
                        {generating ? <Spinner size="sm" /> : 'Generate'}
                    </Button>
                </div>
            </form>
        </Modal>


        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
            <div className="space-y-4">
                <p>Are you sure you want to delete the quiz "{selectdQuiz?.title}"? This action cannot be undone.</p>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                    <Button type="button" variant="danger" disabled={deleting} onClick={handleComfirmDelete}>
                        {deleting ? <Spinner size="sm" /> : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>

</div>
    )
}

export default QuizManager