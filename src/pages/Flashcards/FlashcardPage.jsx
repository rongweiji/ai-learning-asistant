import React, { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import flashcardService from '../../services/flashcardService'
import aiService from '../../services/aiService'
import PageHeader from '../../Components/common/PageHeader'
import Spinner from '../../Components/common/Spinner'
import EmptyState from '../../Components/common/EmptyState'
import Button from '../../Components/common/Button'
import Modal from '../../Components/common/Modal'
import Flashcard from '../../Components/flashcard/Flashcard'

// Simplified single-set flashcard page with cleaned layout.
const FlashcardPage = () => {
  const { id: documentId } = useParams()
  const [flashcardSet, setFlashcardSet] = useState(null)
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const hasCards = useMemo(() => flashcards.length > 0, [flashcards])

  const fetchFlashcards = async () => {
    setLoading(true)
    try {
      const res = await flashcardService.getFlashcardsForDocument(documentId)
      const firstSet = res.data?.[0]
      setFlashcardSet(firstSet || null)
      setFlashcards(firstSet?.cards || [])
      setCurrentCardIndex(0)
    } catch (error) {
      toast.error(error.message || 'Failed to load flashcards')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (documentId) fetchFlashcards()
  }, [documentId])

  const handleGenerateFlashcards = async () => {
    setGenerating(true)
    try {
      await aiService.generateFlashcards(documentId)
      toast.success('Flashcards generated successfully')
      fetchFlashcards()
    } catch (error) {
      toast.error(error.message || 'Failed to generate flashcards')
    } finally {
      setGenerating(false)
    }
  }

  const handleReview = async (index) => {
    const card = flashcards[index]
    if (!card) return
    try {
      await flashcardService.reviewFlashcard(card._id, index)
    } catch (error) {
      toast.error(error.message || 'Failed to review flashcard')
    }
  }

  const handleNextCard = () => {
    if (!hasCards) return
    handleReview(currentCardIndex)
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length)
  }

  const handlePrevCard = () => {
    if (!hasCards) return
    handleReview(currentCardIndex)
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStarFlashcard(cardId)
      setFlashcards((prevCards) =>
        prevCards.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        )
      )
    } catch (error) {
      toast.error(error.message || 'Failed to toggle star')
    }
  }

  const handleDeleteFlashcardSet = async () => {
    if (!flashcardSet?._id) return
    setDeleting(true)
    try {
      await flashcardService.deleteFlashcardSet(flashcardSet._id)
      toast.success('Flashcard set deleted successfully')
      setIsDeleteModalOpen(false)
      setFlashcardSet(null)
      setFlashcards([])
    } catch (error) {
      toast.error(error.message || 'Failed to delete flashcard set')
    } finally {
      setDeleting(false)
    }
  }

  const renderFlashcardContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner size="lg" />
        </div>
      )
    }

    if (!hasCards) {
      return (
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <EmptyState
            title="No Flashcards"
            description="Generate flashcards for this document to start practicing."
          />
          <Button onClick={handleGenerateFlashcards} disabled={generating}>
            {generating ? <Spinner size="sm" /> : <><Plus className="mr-2 h-4 w-4" /> Generate Flashcards</>}
          </Button>
        </div>
      )
    }

    const currentCard = flashcards[currentCardIndex]

    return (
      <div className="flex flex-col items-center gap-6">
        <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={handlePrevCard}
            disabled={flashcards.length <= 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-slate-600">{`${currentCardIndex + 1} / ${flashcards.length}`}</span>
          <Button
            variant="secondary"
            onClick={handleNextCard}
            disabled={flashcards.length <= 1}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/documents/${documentId}`}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Document
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Flashcards"
          subtitle="Quickly review your generated cards and star the tricky ones."
        />
        <div className="flex items-center gap-2">
          <Button onClick={handleGenerateFlashcards} disabled={generating}>
            {generating ? <Spinner size="sm" /> : <><Plus className="mr-2 h-4 w-4" /> Generate Flashcards</>}
          </Button>
          {hasCards && (
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Set
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {renderFlashcardContent()}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this flashcard set? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500/50"
              disabled={deleting}
              onClick={handleDeleteFlashcardSet}
            >
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

export default FlashcardPage