import React, { useState, useEffect } from 'react'
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,

} from 'lucide-react'
import toast from 'react-hot-toast'
import moment from 'moment'
import aiService from '../../services/aiService.js'
import flashcardService from '../../services/flashcardService.js'
import Spinner from '../common/Spinner.jsx'
import Modal from '../common/Modal'
import Flashcard from './Flashcard.jsx'




const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const res = await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardSets(res.data);
    }
    catch (error) {
      toast.error(error.message || "Failed to load flashcard sets");
      console.error("Error fetching flashcard sets:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (documentId) {
      fetchFlashcardSets();
    }
  }, [documentId]);

  const handleGnerateFlashcards = async () => {
    setGenerating(true);
    try {
      const res = await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully");
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards");
      console.error("Error generating flashcards:", error);
    } finally {
      setGenerating(false);
    }
  }


  const handleNextCard = () => {
    if (!selectedSet?.cards?.length) return;
    handleReivew(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % selectedSet.cards.length);
  }


  const handlePreviousCard = () => {
    if (!selectedSet?.cards?.length) return;
    handleReivew(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length);
  }


  const handleReivew = async (cardIndex) => {
    const currentCard = selectedSet?.cards?.[cardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, cardIndex);
      toast.success("Flashcard reviewed");
    } catch (error) {
      toast.error(error.message || "Failed to review flashcard");
      console.error("Error reviewing flashcard:", error);
    }
  }

  const handleToggle = async (cardId) => {
    if (!cardId) return;
    try {
      const res = await flashcardService.toggleStarFlashcard(cardId);
      const updatedSet = res.data;
      setFlashcardSets((prev) => prev.map((set) => (set._id === updatedSet._id ? updatedSet : set)));
      if (selectedSet?._id === updatedSet._id) {
        setSelectedSet(updatedSet);
      }
      toast.success("Flashcard starred updated");
    } catch (error) {
      toast.error(error.message || "Failed to update flashcard");
      console.error("Error toggling flashcard:", error);
    }
  }


  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  }


  const handleConfirmDelete = async () => {
    if (!setToDelete?._id) return;
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Flashcard set deleted");
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set");
      console.error("Error deleting flashcard set:", error);
    } finally {
      setDeleting(false);
    }
  }


  const handleSlectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  }



  const renderFlashcardView = () => {
    if (!selectedSet) return null;
    const currentCard = selectedSet.cards?.[currentCardIndex];

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setSelectedSet(null)}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sets
          </button>
          <div className="text-sm text-slate-600">
            Card {selectedSet.cards.length ? currentCardIndex + 1 : 0} of {selectedSet.cards.length}
          </div>
        </div>

        {currentCard ? (
          <Flashcard flashcard={currentCard} onToggleStar={() => handleToggle(currentCard._id)} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
            No cards available in this set.
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePreviousCard}
            disabled={!selectedSet.cards.length}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={handleNextCard}
            disabled={!selectedSet.cards.length}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <Spinner size="lg" />
        </div>
      )
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="p-8 flex flex-col items-center text-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70">
          <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <Brain className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-900">No flashcard sets yet</h3>
            <p className="text-sm text-slate-600">Generate flashcards from your document to start learning and reinforce your knowledge.</p>
          </div>
          <button
            onClick={handleGnerateFlashcards}
            disabled={generating}
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-emerald-700 disabled:opacity-50"
          >
            {generating ? (
              <><Spinner size="sm" /> Generating...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generate Flashcards</>
            )}
          </button>
        </div>)
    }
    return (
      <div className="">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className='p-4'>
            <h3 className="text-lg font-semibold text-slate-900">Your Flashcard sets</h3>
            <p className="text-sm text-slate-600">{flashcardSets.length} sets</p>
          </div>
          <div className='p-4'>
            <button
              onClick={handleGnerateFlashcards}
              disabled={generating}
              className=" inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-emerald-700 disabled:opacity-50"
            >
              {generating ? (
                <><Spinner size="sm" /> Generating...</>
              ) : (
                <><Plus className="h-4 w-4" /> Generate New Set</>
              )}
            </button>
          </div>
        </div>

        {/* set grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 px-4 mb-4">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSlectSet(set)}
              className="group cursor-pointer rounded-3xl border border-emerald-100/70 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-emerald-50 shadow-sm">
                  <Brain className="h-5 w-5" strokeWidth={2} />
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDeleteRequest(e, set)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                  aria-label="Delete flashcard set"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 space-y-2">
                <h4 className="text-lg font-semibold text-slate-900">
                  {set.documentId?.title || "Flashcard set"}
                </h4>
                <p className="text-sm text-slate-600">
                  Created {moment(set.createdAt).fromNow()}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-3 py-1 text-emerald-700">
                  {set.cards.length} {set.cards.length === 1 ? "card" : "cards"}
                </span>
                <span className="text-slate-500">Tap to review</span>
              </div>
            </div>
          ))}
        </div>
      </div>)







  }









  return (
    <>
      <div className='bg-white backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50'>
        {selectedSet ? renderFlashcardView() : renderSetList()}
      </div>
      {/* delete comfirmation modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set?">
        <div className="space-y-4">
          <p className="text-sm text-slate-700">
            Are you sure you want to delete this flashcard set? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              disabled={deleting}
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              disabled={deleting}
              onClick={handleConfirmDelete}
              className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default FlashcardManager
